import React from 'react';
import { Circle, Users } from 'lucide-react'; // Adicionei o ícone Users para vagas
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../common/Avatar/Avatar';
import styles from './Mentorcard.module.css';

interface Skill {
  id: string;
  name: string;
}

interface MentorCardProps {
  id: number;
  name: string;
  position: string;
  skills: Skill[];
  anosExperiencia: number;
  isActive: boolean;
  isAvailable: boolean; // Nova Prop vinda do MentorService
  avatarUrl?: string;
  bio?: string;
}

const MentorCard: React.FC<MentorCardProps> = ({ 
  id,
  name, 
  position, 
  skills, 
  anosExperiencia, 
  isActive, 
  isAvailable, // Destruturando a nova prop
  avatarUrl,
  bio
}) => {
  const navigate = useNavigate();
  const displaySkills = skills.slice(0, 5);
  const hasMoreSkills = skills.length > 5;

  console.log(`[MentorCard Render] ${name} (ID: ${id}) - isActive: ${isActive}, isAvailable: ${isAvailable}`);
  console.log(`[MentorCard Status] ${name} - Will show: ${isActive && isAvailable ? 'Ativo' : 'Inativo'} (isActive=${isActive} && isAvailable=${isAvailable})`);

  const handleCardClick = () => {
    console.log(`[MentorCard Click] ${name} (ID: ${id}) - Available: ${isAvailable}`);
    if (isAvailable) {
      console.log(`Navigating to /book-session/${id}`);
      navigate(`/book-session/${id}`, {
        state: {
          mentorId: id,
          mentorName: name,
          mentorPosition: position,
          mentorSkills: skills,
          mentorXp: anosExperiencia,
          mentorAvatar: avatarUrl,
          mentorIsActive: isActive,
          mentorBio: bio
        }
      });
    } else {
      console.log(`Card not clickable - mentor at full capacity`);
    }
  };

  const handleWaitlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Add mentor to waitlist:', id);
    // TODO: Implement waitlist functionality
  };

  return (
    <div 
      className={`mentor-card ${!isAvailable ? 'full-capacity' : 'clickable'}`}
      onClick={handleCardClick}
      role={isAvailable ? 'button' : 'article'}
      tabIndex={isAvailable ? 0 : -1}
    >
      <div className={styles["mentor-card-header"]}>
        <div className={styles["mentor-avatar-container"]}>
          <Avatar avatarUrl={avatarUrl} size={90} /> 
        </div>
        <div className={styles["mentor-info-basic"]}>
          <h3 className={styles["mentor-name"]}>{name}</h3>
          <p className={styles["mentor-position"]}><strong>Cargo:</strong> {position}</p>
        </div>
      </div>

      <div className={styles["mentor-skills-section"]}>
        <p className={styles["skills-label"]}>Habilidades:</p>
        <div className={styles["mentor-skills-list"]}>
          {displaySkills.length > 0 ? (
            <>
              {displaySkills.map((skill) => (
                <span key={skill.id} className={styles["skill-tag"]}>{skill.name}</span>
              ))}
              {hasMoreSkills && (
                <button className={`${styles["skill-tag"]} ${styles["btn-ver-mais"]}`}>+{skills.length - 5}</button>
              )}
            </>
          ) : (
            <p className={styles["no-skills-message"]}>Sem habilidades informadas</p>
          )}
        </div>
      </div>

      <div className={styles["mentor-footer"]}>
        <div className={styles["mentor-stats-row"]}>
          <p className={styles["mentor-xp"]}><strong>Experiência:</strong> {anosExperiencia} anos</p>
          
          {/* Only show "Lista de Espera" badge/button if NO vagas available */}
          {!isAvailable && (
            <div className={`${styles["vacancy-badge"]} ${styles["no-vagas"]}`}>
              <Users size={14} />
              <span>Lista de Espera</span>
            </div>
          )}
        </div>
        
        <div className={styles["mentor-status"]}>
          <strong>Perfil:</strong> {isActive && isAvailable ? 'Ativo' : 'Inativo'}
          <Circle 
            size={12} 
            fill={isActive && isAvailable ? "#4ade80" : "#fb7185"} 
            color="transparent" 
            className={styles["status-dot"]}
          />
        </div>
      </div>

      {/* Show action button only if NO vagas available */}
      {!isAvailable && (
        <button 
          className={`${styles["btn-conectar"]} ${styles["btn-waitlist"]}`}
          onClick={handleWaitlistClick}
        >
          Entrar na Lista
        </button>
      )}
    </div>
  );
};

export default MentorCard;