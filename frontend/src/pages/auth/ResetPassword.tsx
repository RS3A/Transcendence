import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { loginFetch } from '../../services/api';
import './ResetPassword.css'

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validar token ao carregar a página
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setErrorMessage('Token não fornecido. Link inválido.');
        setValidatingToken(false);
        return;
      }

      try {
        const response = await loginFetch('/change-password/validate-token', {
          method: 'POST',
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setTokenValid(true);
          setErrorMessage('');
        } else {
          setErrorMessage('Link expirado ou inválido. Solicite uma nova recuperação de senha.');
          setTokenValid(false);
        }
      } catch (error) {
        console.error('Erro ao validar token:', error);
        setErrorMessage('Erro ao validar token. Tente novamente.');
        setTokenValid(false);
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Mínimo 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Pelo menos 1 letra maiúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Pelo menos 1 número');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Pelo menos 1 símbolo especial');
    }
    
    return errors;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // Validar senhas
    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas não correspondem.');
      setLoading(false);
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setErrorMessage('Senha deve conter: ' + passwordErrors.join(', '));
      setLoading(false);
      return;
    }

    try {
      const response = await loginFetch('/change-password/reset-password', {
        method: 'PUT',
        body: JSON.stringify({ 
          token, 
          newPassword 
        }),
      });

      if (response.ok) {
        alert('Senha alterada com sucesso! Faça login com sua nova senha.');
        navigate('/login');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.message || 'Erro ao resetar senha. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setErrorMessage('Falha na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  if (validatingToken) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authTabs}>
            <button className={styles.active}>Resetar Senha</button>
          </div>
          <div className={styles.loadingMessage}>
            <p>Validando link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authTabs}>
            <button className={styles.active}>Resetar Senha</button>
          </div>
          <div className={styles.errorMessage}>
            <p>{errorMessage}</p>
            <Link to="/forgot" className={styles.authLinkBack}>
              Solicitar nova recuperação de senha
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authTabs}>
          <button className={styles.active}>Resetar Senha</button>
        </div>

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <p className={styles.authDescription}>
            Digite uma nova senha segura com mínimo 8 caracteres, incluindo maiúscula, número e símbolo especial.
          </p>

          {errorMessage && (
            <div className={styles.errorAlert}>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="newPassword">Nova Senha</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Digite a nova senha"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirme a nova senha"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.authSubmit} disabled={loading}>
            {loading ? 'Resetando...' : 'Resetar Senha'}
          </button>

          <Link to="/login" className={styles.authLinkBack}>
            Voltar para o login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
