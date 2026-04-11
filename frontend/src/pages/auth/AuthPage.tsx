import { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import styles from './Auth.module.css';function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className={styles["auth-container"]}>
      <div className={styles["auth-card"]}>
        <div className={styles["auth-tabs"]}>
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >
            Cadastro
          </button>
        </div>

        {mode === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  )
}

export default AuthPage