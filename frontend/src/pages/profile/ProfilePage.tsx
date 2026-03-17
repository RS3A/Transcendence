import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, User, Save, Trash2 } from "lucide-react";
import "./ProfilePage.css";
import InputGroup from "../../components/common/InputGroup/InputGroup";
import Habilities from "../../components/common/Habilities/Habilities";
import Avatar from "../../components/common/Avatar/Avatar";

// 1. Interface atualizada para incluir XP e Level que vêm no novo JSON
interface UserData {
  id?: string;
  nome: string;
  email: string;
  avatarUrl: string;
  cargo: string; // mapeia para 'position' no banco
  presentationText: string; // mapeia para 'bio' no banco
  anosExperiencia: string; // mapeia para 'xp' no banco
  github: string;
  linkedin: string;
  instagram: string;
  telefone: string; // mapeia para 'phoneNumber' no banco
  level?: string;
  xp?: string;
  role: string; // Adicionado para diferenciar mentores de mentorados
}

interface Skill {
  id: string;
  name: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("gerais");
  const [isEditing, setIsEditing] = useState(false);

  // Estados de Dados e Habilidades
  const [userData, setUserData] = useState<UserData>({
    nome: "", email: "", avatarUrl:"", cargo: "", presentationText: "",
    anosExperiencia: "", github: "", linkedin: "", instagram: "",
    telefone: "", level: "0", xp: "0", role: "mentor" 
  });
  const [userSkills, setUserSkills] = useState<Skill[]>([]);

  // Estados de Backup (para o botão Cancelar)
  const [backupData, setBackupData] = useState<UserData | null>(null);
  const [backupSkills, setBackupSkills] = useState<Skill[]>([]);

  // Estados de Senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // Se não há usuário logado, redirecionar para login
      navigate('/auth');
      return;
    }

    const loadFullProfile = async () => {
      // 1. Pega o ID que salvamos no Registro ou Login
      const loggedUserId = localStorage.getItem('userId');

      // Se não achar o ID, manda o cara de volta para o registro/login
      if (!loggedUserId) {
        console.warn("Nenhum usuário logado encontrado.");
        navigate('/register'); 
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/users/${loggedUserId}`); // Usar o ID do usuário logado

        if (response.ok) {
          const data = await response.json();
          const user = data.user;
          const profile = data.profiles && data.profiles.length > 0 ? data.profiles[0] : {};

          const unifiedData: UserData = {
            id: user.id?.toString(),
            nome: user.name || "",
            email: user.email || "",
            avatarUrl:user.avatarUrl || "",
            telefone: user.phoneNumber || "",
            cargo: profile.position || "",
            presentationText: profile.bio || "",
            github: profile.github || "",
            linkedin: profile.linkedin || "",
            instagram: profile.instagram || "",
            anosExperiencia: profile.xp?.toString() || "0",
            level: profile.level?.toString() || "0",
            xp: profile.xp?.toString() || "0",
            role: user.role || "mentor"
          };

          // Carrega as habilidades vindas do MongoDB (campo stacks)
          const loadedSkills: Skill[] = profile.stacks || [];

          setUserData(unifiedData);
          setBackupData(unifiedData);
          setUserSkills(loadedSkills);
          setBackupSkills(loadedSkills);
        } else {
          throw new Error("Dados não encontrados");
        }
      } catch (error) {
        console.warn("Backend offline, carregando Mock...");
        const mockUser: UserData = {
          id: "1", nome: "Marcelo Dias Machado", cargo: "Desenvolvedor Mentor",
          email: "mrl.jose123@gmail.com", avatarUrl: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740&q=80",
          presentationText: "Apaixonado por tecnologia...",
          anosExperiencia: "5", github: "github.com/marcelo",
          linkedin: "linkedin.com/in/marcelo", instagram: "@marcelo",
          telefone: "11949335709", level: "0", xp: "500", role: "mentor",
        };
        const mockSkills: Skill[] = [
          { id: "sk_001", name: "JavaScript" },
          { id: "sk_005", name: "React" },
          { id: "sk_017", name: "MongoDB" }
        ];
        setUserData(mockUser);
        setBackupData(mockUser);
        setUserSkills(mockSkills);
        setBackupSkills(mockSkills);
      }
    };
    loadFullProfile();
  }, []);

  const handleSaveAll = async () => {
    if (!userData) return;

    // Payload formatado para o seu microserviço FastAPI/MongoDB
    const finalPayload = {
      user_id: userData.id,
      position: userData.cargo,
      bio: userData.presentationText,
      github: userData.github,
      linkedin: userData.linkedin,
      instagram: userData.instagram,
      xp: parseInt(userData.anosExperiencia) || 0,
      stacks: userSkills // Envia o array de objetos {id, name}
    };

    try {
      const response = await fetch(`http://localhost:8080/profile/${userData.id}`, {
        method: "POST", // Altere para PUT se o seu backend exigir
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload)
      });

      if (response.ok) {
        console.log("Salvo com sucesso no MongoDB!");
      } else {
        console.warn("Servidor respondeu com erro, simulando salvamento local.");
      }
    } catch (e) {
      console.error("Erro de conexão. Dados mantidos localmente:", finalPayload);
    } finally {
      setBackupData(userData);
      setBackupSkills(userSkills);
      setIsEditing(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Por favor, preencha todos os campos de senha.");
      return;
    }
    alert("Simulando troca de senha no Mock...");
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleCancel = () => {
    if (backupData) setUserData(backupData);
    setUserSkills(backupSkills); // Restaura as habilidades originais
    setIsEditing(false);
  };

  const handleSkillsChange = (newSkills: Skill[]) => {
    setUserSkills(newSkills);
  };


  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <Avatar 
          avatarUrl={userData.avatarUrl} 
          size={128} 
          isEditable={true} 
          onImageChange={(file) => {
            console.log("Arquivo selecionado para upload:", file);
            // Aqui você faria o upload para o banco ou geraria um preview temporário
          }}
        />
        <div className="perfil-badges">
          {/* Exibindo dados que agora vêm do banco dinamicamente */}
          <div className="perfil-badge">Level: {userData.level}</div>
          <div className="perfil-badge">XP: {userData.xp}</div>
        </div>
      </div>

      <div className="perfil-tabs-nav">
        <button
          onClick={() => setAbaAtiva("gerais")}
          className={`perfil-tab-btn ${abaAtiva === "gerais" ? "ativa" : "inativa"}`}
        >
          Dados Gerais
        </button>
        <button
          onClick={() => setAbaAtiva("pessoais")}
          className={`perfil-tab-btn ${abaAtiva === "pessoais" ? "ativa" : "inativa"}`}
        >
          Dados Pessoais
        </button>
      </div>
      <div className="perfil-conteudo">
        <div className="perfil-grid">
          <div className="perfil-coluna">
            <div className="perfil-titulo-secao">
              <span className="perfil-tag-titulo">
                {abaAtiva === "gerais" ? "Pessoa Mentora" : "Dados de contato"}
              </span>

              {isEditing ? (
                <div className="botoes-edicao-topo">
                  <Save
                    size={22}
                    className="perfil-icone-salvar"
                    onClick={handleSaveAll}
                  />
                  <Trash2
                    size={22}
                    className="perfil-icone-cancelar"
                    onClick={handleCancel}
                  />
                </div>
              ) : (
                <Pencil
                  size={18}
                  className="perfil-icone-editar"
                  onClick={() => setIsEditing(true)}
                />
              )}
            </div>

            {abaAtiva === "gerais" ? (
              <>
                <InputGroup
                  placeholder="Nome Completo"
                  value={userData.nome}
                  isEditing={isEditing}
                  onChange={(val) => setUserData({ ...userData, nome: val })}
                />
                <InputGroup
                  placeholder="Cargo"
                  value={userData.cargo}
                  isEditing={isEditing}
                  onChange={(val) => setUserData({ ...userData, cargo: val })}
                />
                <InputGroup
                  label="Carta apresentação:"
                  value={userData.presentationText}
                  isEditing={isEditing}
                  isTextArea={true}
                  onChange={(val) =>
                    setUserData({ ...userData, presentationText: val })
                  }
                />
                <div className="anos-experiencia">
                  <InputGroup
                    label="Anos de experiência"
                    value={userData.anosExperiencia}
                    isEditing={isEditing}
                    isNumeric={true}
                    onChange={(val) => setUserData({ ...userData, anosExperiencia: val })}
                  />
                </div>
              </>
            ) : (
              <>
                <InputGroup
                  placeholder="Github"
                  value={userData.github}
                  isEditing={isEditing}
                  onChange={(val) => setUserData({ ...userData, github: val })}
                />
                <InputGroup
                  placeholder="Linkedin"
                  value={userData.linkedin}
                  isEditing={isEditing}
                  onChange={(val) =>
                    setUserData({ ...userData, linkedin: val })
                  }
                />
                <InputGroup
                  placeholder="Instagram"
                  value={userData.instagram}
                  isEditing={isEditing}
                  onChange={(val) =>
                    setUserData({ ...userData, instagram: val })
                  }
                />
                <InputGroup
                  placeholder="E-mail"
                  value={userData.email}
                  isEditing={isEditing}
                  onChange={(val) => setUserData({ ...userData, email: val })}
                />
                <InputGroup
                  placeholder="Telefone"
                  value={userData.telefone}
                  isEditing={isEditing}
                  isNumeric={true}
                  onChange={(val) =>
                    setUserData({ ...userData, telefone: val })
                  }
                />
              </>
            )}
          </div>
          <div className="perfil-coluna">
            {abaAtiva === "gerais" ? (
            <Habilities 
            selectedSkills={userSkills} 
            onSkillsChange={handleSkillsChange} 
            isEditable={true} 
            title="Habilidades apresentadas para mentorar"
          />
            ) : (
              <div className="perfil-caixa-senha">
                <h3>Alterar a Senha:</h3>
                <input
                  type="password"
                  placeholder="Senha Atual"
                  className="perfil-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Nova Senha"
                  className="perfil-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="senha-dica">
                  Mínimo 8 caracteres, com maiúscula, número e símbolo.
                </p>
                <button
                  className="perfil-botao-salvar"
                  onClick={handleUpdatePassword}
                >
                  Salvar Nova Senha
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
