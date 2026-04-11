import React from 'react';
import { Star } from 'lucide-react';
import styles from './Rating.module.css';

interface RatingProps {
  rating?: number;
  size?: number;
}

const Rating: React.FC<RatingProps> = ({ rating, size = 16 }) => {
  const parsedRating = Number(rating);
  const normalizedRating = Number.isFinite(parsedRating)
    ? Math.max(1, Math.min(5, Math.ceil(parsedRating)))
    : 0;
  
  return (
    <div className={styles.rating}>
      <Star 
        size={size}
        fill="var(--rating-yellow)" 
        color="transparent" 
        className={styles["rating-star"]} 
      />
      <span className={styles["rating-text"]}>{normalizedRating}</span>
    </div>
  );
};

export default Rating;
