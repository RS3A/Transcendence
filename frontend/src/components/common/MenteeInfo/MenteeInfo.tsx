import React, { useState, useEffect } from 'react';
import { User, Circle, MessageCircle, LogOut } from 'lucide-react';
import styles from './MenteeInfo.module.css';
import IconButton from '../IconButton/IconButton';
import menteeService from '../../../services/menteeService';

import type { MenteeDetailData } from '../../../services/menteeService';

interface Skill {
  id: string;
  name: string;
}

interface MenteeCardProps {
  menteeId?: number | string;
  name?: string;
  position?: string;
  skills?: Skill[];
  experience?: string | number;
  isActive?: boolean;
  bio?: string;
  avatarUrl?: string;
  connectionStatus?: 'none' | 'pending' | 'active' | 'loading';
  onLeave?: () => Promise<void>;
  onChat?: () => void;
  onConnect?: () => Promise<void>;
}

const MenteeCard: React.FC<MenteeCardProps> = ({ 
  menteeId,
  name: initialName, 
  position: initialPosition, 
  skills: initialSkills, 
  experience: initialExperience, 
  isActive: initialIsActive, 
  bio: initialBio,
  avatarUrl: initialAvatarUrl,
  connectionStatus,
  onLeave,
  onChat,
  onConnect,
}) => {
  const [fetchedData, setFetchedData] = useState<MenteeDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(!initialName);
  const [error, setError] = useState<string | null>(null);

  // Fetch mentee data if menteeId is provided and initialName is not
  useEffect(() => {
    if (initialName) {
      setIsLoading(false);
      return;
    }

    const fetchMenteeData = async () => {
      if (!menteeId) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const details = await menteeService.getMenteeDetails(Number(menteeId));
        if (details) {
          setFetchedData(details);
        } else {
          throw new Error('Perfil não encontrado');
        }
      } catch (err) {
        console.error('Erro ao buscar dados do mentorado:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenteeData();
  }, [menteeId, initialName]);

  const name = initialName || fetchedData?.name || "Mentorado";
  const position = initialPosition || fetchedData?.position || "Aprendiz";
  const skills = initialSkills || fetchedData?.skills || [];
  const experience = initialExperience || fetchedData?.anosExperiencia || 0;
  const isActive = initialIsActive ?? fetchedData?.isActive ?? true;
  const bio = initialBio || fetchedData?.bio || "Esse mentorado ainda não preencheu a bio.";
  const avatarUrl = initialAvatarUrl || fetchedData?.avatarUrl || "";

  const displaySkills = skills.slice(0, 5);
  const hasMoreSkills = skills.length > 5;

  if (isLoading) {
    return <div className={styles.menteeInfoCard}>Carregando dados...</div>;
  }

  if (error) {
    return <div className={styles.menteeInfoCard}>Erro: {error}</div>;
  }

  return (
    <div className={styles.menteeInfoCard}>
      <div className={styles.menteeInfoCardHeader}>
        <div className={styles.menteeInfoAvatarContainer}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className={styles.menteeAvatarImg} />
          ) : (
            <User size={40} className={styles.menteeAvatarIcon} />
          )}
        </div>
        
        <div className={styles.menteeInfoBasic}>
          <h3 className={styles.menteeInfoName}>{name}</h3>
          <p className={styles.menteeInfoDetails}>{position} | {experience} anos</p>
          <div className={styles.menteeInfoStatus}>
            {isActive ? 'Ativo' : 'Indisponível'}
            <Circle 
              size={12} 
              fill={isActive ? "var(--is-active-green)" : "var(--is-inactive-red)"} 
              color="transparent" 
              className={styles.statusDot2}
            />
          </div>
          <p className={styles.menteeInfoBio}>{bio}</p>
          <div className={styles.menteeInfoSkillsPills}>
            {displaySkills.length > 0 ? (
              <>
                {displaySkills.map((skill) => (
                  <span key={skill.id} className={styles.skillTag}>{skill.name}</span>
                ))}
                {hasMoreSkills && (
                  <button className={`${styles.skillTag} ${styles.btnVerMais}`}>+{skills.length - 5}</button>
                )}
              </>
            ) : (
              <p className={styles.noSkillsMessage}>Sem habilidades informadas</p>
            )}
          </div>
        </div>
      </div>
      <div className={styles.menteeInfoDivider} />

      <div className={styles.menteeInfoFooter}>
        {connectionStatus === 'none' && (
          <IconButton 
            variant="primary" 
            icon={<MessageCircle size={18} />}
            onClick={onConnect}
            disabled={!onConnect}
          >
            Solicitar Mentoria
          </IconButton>
        )}
        {connectionStatus === 'pending' && (
          <IconButton 
            variant="secondary" 
            disabled={true}
          >
            Solicitação Pendente
          </IconButton>
        )}
        {connectionStatus === 'active' && (
          <>
            <IconButton 
              variant="primary" 
              icon={<MessageCircle size={18} />}
              onClick={onChat}
              disabled={!onChat}
            >
              Conversar
            </IconButton>
            <IconButton 
              variant="withdraw" 
              icon={<LogOut size={18} />}
              onClick={onLeave}
              disabled={!onLeave}
            >
              Deixar Mentoria
            </IconButton>
          </>
        )}
        {connectionStatus === 'loading' && (
          <IconButton 
            variant="secondary" 
            disabled={true}
          >
            Carregando...
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default MenteeCard;
