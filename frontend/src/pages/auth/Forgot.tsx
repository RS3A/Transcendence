import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginFetch } from '../../services/api';
import styles from './Forget.module.css'

function Forgot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // Aqui você deve usar o endpoint de recuperação de senha do seu backend
      const response = await loginFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert('Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.');
        navigate('/login');
      } else {
        alert('Erro ao processar solicitação. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Falha na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authTabs}>
          <button className={styles.active}>Recuperar Senha</button>
        </div>

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <p className={styles.authDescription}>
            Enviaremos um código de verificação a este e-mail se corresponder a uma conta do FTBridge.
          </p>

          <input
            type="email"
            placeholder="e-mail cadastrado"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className={styles.authSubmit} disabled={loading}>
            {loading ? 'Enviando...' : 'Confirmar'}
          </button>

          <Link to="/login" className={styles.authLinkBack}>
            Voltar para o login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Forgot;