import React, { useEffect, useState } from 'react';
import { User, Circle, Users, MessageCircle, Star, LogOut } from 'lucide-react';
import styles from './MentorInfo.module.css';
import IconButton from '../IconButton/IconButton';
import Rating from '../Rating/Rating';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../Dialog/Dialog';
import { apiFetch } from '../../../services/api';

interface Skill {
  id: string;
  name: string;
}

interface MentorCardProps {
  mentorId?: number | string;
  menteeProfileId?: number;
  name: string;
  position: string;
  skills: Skill[];
  experience: string | number;
  isActive: boolean;
  bio?: string;
  avatarUrl?: string;
  // Connection callbacks
  connectionStatus?: 'none' | 'pending' | 'active' | 'loading';
  onConnect?: () => void;
  onLeave?: () => void;
  onChat?: () => void;
  rating?: number;
  menteeCount?: number;
}

const MentorCard: React.FC<MentorCardProps> = ({ 
  mentorId,
  menteeProfileId,
  name, 
  position, 
  skills, 
  experience, 
  isActive, 
  bio,
  avatarUrl,
  connectionStatus = 'none',
  onConnect,
  onLeave,
  onChat,
  rating,
  menteeCount
}) => {
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [currentRating, setCurrentRating] = useState<number | undefined>(rating);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canRate = connectionStatus === 'active' && Boolean(mentorId) && Boolean(menteeProfileId);
  const displaySkills = skills.slice(0, 5);
  const hasMoreSkills = skills.length > 5;

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating, mentorId]);

  const handleStarClick = (starValue: number) => {
    setSelectedRating(starValue);
  };

  const handleSubmitRating = async () => {
    if (selectedRating === null || !mentorId || !menteeProfileId) return;

    setIsSubmitting(true);
    try {
      console.log(`Submitting rating for mentor ${mentorId}: ${selectedRating}`);
      
      const response = await apiFetch(`/mentors/${mentorId}/rating`, {
        method: 'POST',
        body: JSON.stringify({ rating: selectedRating, menteeProfileId })
      });
      
      if (!response.ok) {
        throw new Error(`Rating submission failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Rating submission response:', data);
      
      // Update with backend summary (integer average), fallback to selected value.
      const resolvedRating = typeof data?.averageRating === 'number' ? data.averageRating : selectedRating;
      setCurrentRating(resolvedRating);
      
      // Reset and close dialog
      setSelectedRating(null);
      setIsRatingDialogOpen(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Erro ao enviar avaliação. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles["mentor-info-card"]}>
      <div className={styles["mentor-info-card-header"]}>
        <div className={styles["mentor-info-avatar-container"]}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className={styles["mentor-avatar-img"]} />
          ) : (
            <User size={40} className={styles["mentor-avatar-icon"]} />
          )}
        </div>
        
        <div className={styles["mentor-info-basic"]}>
          <h3 className={styles["mentor-info-name"]}>{name}</h3>
          <p className={styles["mentor-info-details"]}>{position} | {experience} anos</p>
          <div className={styles["mentor-info-status"]}>
            {isActive ? 'Ativo' : 'Indisponível'}
            <Circle 
              size={12} 
              fill={isActive ? "var(--is-active-green)" : "var(--is-inactive-red)"} 
              color="transparent" 
              className={styles["status-dot-2"]}
            />
          </div>
          <p className={styles["mentor-info-bio"]}>{bio || "Opa, esse mentor ainda não preencheu a bio."}</p>
          <div className={styles["mentor-info-skills-pills"]}>
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
          <div className={styles["mentor-info-stats-section"]}>
              {currentRating !== undefined && (
                <Rating rating={currentRating} />
              )}
              <div className={styles["mentor-info-mentorships"]}>
                <Users size={16} />
                <span className={styles["mentor-info-mentorships-text"]}>{menteeCount ?? 0}</span>
              </div>
          </div>
        </div>
      </div>
      <div className={styles["mentor-info-divider"]} />

      <div className={styles["mentor-info-footer"]}>
        <IconButton variant="primary" icon={<MessageCircle size={18} />} onClick={onChat}>Conversar</IconButton>
        <IconButton
          variant="secondary"
          icon={<Star size={18} />}
          onClick={() => canRate && setIsRatingDialogOpen(true)}
          disabled={!canRate}
        >
          Avaliar
        </IconButton>

        {connectionStatus === 'loading' && (
          <IconButton variant="secondary" icon={<Circle size={18} />} disabled>Carregando...</IconButton>
        )}
        {connectionStatus === 'none' && (
          <IconButton variant="primary" icon={<Users size={18} />} onClick={onConnect}>Conectar</IconButton>
        )}
        {connectionStatus === 'pending' && (
          <IconButton variant="secondary" icon={<Circle size={18} />} disabled>Aguardando aprovação</IconButton>
        )}
        {connectionStatus === 'active' && (
          <IconButton variant="withdraw" icon={<LogOut size={18} />} onClick={onLeave}>Deixar Mentoria</IconButton>
        )}
      </div>

      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent className={styles["rating-dialog"]}>
          <DialogHeader>
            <DialogTitle>
              O quanto você curtiu esse mentor?
            </DialogTitle>
            <DialogDescription>
              Escolha uma nota de 1 a 5:
            </DialogDescription>
          </DialogHeader>
          <div className={styles["rating-stars-container"]}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconButton 
                key={star} 
                variant="rating"
                onClick={() => handleStarClick(star)}
                className={selectedRating !== null && star <= selectedRating ? 'active' : ''}
              >
                <Star size={24} fill={selectedRating !== null && star <= selectedRating ? 'var(--rating-yellow-medium)' : 'none'} color='var(--rating-yellow-medium)'/>
              </IconButton>
            ))}
          </div>
          <IconButton 
            variant="primary" 
            onClick={handleSubmitRating} 
            disabled={selectedRating === null || isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </IconButton>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorCard;