import { useNavigate } from 'react-router-dom'
import './RegisterForm.css'

function RegisterForm() {
  const navigate = useNavigate()

  return (
    <div className="register-options">
      <p className="register-subtitle">
        Selecione uma opção para se cadastrar
      </p>

      <button
        type="button"
        className="register-option"
        onClick={() => navigate('/register?type=mentorado')}
      >
        <span>Mentorado</span>
        <div className="arrow">→</div>
      </button>

      <button
        type="button"
        className="register-option"
        onClick={() => navigate('/register?type=mentor')}
      >
        <span>Mentor</span>
        <div className="arrow">→</div>
      </button>
    </div>
  )
}

export default RegisterForm