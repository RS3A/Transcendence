function RegisterForm() {
  return (
    <form className="auth-form">
      <p className="auth-description">
        Crie sua conta para começar
      </p>

      <input type="text" placeholder="Nome completo" required />
      <input type="email" placeholder="E-mail" required />
      <input type="password" placeholder="Senha" required />

      <button type="submit" className="auth-submit">
        Cadastrar
      </button>
    </form>
  )
}

export default RegisterForm
