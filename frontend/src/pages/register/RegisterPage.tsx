import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import './RegisterPage.css'
import logo_42 from '../../components/images/jpg/logo-42.png'
import logo_google from '../../components/images/jpg/logo-google.png'

type Errors = {
  name?: string
  phone?: string
  email?: string
  confirmEmail?: string
  password?: string
  confirmPassword?: string
  privacy?: string
  terms?: string
  profileType?: string
}

function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [name, setName] = useState('')
  const [phoneNumber, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [profileType, setProfileType] = useState('') // Added state for profileType

  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setProfileType(type.toUpperCase());
    }
  }, [searchParams]);

  function formatPhone(value: string) {
    const numbers = value.replace(/\D/g, '').slice(0, 11)

    if (numbers.length < 11) return numbers

    return numbers.replace(
      /(\d{2})(\d{5})(\d{4})/,
      '($1) $2-$3'
    )
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(e.target.value))
  }

  function validate(): boolean {
    const newErrors: Errors = {}

    if (!name) newErrors.name = 'Nome completo é obrigatório.'

    if (!profileType) {
      newErrors.profileType = 'Tipo de perfil é obrigatório.'
    }

    if (!phoneNumber) {
      newErrors.phone = 'Celular é obrigatório.'
    } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(phoneNumber)) {
      newErrors.phone = 'Use o formato (xx) xxxxx-xxxx.'
    }

    if (!email) newErrors.email = 'E-mail é obrigatório.'
    if (!confirmEmail) newErrors.confirmEmail = 'Confirme o e-mail.'
    if (email && confirmEmail && email !== confirmEmail) {
      newErrors.confirmEmail = 'Os e-mails não coincidem.'
    }

    if (!password) newErrors.password = 'Senha é obrigatória.'
    if (!confirmPassword) newErrors.confirmPassword = 'Confirme a senha.'
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.'
    }

    if (!acceptPrivacy) {
      newErrors.privacy = 'Você deve aceitar a Política de Privacidade.'
    }

    if (!acceptTerms) {
      newErrors.terms = 'Você deve aceitar os Termos de Uso.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!validate()) return;

  const payload = {
    name,
    profileType,
    phoneNumber,
    email,
    password,
    status: true 
  };

  try {
    const response = await fetch('http://localhost:8080/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // Lemos o JSON apenas UMA vez aqui
    const data = await response.json();

    if (!response.ok) {
      if (data && data[0]?.message) {
          alert(data[0].message);
      }
      throw new Error('Falha ao cadastrar usuário');
    }

    // Se chegou aqui, deu certo! 
    // Extraímos o ID (verifique se seu backend manda como data.id ou data.user.id)
    const userId = data.id || data.user?.id;
    
    if (userId) {
      localStorage.setItem('userId', userId.toString());
      console.log('ID do usuário salvo:', userId);
    }

    navigate('/home-logged');
    
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}
  

  return (
    <main className="register-form-wrapper">
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome Completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="input-error">{errors.name}</span>}

        <input
          type="tel"
          placeholder="Celular"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className={errors.phone ? 'error' : ''}
        />
        {errors.phone && <span className="input-error">{errors.phone}</span>}

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
        
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="input-error">{errors.email}</span>}

        <input
          type="email"
          placeholder="Confirmação de E-mail"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          className={errors.confirmEmail ? 'error' : ''}
        />
        {errors.confirmEmail && (
          <span className="input-error">{errors.confirmEmail}</span>
        )}

        <input
          type="password"
          placeholder="Criação de Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={errors.password ? 'error' : ''}
        />
        {errors.password && (
          <span className="input-error">{errors.password}</span>
        )}

        <input
          type="password"
          placeholder="Confirmação de Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={errors.confirmPassword ? 'error' : ''}
        />
        {errors.confirmPassword && (
          <span className="input-error">{errors.confirmPassword}</span>
        )}

        <label className="checkbox">
          <input
            type="checkbox"
            checked={acceptPrivacy}
            onChange={(e) => setAcceptPrivacy(e.target.checked)}
          />
          <span>Concordo com a Política de Privacidade</span>
        </label>
        {errors.privacy && (
          <span className="input-error">{errors.privacy}</span>
        )}

        <label className="checkbox">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
          <span>Concordo com os Termos de Uso</span>
        </label>
        {errors.terms && (
          <span className="input-error">{errors.terms}</span>
        )}

        <button type="submit" className="submit-btn">
          Enviar
        </button>
      </form>
    </main>
  )
}

export default RegisterPage
