import { useNavigate } from 'react-router-dom'
import styles from './RegisterForm.module.css';function RegisterForm() {
  const navigate = useNavigate()

  return (
    <div className={styles["register-options"]}>
      <p className={styles["register-subtitle"]}>
        Selecione uma opção para se cadastrar
      </p>

      <button
        type="button"
        className={styles["register-option"]}
        onClick={() => navigate('/register?type=mentorado')}
      >
        <span>Mentorado</span>
        <div className={styles.arrow}>→</div>
      </button>

      <button
        type="button"
        className={styles["register-option"]}
        onClick={() => navigate('/register?type=mentor')}
      >
        <span>Mentor</span>
        <div className={styles.arrow}>→</div>
      </button>
    </div>
  )
}

export default RegisterForm