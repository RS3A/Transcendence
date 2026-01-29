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

      <div className="auth-divider">OU</div>

      <button type="button" className="auth-provider">
        Logar com a escola 42
      </button>

      <button type="button" className="auth-provider">
        Logar com o Google
      </button>

      <button type="submit" className="auth-submit">
        Entrar
      </button>
    </form>
  )
}

export default LoginForm
