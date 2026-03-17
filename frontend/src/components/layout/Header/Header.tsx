import { Link } from 'react-router-dom'
import './Header.css'
import logo from '../../images/jpg/logo.jpg'

interface HeaderProps {
  isAuthenticated?: boolean
}

function Header({ isAuthenticated = false }: HeaderProps) {
  return (
    <header className="header">
      {/* Lado esquerdo */}
      <div className="header-left">
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
              <Link to="/home">Home</Link>
              <Link to="/mentorias">Mentoria</Link>
              <Link to="/perfil">Perfil</Link>
            </>
          )}
        </nav>
      </div>

      {/* Lado direito (apenas não autenticado) */}
      {!isAuthenticated && (
        <div className="header-right">
          <Link to="/login" className="header-login-btn">
            Logar
          </Link>
        </div>
      )}
    </header>
  )
}

export default Header
