import React, { useState, useEffect, use } from "react";
// Import do useNavigate mantido caso você precise usar em outro lugar
import { useNavigate } from "react-router-dom"; 
import { Pencil, Save, Trash2 } from "lucide-react";
import styles from './ProfilePage.module.css';
import InputGroup from "../../components/common/InputGroup/InputGroup";
import Habilities from "../../components/common/Habilities/Habilities";
import Avatar from "../../components/common/Avatar/Avatar";
import DropdownList from "../../components/common/Dropdown/Dropdown";
import professionsData from "../../components/common/Dropdown/Profession.json";
import { apiFetch } from "../../services/api";

// 1. Interface atualizada para incluir XP e Level que vêm no novo JSON
interface UserData {
  id?: number;
  profile_id?: number; // Adicionado para mapear o ID do profile, se necessário
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
  level?: number;
  xp?: number;
  role: string; // Adicionado para diferenciar mentores de mentorados
}

interface Skill {
  id: string;
  name: string;
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("gerais");
  const [isEditing, setIsEditing] = useState(false);

  // Estados de Dados e Habilidades
  const [userData, setUserData] = useState<UserData>({
    nome: "", email: "", avatarUrl:"", cargo: "", presentationText: "",
    anosExperiencia: "", github: "", linkedin: "", instagram: "",
    telefone: "", level: 0, xp: 0, role: "MENTOR" 
  });
  const [userSkills, setUserSkills] = useState<Skill[]>([]);

  // Estados de Backup (para o botão Cancelar)
  const [backupData, setBackupData] = useState<UserData | null>(null);
  const [backupSkills, setBackupSkills] = useState<Skill[]>([]);

  // Estados de Senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const professionsOptions = professionsData.professions;

  useEffect(() => {
    const loadFullProfile = async () => {
      // 1. Pega o ID salvo ou força o ID "1" para visualização sem login
      const loggedUserId = localStorage.getItem('userId');
      
      console.log('=== ProfilePage useEffect ===');
      console.log('ID do usuário sendo buscado:', loggedUserId);

      // REMOVIDO: A trava de redirecionamento if (!loggedUserId) navigate('/auth')

      try {
        const response = await apiFetch(`/users/${loggedUserId}`);

        if (response.ok) {
          const data = await response.json();
          const user = data.user;
          const profile = data.profiles && data.profiles.length > 0 ? data.profiles[0] : {};

          const unifiedData: UserData = {
            id: user.id,
            profile_id: profile.id,
            nome: user.name || "",
            email: user.email || "",
            avatarUrl:user.avatarUrl || "",
            telefone: user.phoneNumber || "",
            cargo: profile.position || "",
            presentationText: profile.bio || "",
            github: profile.github || "",
            linkedin: profile.linkedin || "",
            instagram: profile.instagram || "",
            anosExperiencia: profile.anosExperiencia?.toString() || "0",
            level: profile.level || 0,
            xp: profile.xp || 0,
            role: user.role || "mentor"
          };

          // Carrega as habilidades vindas do MongoDB (campo stacks)
          const loadedSkills: Skill[] = profile.stacks || [];

          setUserData(unifiedData);
          if (profile.id) {
          loadProfileImage(profile.id);
        }
          setBackupData(unifiedData);
          setUserSkills(loadedSkills);
          setBackupSkills(loadedSkills);
        } else {
          throw new Error("Dados não encontrados no servidor");
        }
      } catch (error) {
        console.warn("Backend offline ou usuário não encontrado. Carregando Mock...");
        
        const mockUser: UserData = {
          id: Number(loggedUserId), // Mantém o ID que tentou buscar
          nome: "Marcelo Dias Machado", 
          cargo: "Desenvolvedor Mentor",
          email: "mrl.jose123@gmail.com", 
          avatarUrl: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740&q=80",
          presentationText: "Apaixonado por tecnologia e mentoria...",
          anosExperiencia: "5", 
          github: "github.com/marcelo",
          linkedin: "linkedin.com/in/marcelo", 
          instagram: "@marcelo",
          telefone: "11949335709", 
          level: 10, 
          xp: 500, 
          role: "mentor",
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
  }, []); // Removi o `navigate` do array de dependências, já que não o usamos mais dentro do useEffect

const handleSaveAll = async () => {
  if (!userData || !userData.id) return;

  // 1. Payload para o Backend Principal (Dados Pessoais)
  const profilePayload = {
    user_id: userData.id,
    profile_id: userData.profile_id,
    position: userData.cargo,
    bio: userData.presentationText,
    github: userData.github,
    linkedin: userData.linkedin,
    instagram: userData.instagram,
    xp: userData.xp || 0,
    anosExperiencia: parseInt(userData.anosExperiencia) || 0,
    role: userData.role?.toUpperCase()
  };

  // 2. Payload para o Microserviço Python (Skills/Stacks)
  // Mapeamos o array de objetos [{id, name}] para ['name1', 'name2']
  const stacksPayload = {
    stacks: userSkills.map(skill => skill.name)
  };

  try {
    // Requisição 1: Dados do Perfil
    const resProfile = await apiFetch(`/profiles`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profilePayload)
    });

    // Requisição 2: Skills (Java -> proxy Python)
    const profileIdForSkills = userData.profile_id ?? userData.id;
    const resStacks = await apiFetch(`/profiles/${profileIdForSkills}/stacks`, {
      method: "POST",
      body: JSON.stringify(stacksPayload)
    });

    if (resProfile.ok && resStacks.ok) {
      alert("Perfil e habilidades atualizados com sucesso!");
      setBackupData(userData);
      setBackupSkills(userSkills);
      setIsEditing(false);
    } else {
      alert("Erro ao salvar um dos componentes do perfil.");
    }
  } catch (e) {
    console.error("Erro de conexão:", e);
    alert("Erro de conexão com os servidores.");
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

  /**
   * Converte arquivo para Base64
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  /**
   * Faz upload da imagem para o backend
   */
  const handleImageUpload = async (file: File) => {
    if (!userData.id) {
      alert("Erro: ID do usuário não encontrado");
      return;
    }

    try {
      const imageBase64 = await fileToBase64(file);
      
      const response = await apiFetch('/profiles/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: userData.profile_id,
          imageBase64: imageBase64,
          imageFileName: file.name
        })
      });

      if (response.ok) {
        alert('Imagem atualizada com sucesso!');
        // Recarrega a imagem
        loadProfileImage(Number(userData.profile_id));
      } else {
        const errors = await response.json();
        console.error('Erro ao salvar imagem:', errors);
        alert('Erro ao atualizar imagem!');
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro de conexão ao atualizar imagem!');
    }
  };

  /**
   * Recupera a imagem do perfil do backend
   */
  const loadProfileImage = async (profileId: number) => {
  try {
    const response = await apiFetch(`/profiles/image/${profileId}`);
    
    if (response.ok) {
      const data = await response.json();
      
      // Verificamos se o dado existe e extraímos a string base64 corretamente
      if (data && data.avatarUrl) {
        let finalImage = "";
        try {
          // Se o backend enviar como string JSON: {"image_base64": "..."}
          const parsed = JSON.parse(data.avatarUrl);
          finalImage = parsed.image_base64 || parsed.avatarUrl;
        } catch (e) {
          // Se o backend já enviar a string direta (Base64 pura)
          finalImage = data.avatarUrl;
        }

        setUserData((prev: any) => ({
          ...prev,
          avatarUrl: finalImage
        }));
      }
    }
  } catch (error) {
    console.error('Erro ao carregar imagem:', error);
  }
};

  /**
   * Carrega a imagem ao montar o componente
   */
useEffect(() => {
  const loadSkills = async () => {
    // Só prossegue se o userData já tiver o profile_id real vindo do backend principal
    if (!userData.profile_id) return;

    const idParaBusca = userData.profile_id.toString();
    console.log("Buscando skills para o ID consolidado:", idParaBusca);

    try {
      const response = await apiFetch(`/profiles/${idParaBusca}/stacks`);
      if (response.ok) {
        const data = await response.json();
        const formatted = data.stacks.map((s: string, i: number) => ({
          id: `sk_py_${i}`,
          name: s
        }));
        setUserSkills(formatted);
        setBackupSkills(formatted);
      }
    } catch (err) {
      console.error("Erro ao conectar com o Python:", err);
    }
  };

  loadSkills();
}, [userData.profile_id]);



  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <Avatar 
          avatarUrl={userData.avatarUrl} 
          size={128} 
          isEditable={true} 
          onImageChange={(file) => handleImageUpload(file)}
        />
        <div className="perfil-badges">
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
                  onChange={(val) => setUserData({ ...userData, nome: val })}
                />
                <DropdownList
                  options={professionsOptions}
                  value={userData.cargo}
                  isEditing={isEditing}
                  placeholder="Selecione seu cargo"
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
                  onChange={(val) => setUserData({ ...userData, email: val })}
                />
                <InputGroup
                  placeholder="Telefone"
                  value={userData.telefone}
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