import './Header.css'
<<<<<<< HEAD
=======
import logo from '../../images/jpg/logo.png'
>>>>>>> 09d7b60121dd6e23fc9048afff60ee2ed85eb8b2

function Header() {
  return (
<<<<<<< HEAD
    <header className="header">
      Quem somos
      Seja Mentor
      Seja Mentorado
      Logar
=======
    // Adicionamos uma classe dinâmica para mudar o comportamento via CSS
    <header className={`header ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`}>
      
      <img src={logo} alt="Transcendence logo" className="header-logo" />

      <nav className="header-nav">
        {!isAuthenticated ? (
          <>
            <Link to="/about">Quem somos</Link>
            <Link to="/register?type=mentor">Seja Mentor</Link>
            <Link to="/register?type=mentorado">Seja Mentorado</Link>
          </>
        ) : (
          <>
            <Link to="/home-logged">Home</Link>
            <Link to="/mentorias">Mentoria</Link>
            <Link to="/profile">Perfil</Link>
          </>
        )}
      </nav>

      {/* Lado direito (apenas quando NÃO autenticado) */}
      {!isAuthenticated && (
        <div className="header-right">
          <Link to="/login" className="header-login-btn">
            Logar
          </Link>
        </div>
      )}
>>>>>>> 09d7b60121dd6e23fc9048afff60ee2ed85eb8b2
    </header>
  )
}

export default Header