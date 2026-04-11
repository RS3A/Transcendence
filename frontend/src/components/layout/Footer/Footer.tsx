import styles from './Footer.module.css';function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles["footer-nav"]} aria-label="Footer navigation">
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

        <span className={styles["footer-copy"]}>© 2026 Transcendence</span>
      </nav>
    </footer>
  )
}

export default Footer