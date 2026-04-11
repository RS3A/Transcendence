import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Header.css'
import logo from '../../images/jpg/logo.png'
import { clearAuthToken, apiFetch } from '../../../services/api'

interface HeaderProps {
  isAuthenticated?: boolean
}

function Header({ isAuthenticated = false }: HeaderProps) {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState<'MENTOR' | 'MENTEE'>('MENTEE')

  // Fetch user profile from backend when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setUserRole('MENTEE')
      return
    }

    const fetchUserRole = async () => {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        setUserRole('MENTEE')
        return
      }

      try {
        const userRes = await apiFetch(`/users/${userId}`)
        if (userRes.ok) {
          const data = await userRes.json()
          const profiles: any[] = Array.isArray(data.profiles) ? data.profiles : []
          const hasMentorProfile = profiles.some(p => p?.role?.toUpperCase() === 'MENTOR')
          setUserRole(hasMentorProfile ? 'MENTOR' : 'MENTEE')
        } else {
          setUserRole('MENTEE')
        }
      } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error)
        setUserRole('MENTEE')
      }
    }

    fetchUserRole()
  }, [isAuthenticated])

  const handleLogout = () => {
    clearAuthToken()
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
    navigate('/')
  }

  // Determine mentoria link based on user role
  const mentoriaLink = userRole === 'MENTOR' ? '/mentor-dashboard' : '/mentorias'

  return (
    <header className={`header ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`}>
      
      <img src={logo} alt="Transcendence logo" className={styles.headerLogo} />

      <nav className={styles.headerNav}>
        {!isAuthenticated ? (
          <>
            <Link to="/about">Quem somos</Link>
            <Link to="/register?type=MENTOR">Seja Mentor</Link>
            <Link to="/register?type=MENTORADO">Seja Mentorado</Link>
          </>
        ) : (
          <>
            <Link to="/home-logged">Home</Link>
            <Link to={mentoriaLink}>Mentoria</Link>
            <Link to="/profile">Perfil</Link>
            
          </>
        )}
      </nav>

      {/* Lado direito */}
      {!isAuthenticated ? (
        <div className={styles.headerRight}>
          <Link to="/login" className={styles.headerLoginBtn}>
            Logar
          </Link>
        </div>
      ) : (
        <div className={styles.headerRight}>
          <button onClick={handleLogout} className={styles.headerLogoutBtn}>
            Sair
          </button>
        </div>
      )}
    </header>
  )
}

export default Header