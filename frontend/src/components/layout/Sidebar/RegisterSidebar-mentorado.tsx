import styles from './RegisterSidebar-mentorado.module.css'
import illustration from '../../images/svg/cuate.svg'

function RegisterSidebar() {
  return (
    <div className={styles.registerSidebar}>
      <h2>
        Complete os campos<br />
        ao lado para iniciar<br />
        sua jornada como<br />
        <strong>Mentorado</strong>
      </h2>

      <img
        src={illustration}
        alt="Ilustração de mentoria"
        className={styles.registerIllustration}
      />
    </div>
  )
}

export default RegisterSidebar
