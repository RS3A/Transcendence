import './Achievements.css'

// Support both data formats: from HomeLogged (with id/title/icon) and from backend (with name/iconUrl)
export interface Achievement {
  id?: number
  icon?: string
  title?: string
  name?: string
  iconUrl?: string
}

interface AchievementsProps {
  achievements: Achievement[]
  title?: string
}

export const Achievements = ({ achievements, title = 'Conquistas' }: AchievementsProps) => {
  // Handle empty achievements
  if (!achievements || achievements.length === 0) {
    return null
  }

  return (
    <section className={styles.achievementsSection}>
      <h3 className={styles.achievementsTitle}>{title}</h3>
      <div className={styles.achievementsGrid}>
        {achievements.map((a, index) => {
          // Support both naming conventions
          const displayTitle = a.title || a.name || 'Achievementlocked'
          const displayIcon = a.icon || a.iconUrl
          const key = a.id || index

          return (
            <div key={key} className={styles.achievementCard}>
              {displayIcon && (
                <img
                  src={displayIcon}
                  alt={displayTitle}
                  className={styles.achievementIcon}
                  onError={(e) => {
                    // Hide image if it fails to load
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
              <div className={styles.achievementName}>{displayTitle}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Achievements
