import logo_42 from '../../components/images/jpg/logo-42.png'
import logo_google from '../../components/images/jpg/logo-google.png'

function LoginForm() {
  return (
    <form className="auth-form">
      <p className="auth-description">
        Preencha seus dados de acesso para entrar
      </p>

      <input
        type="text"
        placeholder="e-mail ou celular"
        required
      />

      <input
        type="password"
        placeholder="Insira a sua senha"
        required
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

export default LoginForm
