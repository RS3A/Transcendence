import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Circle } from 'lucide-react';
import type { MentorCardData } from '../../services/mentorService';
import mentorService from '../../services/mentorService';
import menteeService from '../../services/menteeService';
import MentorCard from '../../components/common/MentorCard/Mentorcard';
import DropdownList from '../../components/common/Dropdown/Dropdown';
import styles from './MentoriasPage.module.css';

const OPCOES_EXPERIENCIA = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "+10"];
const OPCOES_STATUS = ["Ativo", "Inativo"];
const OPCOES_DISPONIBILIDADE = ["Com Vagas", "Lista de Espera"];

// Componente Interno para a seção "Meus Mentores"
// Adaptado para os dados que vêm da ConnectionResponseDTO do Java
const MiniMentorCard = ({ name, avatarUrl, startDate, status, mentorProfileId }: { name: string, avatarUrl?: string, startDate: string, status: string, mentorProfileId: number }) => {
  const navigate = useNavigate();
  const isActive = status === 'APPROVED';

  const handleCardClick = () => {
    navigate(`/book-session/${mentorProfileId}`);
  };

  return (
    <div className={styles["mini-mentor-card"]} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className={styles["mini-avatar-container"]}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <User size={32} color="#1f2937" />
        )}
      </div>
      <div className={styles["mini-info"]}>
        <h4>{name}</h4>
        <p>Início: {startDate}</p>
        <div className={styles["mini-status"]}>
          <strong>Status:</strong> {isActive ? 'Ativo' : 'Pendente'}
          <Circle size={10} fill={isActive ? "#4ade80" : "#fb7185"} color="transparent" />
        </div>
      </div>
    </div>
  );
};

const MentoriasPage = () => {
  const [mentoresDisponiveis, setMentoresDisponiveis] = useState<MentorCardData[]>([]);
  const [meusMentores, setMeusMentores] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE FILTRO ---
  const [filtroExp, setFiltroExp] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroCargo, setFiltroCargo] = useState("");
  const [filtroHabilidade, setFiltroHabilidade] = useState("");
  const [filtroDisponibilidade, setFiltroDisponibilidade] = useState(""); // Novo filtro
  
  // --- PAGINAÇÃO ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Busca inicial de dados (Mentores da Rede + Minhas Conexões)
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Busca todos os mentores para a vitrine
      // O serviço garante que apenas usuários/perfis com role MENTOR são retornados
      const todos = await mentorService.getAllMentorsForCards();
      console.log("Mentors loaded from service (filtered for MENTOR role):", todos);
      console.log(`Total mentores com role MENTOR: ${todos.length}`);
      console.log("Sample mentor data:", todos[0]);
      console.log('[MentoriasPage] Mentor data with isAvailable:', todos.map(m => ({
        id: m.id,
        name: m.name,
        isActive: m.isActive,
        isAvailable: m.isAvailable
      })));
      setMentoresDisponiveis(todos);

      // 2. Busca conexões do usuário logado (Meus Mentores)
      // Obtém o ID do usuário logado do localStorage
      const logadoId = localStorage.getItem('userId');
      if (logadoId) {
        const conexoes = await mentorService.getMyMentors(parseInt(logadoId));
        console.log("Conexões carregadas:", conexoes);
        setMeusMentores(conexoes);
      } else {
        console.warn("ID do usuário logado não encontrado no localStorage");
        setMeusMentores([]);
      }

    } catch (error) {
      console.error('Erro ao carregar dados da página de mentorias:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch na montagem inicial
  useEffect(() => {
    fetchData();
  }, []);

  // Refetch quando a página fica visível (o usuário volta para ela)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[MentoriasPage] Page became visible, refreshing mentor data...');
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // --- GERAÇÃO DINÂMICA DE OPÇÕES ---
  const opcoesCargos = useMemo(() => 
    Array.from(new Set(mentoresDisponiveis.map(m => m.position))).sort(),
  [mentoresDisponiveis]);

  const opcoesHabilidades = useMemo(() => 
    Array.from(new Set(mentoresDisponiveis.flatMap(m => m.skills.map(s => s.name)))).sort(),
  [mentoresDisponiveis]);

  // Filtra apenas as conexões aprovadas
  const mentoresAtivos = useMemo(() => 
    meusMentores.filter(conn => conn.status === 'APPROVED'),
  [meusMentores]);

  // Enriquece os dados das conexões com informações dos mentores disponíveis (foto, cargo, etc)
  const mentoresAtivosComDetalhes = useMemo(() => {
    return mentoresAtivos.map(conn => {
      // Busca os detalhes do mentor nos mentoresDisponiveis usando mentorProfileId
      const mentorDetalhes = mentoresDisponiveis.find(m => m.id === conn.mentorProfileId);
      return {
        ...conn,
        mentorName: mentorDetalhes?.name || conn.mentorName,
        avatarUrl: mentorDetalhes?.avatarUrl,
        position: mentorDetalhes?.position,
        skills: mentorDetalhes?.skills,
        anosExperiencia: mentorDetalhes?.anosExperiencia
      };
    });
  }, [mentoresAtivos, mentoresDisponiveis]);

  // --- LÓGICA DE FILTRAGEM ---
  const mentoresFiltrados = useMemo(() => {
    return mentoresDisponiveis.filter(mentor => {
      const matchExp = filtroExp === "" || 
        (filtroExp === "+10" ? mentor.anosExperiencia >= 10 : mentor.anosExperiencia >= parseInt(filtroExp));
      
      const matchStatus = filtroStatus === "" || 
        (filtroStatus === "Ativo" ? mentor.isActive : !mentor.isActive);

      const matchCargo = filtroCargo === "" || mentor.position === filtroCargo;

      const matchHabilidade = filtroHabilidade === "" || 
        mentor.skills.some(s => s.name === filtroHabilidade);

      // Lógica do novo filtro de disponibilidade
      const matchDisponibilidade = filtroDisponibilidade === "" || 
        (filtroDisponibilidade === "Com Vagas" ? mentor.isAvailable : !mentor.isAvailable);

      return matchExp && matchStatus && matchCargo && matchHabilidade && matchDisponibilidade;
    });
  }, [mentoresDisponiveis, filtroExp, filtroStatus, filtroCargo, filtroHabilidade, filtroDisponibilidade]);

  // --- CONTROLE DE PAGINAÇÃO ---
  const totalPages = Math.ceil(mentoresFiltrados.length / itemsPerPage);
  const currentMentors = useMemo(() => {
    const mentors = mentoresFiltrados.slice(
      (currentPage - 1) * itemsPerPage, 
      currentPage * itemsPerPage
    );
    console.log('[MentoriasPage] Current mentors to render:', mentors.map(m => ({
      id: m.id,
      name: m.name,
      isActive: m.isActive,
      isAvailable: m.isAvailable
    })));
    return mentors;
  }, [mentoresFiltrados, currentPage, itemsPerPage]);

  const resetarFiltros = () => {
    setFiltroExp("");
    setFiltroStatus("");
    setFiltroCargo("");
    setFiltroHabilidade("");
    setFiltroDisponibilidade("");
    setCurrentPage(1);
  };

  return (
    <div className={styles["mentorias-page-container"]}>
        {/* Seção 1: Meus Mentores (Conexões Reais) */}
        <section className={styles["mentorias-section"]}>
          <h2 className={`${styles["section-title"]} ${styles["title-meus-mentores"]}`}>Meus Mentores</h2>
          <div className={styles["meus-mentores-grid"]}>
            {mentoresAtivosComDetalhes.length > 0 ? (
              mentoresAtivosComDetalhes.map(conn => (
                <MiniMentorCard 
                  key={conn.id} 
                  name={conn.mentorName} 
                  avatarUrl={conn.avatarUrl}
                  startDate={conn.acceptedAt ? new Date(conn.acceptedAt).toLocaleDateString() : 'Pendente'} 
                  status={conn.status}
                  mentorProfileId={conn.mentorProfileId}
                />
              ))
            ) : (
              <p className={styles["no-results"]}>Você ainda não possui conexões de mentoria.</p>
            )}
          </div>
        </section>

        <hr className={styles["section-divider"]} />

        {/* Seção 2: Encontrar Mentores */}
        <section className={styles["mentorias-section"]}>
          <h2 className={styles["section-title"]}>Encontrar Mentores</h2>
          
          <div className={styles["filtros-container"]}>
            <DropdownList 
              label="Habilidades"
              options={opcoesHabilidades}
              value={filtroHabilidade}
              onChange={(val) => { setFiltroHabilidade(val); setCurrentPage(1); }}
              isEditing={true}
              placeholder="Todas"
            />

            <DropdownList 
              label="Cargo"
              options={opcoesCargos}
              value={filtroCargo}
              onChange={(val) => { setFiltroCargo(val); setCurrentPage(1); }}
              isEditing={true}
              placeholder="Todos"
            />

            <DropdownList 
              label="Experiência"
              options={OPCOES_EXPERIENCIA}
              value={filtroExp}
              onChange={(val) => { setFiltroExp(val); setCurrentPage(1); }}
              isEditing={true}
              placeholder="Anos"
            />

            <DropdownList 
              label="Vagas"
              options={OPCOES_DISPONIBILIDADE}
              value={filtroDisponibilidade}
              onChange={(val) => { setFiltroDisponibilidade(val); setCurrentPage(1); }}
              isEditing={true}
              placeholder="Disponibilidade"
            />

            <button className={styles["limpar-filtros-btn"]} onClick={resetarFiltros}>
              Limpar Filtros
            </button>
          </div>

          {loading ? (
            <div className={styles["loading-state"]}>
              <p>Buscando mentores na rede...</p>
            </div>
          ) : (
            <>
              <div className={styles["encontrar-mentores-grid"]}>
                {currentMentors.length > 0 ? (
                  currentMentors.map(mentor => (
                    <MentorCard key={mentor.id} {...mentor} />
                  ))
                ) : (
                  <p className={styles["no-results"]}>Nenhum mentor encontrado com os filtros selecionados.</p>
                )}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo(0,0); }}
                  >
                    Anterior
                  </button>
                  <span className={styles["page-info"]}>Página {currentPage} de {totalPages}</span>
                  <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo(0,0); }}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
  );
};

export default MentoriasPage;