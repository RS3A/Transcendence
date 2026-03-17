import { useState } from 'react'; // Importante para capturar os dados
import { useNavigate } from 'react-router-dom';
import logo_42 from '../../components/images/jpg/logo-42.png'
import logo_google from '../../components/images/jpg/logo-google.png'

function LoginForm() {
  const navigate = useNavigate();
  // 1. Estados para armazenar os inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. Função de submissão baseada no seu modelo
  async function handleSubmit(e) {
    e.preventDefault();

    // Montando o payload apenas com o necessário para login
    const payload = {
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.result && data.result.errors) {
            console.error('Erros de validação:', data.result.errors);
        }
        throw new Error('Falha ao realizar login');
      }

      console.log('Login realizado com sucesso:', data);
      
      // Armazenar o ID do usuário logado no localStorage
      const userId = data.user?.id || data.id;
      if (userId) {
        localStorage.setItem('userId', userId.toString());
      }
      
      // Redirecionar para a página inicial logada
      navigate('/home-logged');
      
    } catch (error) {
      console.error('Erro na requisição:', error);
    }

    console.log('JSON enviado para o backend:', payload);
  }

  return (
    /* 3. Adicionado o onSubmit no form */
    <form className="auth-form" onSubmit={handleSubmit}>
      <p className="auth-description">
        Preencha seus dados de acesso para entrar
      </p>

      <input
        type="email" // Alterado para email para validação nativa do browser
        placeholder="e-mail"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
      />

      <input
        type="password"
        placeholder="Insira a sua senha"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)} // Atualiza o estado
      />

      <a href="#" className="auth-link">
        Esqueceu a sua senha?
      </a>

      <div className="social-buttons">
        <button type="button" className="social-btn">
          <img src={logo_google} alt="Google" />
          <span>Continuar com Google</span>
        </button>

        <button type="button" className="social-btn">
          <img src={logo_42} alt="42" />
          <span>Continuar com a 42</span>
        </button>
      </div>

      <button type="submit" className="auth-submit">
        Entrar
      </button>
    </form>
  )
}

export default LoginForm;