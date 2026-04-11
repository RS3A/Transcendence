import './ProgressBar.css'
import { normalizeGamificationState } from '../../../utils/gamificationLevels'

interface ProgressBarProps {
  currentXp: number
  nextLevelXp: number | null
  currentLevel: number
  size?: 'small' | 'medium' | 'large'
}

/**
 * ProgressBar Component
 * 
 * Displays XP progress within the current level as a visual bar.
 * Calculates fill percentage based on:
 * - XP earned in current level / Total XP required for current level
 * 
 * Example: Level 2 (500-1500 XP)
 * - User has 750 XP
 * - Progress: (750 - 500) / (1500 - 500) = 25%
 */
export const ProgressBar = ({
  currentXp,
  nextLevelXp,
  currentLevel,
  size = 'medium',
}: ProgressBarProps) => {
  const normalized = normalizeGamificationState({
    totalXp: currentXp,
    currentLevel,
    nextLevelXp,
  })

  const displayXp = normalized.totalXp
  const displayLevel = normalized.currentLevel
  const displayNextLevelXp = normalized.nextLevelXp
  const currentLevelXpThreshold =
    displayLevel === 5 ? 5000 :
    displayLevel === 4 ? 3000 :
    displayLevel === 3 ? 1500 :
    displayLevel === 2 ? 500 :
    0

  const fillPercentage = (() => {
    if (!displayNextLevelXp) {
      return 100
    }

    const xpInCurrentLevel = displayXp - currentLevelXpThreshold
    const xpRequiredInCurrentLevel = displayNextLevelXp - currentLevelXpThreshold

    if (xpRequiredInCurrentLevel <= 0) {
      return 100
    }

    return Math.min(Math.max((xpInCurrentLevel / xpRequiredInCurrentLevel) * 100, 0), 100)
  })()

  return (
    // <div className={`progress-bar progress-bar--${size}`}>
      <div className={styles.progressBarTrack} data-size={size}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${fillPercentage}%` }}
        />
        <div className={styles.progressBarLabel}>
          {displayNextLevelXp
            ? `XP: ${Math.floor(displayXp)} / ${Math.floor(displayNextLevelXp)}`
            : `XP: ${Math.floor(displayXp)} / MAX`}
        </div>
      </div>
    // </div>
  )
}

export default ProgressBar
