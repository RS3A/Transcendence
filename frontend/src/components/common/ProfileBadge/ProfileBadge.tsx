import styles from './ProfileBadge.module.css';

export const ProfileBadge = ({ text }: { text: string }) => {
  return <div className={styles["profile-badge"]}>{text}</div>;
};