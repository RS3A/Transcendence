import { useState, useEffect, useMemo } from 'react';
import { User, Circle } from 'lucide-react';
import type { MentorCardData } from '../../services/mentorService';
import mentorService from '../../services/mentorService';
import MentorCard from '../../components/common/MentorCard/Mentorcard';
import AppShell from '../../components/layout/AppShell/AppShell';
import DropdownList from '../../components/common/Dropdown/Dropdown';
import './MentoriasPage.css';

const OPCOES_EXPERIENCIA = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "+10"];
const OPCOES_STATUS = ["Ativo", "Inativo"];

const MiniMentorCard = ({ name, startDate, isActive }: { name: string, startDate: string, isActive: boolean }) => (
  <div className="mini-mentor-card">
    <div className="mini-avatar-container">
      <User size={32} color="#1f2937" />
    </div>
    <div className="mini-info">
      <h4>{name}</h4>
      <p>Data de início: {startDate}</p>
      <div className="mini-status">
        <strong>Status:</strong> {isActive ? 'Ativo' : 'Inativo'}
        <Circle size={10} fill={isActive ? "#4ade80" : "#fb7185"} color="transparent" />
      </div>
    </div>
  </div>
);

const MentoriasPage = () => {
  const [mentoresDisponiveis, setMentoresDisponiveis] = useState<MentorCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroExp, setFiltroExp] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroCargo, setFiltroCargo] = useState("");
  const [filtroHabilidade, setFiltroHabilidade] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const meusMentores = [
    { id: 101, name: "Ciclano", startDate: "03/03/2026", isActive: true },
    { id: 102, name: "Fulano", startDate: "05/03/2026", isActive: true },
  ];

  useEffect(() => {
    const fetchMentores = async () => {
      try {
        const mentores = await mentorService.getAllMentorsForCards();
        setMentoresDisponiveis(mentores);
      } catch (error) {
        console.error('Erro ao buscar mentores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentores();
  }, []);

  const opcoesCargos = useMemo(() => 
    Array.from(new Set(mentoresDisponiveis.map(m => m.position))).sort(),
  [mentoresDisponiveis]);

  const opcoesHabilidades = useMemo(() => 
    Array.from(new Set(mentoresDisponiveis.flatMap(m => m.skills.map(s => s.name)))).sort(),
  [mentoresDisponiveis]);

  const mentoresFiltrados = mentoresDisponiveis.filter(mentor => {
    const matchExp = filtroExp === "" || 
      (filtroExp === "+10" ? mentor.anosExperiencia >= 10 : mentor.anosExperiencia === parseInt(filtroExp));
    const matchStatus = filtroStatus === "" || 
      (filtroStatus === "Ativo" ? mentor.isActive : !mentor.isActive);
    const matchCargo = filtroCargo === "" || mentor.position === filtroCargo;
    const matchHabilidade = filtroHabilidade === "" || 
      mentor.skills.some(s => s.name === filtroHabilidade);

    return matchExp && matchStatus && matchCargo && matchHabilidade;
  });

  const currentMentors = mentoresFiltrados.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <AppShell sidebar={null}>
        <section className="mentorias-section">
          <h2 className="section-title title-meus-mentores">Meus Mentores</h2>
          <div className="meus-mentores-grid">
            {meusMentores.map(mentor => (
              <MiniMentorCard key={mentor.id} {...mentor} />
            ))}
          </div>
        </section>

        <main className="mentorias-page-container">
          <section className="mentorias-section">
            <h2 className="section-title">Encontrar Mentores</h2>
            <div className="filtros-container">
              <DropdownList 
                label="Habilidades"
                options={opcoesHabilidades}
                value={filtroHabilidade}
                isEditing={true}
                onChange={(val) => { setFiltroHabilidade(val); setCurrentPage(1); }}
                placeholder="Todas"
              />
              <DropdownList 
                label="Cargo"
                options={opcoesCargos}
                value={filtroCargo}
                isEditing={true}
                onChange={(val) => { setFiltroCargo(val); setCurrentPage(1); }}
                placeholder="Todos"
              />
              <DropdownList 
                label="Experiência"
                options={OPCOES_EXPERIENCIA}
                value={filtroExp}
                isEditing={true}
                onChange={(val) => { setFiltroExp(val); setCurrentPage(1); }}
                placeholder="Anos"
              />
              <button className="limpar-filtros-btn" onClick={() => { setFiltroExp(""); setFiltroStatus(""); setFiltroCargo(""); setFiltroHabilidade(""); }}>
                Limpar Filtros
              </button>
            </div>

            {loading ? <p>Carregando mentores...</p> : (
              <div className="encontrar-mentores-grid">
                {currentMentors.map(profile => <MentorCard key={profile.id} {...profile} />)}
              </div>
            )}
          </section>
        </main>
    </AppShell>
  );
};

export default MentoriasPage;