import './Footer.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.footerNav} aria-label="Footer navigation">
        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
        >
          Termos de Uso
        </a>

        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Política de Privacidade
        </a>

        <span className={styles.footerCopy}>© 2026 Transcendence</span>
      </nav>
    </footer>
  )
}

export default Footer