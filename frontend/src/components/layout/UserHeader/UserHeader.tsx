import Avatar from '../../common/Avatar/Avatar'
import './UserHeader.css'

function UserHeader() {
  return (
    <section className="user-header">
      <div className="profile-section">
        <div className="profile-left">
          <Avatar />
          <span className="mentor-badge">Pessoa Mentora</span>
        </div>

        <div className="profile-stats">
          <div className="stat-pill level">Nível XX</div>
          <div className="stat-pill xp">XX &nbsp; XP</div>
          <div className="stat-pill days">XX &nbsp; Dias ensinando &nbsp; 🔥</div>
        </div>
      </div>
    </section>
  )
}

export default UserHeader
