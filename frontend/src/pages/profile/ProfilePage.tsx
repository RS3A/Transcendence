import React, { useState, useEffect } from "react";
import { Pencil, Save, Trash2 } from "lucide-react";
import styles from './ProfilePage.module.css';
import InputGroup from "../../components/common/InputGroup/InputGroup";
import Habilities from "../../components/common/Habilities/Habilities";
import Avatar from "../../components/common/Avatar/Avatar";
import ProgressBar from "../../components/common/ProgressBar/ProgressBar";
import { apiFetch } from "../../services/api";
import { normalizeGamificationState } from "../../utils/gamificationLevels";
import DropdownList from "../../components/common/Dropdown/Dropdown";
import professionsData from "../../components/common/Dropdown/Profession.json";

interface UserData {
  id?: number;
  profile_id?: number;
  nome: string;
  email: string;
  avatarUrl: string;
  cargo: string;
  presentationText: string;
  anosExperiencia: string;
  github: string;
  linkedin: string;
  instagram: string;
  telefone: string;
  level?: number;
  xp?: number;
  nextLevelXp?: number | null;
  role: string;
}

interface Skill {
  id: string;
  name: string;
}

export const ProfilePage = () => {
  // const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("gerais");
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    nome: "", email: "", avatarUrl:"", cargo: "", presentationText: "",
    anosExperiencia: "", github: "", linkedin: "", instagram: "",
    telefone: "", level: 0, xp: 0, role: "MENTOR" 
  });
  const [userSkills, setUserSkills] = useState<Skill[]>([]);

  const [backupData, setBackupData] = useState<UserData | null>(null);
  const [backupSkills, setBackupSkills] = useState<Skill[]>([]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const professionsOptions = professionsData.professions;

  useEffect(() => {
    const loadFullProfile = async () => {
      const loggedUserId = localStorage.getItem('userId');

      console.log('=== ProfilePage useEffect ===');
      console.log('ID do usuário sendo buscado:', loggedUserId);

      try {
        const response = await apiFetch(`/users/${loggedUserId}`);

        if (response.ok) {
          const data = await response.json();
          console.log("=== DEBUG BACKEND ===");
          console.log("Objeto User completo:", data.user);
          console.log("Role que veio do banco:", data.user.role);
          console.log("Tipo do Role:", typeof data.user.role);

          const user = data.user;
          const profiles = Array.isArray(data.profiles) ? data.profiles : [];
          const profile =
            profiles.find((p: any) => String(p.role || "").toUpperCase() === "MENTOR") ||
            profiles[0] ||
            {};

          let level = profile.level || 0;
          let xp = profile.xp || 0;
          let nextLevelXp: number | null = null;

          try {
            const gamificationRes = await apiFetch(`/gamification/users/${loggedUserId}/summary`);
            if (gamificationRes.ok) {
              const gamificationData = await gamificationRes.json();
              level = gamificationData?.currentLevel ?? level;
              xp = gamificationData?.totalXp ?? xp;
              nextLevelXp = gamificationData?.nextLevelXp ?? null;
              console.log("Gamification data loaded:", { level, xp, nextLevelXp });
            }
          } catch (err) {
            console.warn("Failed to load gamification data, using profile values:", err);
          }

          const normalizedInitial = normalizeGamificationState({
            totalXp: xp,
            currentLevel: level,
            nextLevelXp,
          });

          const unifiedData: UserData = {
            id: user.id,
            profile_id: profile.id,
            nome: user.name || "",
            email: user.email || "",
            avatarUrl: user.avatarUrl || "",
            telefone: user.phoneNumber || "",
            cargo: profile.position || "",
            presentationText: profile.bio || "",
            github: profile.github || "",
            linkedin: profile.linkedin || "",
            instagram: profile.instagram || "",
            anosExperiencia: profile.anosExperiencia?.toString() || "0",
            level: normalizedInitial.currentLevel,
            xp: normalizedInitial.totalXp,
            nextLevelXp: normalizedInitial.nextLevelXp,
            role: (profile.role || "MENTOR").toString()
          };

          let finalData = unifiedData;
          try {
            const summaryResponse = await apiFetch(`/gamification/users/${user.id}/summary`);
            if (summaryResponse.ok) {
              const summary = await summaryResponse.json();
              finalData = {
                ...unifiedData,
                level: summary?.currentLevel ?? unifiedData.level ?? 0,
                xp: summary?.totalXp ?? unifiedData.xp ?? 0,
                nextLevelXp: summary?.nextLevelXp ?? unifiedData.nextLevelXp ?? null,
              };
            }
          } catch (summaryError) {
            console.warn("Falha ao carregar summary de gamificação no Profile:", summaryError);
          }

          const normalizedFinal = normalizeGamificationState({
            totalXp: finalData.xp,
            currentLevel: finalData.level,
            nextLevelXp: finalData.nextLevelXp,
          });
          finalData = {
            ...finalData,
            level: normalizedFinal.currentLevel,
            xp: normalizedFinal.totalXp,
            nextLevelXp: normalizedFinal.nextLevelXp,
          };

          const loadedSkills: Skill[] = profile.stacks || [];

          setUserData(finalData);

          if (profile.id)
            loadProfileImage(profile.id);

          setBackupData(finalData);
          setUserSkills(loadedSkills);
          setBackupSkills(loadedSkills);
        } else {
          throw new Error("Dados não encontrados no servidor");
        }
      } catch (error) {
        console.warn("Backend offline ou usuário não encontrado. Carregando Mock...");

        const mockUser: UserData = {
          id: Number(loggedUserId),
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
  }, []);

  const handleSaveAll = async () => {
  console.log("INICIANDO SALVAMENTO...");

  if (!userData.id) {
    alert("Erro: ID do usuário não encontrado no estado.");
    return;
  }

  const payload = {
    user_id: userData.id,
    profile_id: userData.profile_id,
    position: userData.cargo,
    bio: userData.presentationText,
    role: userData.role || "MENTOR",
    github: userData.github,
    linkedin: userData.linkedin,
    instagram: userData.instagram,
    anosExperiencia: parseInt(userData.anosExperiencia) || 0,
    level: userData.level || 0,
    xp: userData.xp || 0
  };

  const stacksPayload = {
    stacks: userSkills.map(skill => skill.name)
  };

  console.log("Enviando payload completo:", payload);
  console.log("Enviando skills via Java API:", stacksPayload);

  try {
    const userPayload = {
      id: userData.id,
      name: userData.nome,
      email: userData.email,
      phoneNumber: userData.telefone
    };
    const userRes = await apiFetch(`/users`, {
      method: 'PUT',
      body: JSON.stringify(userPayload)
    });

    const res = await apiFetch('/profiles', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    // Requisição 2: Salvar skills (Java -> proxy Python)
    const profileIdForSkills = userData.profile_id ?? userData.id;
    const resPython = await apiFetch(`/profiles/${profileIdForSkills}/stacks`, {
      method: 'POST',
      body: JSON.stringify(stacksPayload)
    });

    if (res.ok && resPython.ok && userRes.ok) {
      alert("Perfil e habilidades atualizados com sucesso!");

      setIsEditing(false);
      setBackupData(userData);
      setBackupSkills(userSkills);

    } else {
      const errorData = await res.json().catch(() => ({}));
      const errorDataPython = await resPython.json().catch(() => ({}));

      console.error("Erro do servidor principal:", res.status, errorData);
      console.error("Erro do Python API:", resPython.status, errorDataPython);

      if (!res.ok && res.status === 401) {
        alert("Erro 401: Sua sessão expirou ou você não tem permissão.");
      } else if (!resPython.ok) {
        alert(`Erro ao salvar habilidades: ${errorDataPython.detail || 'Verifique os dados e tente novamente.'}`);
      } else {
        alert(`Erro ao salvar: ${errorData.message || 'Verifique os dados e tente novamente.'}`);
      }
    }
  } catch (err) {
    console.error("Erro de conexão na chamada API:", err);
    alert("Não foi possível conectar ao servidor. Verifique sua internet.");
  }
};

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Por favor, preencha todos os campos de senha.");
      return;
    }

    const passwordPayload = {
      email: userData.email,
      oldPassword: currentPassword,
      newPassword: newPassword
    };

    const response = await apiFetch('/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordPayload)
    });

    if (response.ok) {
      alert("Senha atualizada com sucesso!");
    } else {
      const errors = await response.json();
      console.error('Erro ao atualizar senha:', errors);
      alert('Erro ao atualizar senha: ' + (errors.message || 'Verifique os dados e tente novamente.'));
    }

    setCurrentPassword("");
    setNewPassword("");
  };

  const handleCancel = () => {
    if (backupData) 
      setUserData(backupData);
    setUserSkills(backupSkills);
    setIsEditing(false);
  };

  const handleSkillsChange = (newSkills: Skill[]) => {
    setUserSkills(newSkills);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!userData.id) {
      alert("Erro: ID do usuário não encontrado");
      return;
    }

    try {
      const imageBase64 = await fileToBase64(file);
      
      const response = await apiFetch('/profiles/image', {
        method: 'POST',
        body: JSON.stringify({
          profileId: userData.profile_id,
          imageBase64: imageBase64,
          imageFileName: file.name
        })
      });

      if (response.ok) {
        alert('Imagem atualizada com sucesso!');
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

  const loadProfileImage = async (profileId: number) => {
    try {
      const response = await apiFetch(`/profiles/image/${profileId}`);
    
      if (response.ok) {
        const data = await response.json();
      
        if (data && data.avatarUrl) {
          let finalImage = "";
          try {
            const parsed = JSON.parse(data.avatarUrl);
            finalImage = parsed.image_base64 || parsed.avatarUrl;
          } catch (e) {
          finalImage = data.avatarUrl;
        }

        setUserData((prev: any) => ({
          ...prev,
          avatarUrl: finalImage
        }));
        setBackupData((prev: any) => ({
          ...prev,
          avatarUrl: finalImage
        }));
      }
    }
  } catch (error) {
    console.error('Erro ao carregar imagem:', error);
  }
};

useEffect(() => {
  const loadSkills = async () => {
    const profileIdForSkills = userData.profile_id ?? userData.id;
    if (!profileIdForSkills) return;

    const idParaBusca = profileIdForSkills.toString();
    console.log("Buscando skills para o ID consolidado:", idParaBusca);

    try {
      const response = await apiFetch(`/profiles/${idParaBusca}/stacks`);
      if (response.ok) {
        const data = await response.json();
        const stacks = Array.isArray(data.stacks) ? data.stacks : [];
        const formatted = stacks.map((s: string, i: number) => ({
          id: `sk_py_${i}`,
          name: s
        }));
        console.log("Skills carregadas com sucesso:", formatted);
        setUserSkills(formatted);
        setBackupSkills(formatted);
      } else if (response.status === 404) {
        // Se não houver skills salvos ainda, apenas use array vazio
        console.log("Nenhuma skill salva ainda para este perfil");
        setUserSkills([]);
        setBackupSkills([]);
      } else {
        console.warn("Erro ao buscar skills:", response.status);
      }
    } catch (err) {
      console.error("Erro ao conectar com o Python API:", err);
    }
  };

  loadSkills();
}, [userData.id, userData.profile_id]);

useEffect(() => {
  const loadGamificationData = async () => {
    const loggedUserId = localStorage.getItem('userId');
    if (!loggedUserId) return;

    try {
      const gamificationRes = await apiFetch(`/gamification/users/${loggedUserId}/summary`);
      if (gamificationRes.ok) {
        const gamificationData = await gamificationRes.json();
        const normalized = normalizeGamificationState({
          totalXp: gamificationData?.totalXp ?? userData.xp,
          currentLevel: gamificationData?.currentLevel ?? userData.level,
          nextLevelXp: gamificationData?.nextLevelXp ?? userData.nextLevelXp,
        });

        const newLevel = normalized.currentLevel;
        const newXp = normalized.totalXp;
        const newNextLevelXp = normalized.nextLevelXp;

        if (newLevel !== userData.level || newXp !== userData.xp || newNextLevelXp !== userData.nextLevelXp) {
          console.log("Atualizando badges de gamification:", { newLevel, newXp, newNextLevelXp });
          setUserData(prev => ({
            ...prev,
            level: newLevel,
            xp: newXp,
            nextLevelXp: newNextLevelXp
          }));
        }
      }
    } catch (err) {
      console.warn("Erro ao atualizar dados de gamification:", err);
    }
  };

  const interval = setInterval(loadGamificationData, 30000);

  loadGamificationData();

  return () => clearInterval(interval);
}, []);

  return (
    <div className={styles.perfilContainer}>
      <div className={styles.perfilHeader}>
        <Avatar
          avatarUrl={userData.avatarUrl}
          size={128}
          isEditable={true}
          onImageChange={(file) => handleImageUpload(file)}
        />
        <div className={styles.perfilBadges}>
          <ProgressBar
            currentXp={userData.xp || 0}
            nextLevelXp={userData.nextLevelXp}
            currentLevel={userData.level || 0}
            size="medium"
          />
          <div className={styles.perfilBadge}>Level: {userData.level || 0}</div>
          <div className={styles.perfilBadge}>XP: {userData.xp || 0}</div>
        </div>
      </div>

      <div className={styles.perfilTabsNav}>
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
      <div className={styles.perfilConteudo}>
        <div className={styles.perfilGrid}>
          <div className={styles.perfilColuna}>
            <div className={styles.perfilTituloSecao}>
              <span className={styles.perfilTagTitulo}>
                {abaAtiva === "gerais" 
                  ? (userData.role?.toLowerCase() === "mentor" ? "Pessoa Mentora" : "Pessoa Mentorada")
                  : "Dados de contato"}
              </span>

              {isEditing ? (
                <div className={styles.botoesEdicaoTopo}>
                  <Save
                    size={22}
                    className={styles.perfilIconeSalvar}
                    onClick={handleSaveAll}
                  />
                  <Trash2
                    size={22}
                    className={styles.perfilIconeCancelar}
                    onClick={handleCancel}
                  />
                </div>
              ) : (
                <Pencil
                  size={18}
                  className={styles.perfilIconeEditar}
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
                <div className={styles.anosExperiencia}>
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
                  isNumeric={true}
                  isEditing={isEditing}
                  onChange={(val) =>
                    setUserData({ ...userData, telefone: val })
                  }
                />
              </>
            )}
          </div>
          <div className={styles.perfilColuna}>
            {abaAtiva === "gerais" ? (
            <Habilities 
              selectedSkills={userSkills} 
              onSkillsChange={handleSkillsChange} 
              isEditable={true} 
              title={
                userData.role?.toLowerCase() === "mentor" 
                  ? "Habilidades apresentadas para mentorar" 
                  : "Habilidades que quero receber mentoria"}
              />
            ) : (
              <div className={styles.perfilCaixaSenha}>
                <h3>Alterar a Senha:</h3>
                <input
                  type="password"
                  placeholder="Senha Atual"
                  className={styles.perfilInput}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Nova Senha"
                  className={styles.perfilInput}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className={styles.senhaDica}>
                  Mínimo 8 caracteres, com maiúscula, número e símbolo.
                </p>
                <button
                  className={styles.perfilBotaoSalvar}
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