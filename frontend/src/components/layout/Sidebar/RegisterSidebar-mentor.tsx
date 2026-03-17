import './RegisterSidebar-mentor.css'
import illustration from '../../images/svg/mentor.svg'

function RegisterSidebar() {
  return (
    <div className="register-sidebar">
      <h2>
        Complete os campos<br />
        ao lado para iniciar<br />
        sua jornada como<br />
        <strong>Mentor</strong>
      </h2>

      <img
        src={illustration}
        alt="Ilustração de mentoria"
        className="register-illustration"
      />
    </div>
  )
}

export default RegisterSidebar
