import './Header.css'

function Header() {
	return (
		<header className="header">
			<nav>
				<ul>
					<li><a href="#quem-somos">Quem somos</a></li>
					<li><a href="#seja-mentor">Seja Mentor</a></li>
					<li><a href="#seja-mentorado">Seja Mentorado</a></li>
					<li><button>Logar</button></li>
				</ul>
			</nav>
		</header>
	)
}

export default Header