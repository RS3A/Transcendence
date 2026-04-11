import React from 'react';
import { useNavigate } from "react-router-dom";
import {
  Rocket,
  Target,
  Zap,
  Trophy,
  Medal,
  TrendingUp,
  Users,
  Award,
  Map,
  GraduationCap,
  Handshake,
  Linkedin,
  ChevronRight,
  Sparkles,
  Star,
  BarChart3,
} from "lucide-react";
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();

  const handleRegisterMentee = () => navigate("/register?type=MENTORADO");
  const handleRegisterMentor = () => navigate("/register?type=MENTOR");

  return (
    <div className={styles["home-wrapper"]}>
      {/* 1. Hero Section */}
      <section className={styles["hero-section"]}>
      {/* Camada de Fundo com Efeito Lilás */}
      <div className={styles["hero-background"]}>
        <div className={`${styles.blob} ${styles["blob-1"]}`}></div>
        <div className={`${styles.blob} ${styles["blob-2"]}`}></div>
        <div className={`${styles.blob} ${styles["blob-3"]}`}></div>
      </div>

      <div className={`${styles.container} ${styles["hero-content"]}`}>
        {/* Badge de Versão */}
        <div className={styles["badge-v1-container"]}>
          <span className={styles["badge-v1"]}>v1.0 — Plataforma de Mentoria Gratuita</span>
        </div>

        {/* Título Principal */}
        <h1 className={styles["hero-title"]}>
          Onde o entusiasmo encontra a <br />
          <span className={styles["text-gradient"]}>experiência.</span>
        </h1>

        {/* Subtítulo */}
        <p className={styles["hero-subtitle"]}>
          Conectamos talentos da tecnologia ao mercado de trabalho através de 
          uma plataforma de mentoria gratuita, colaborativa e prática.
        </p>

        {/* Botões de Ação Unificados */}
        <div className={styles["hero-buttons"]}>
          <button 
            className={styles["btn-cta-main"]} 
            onClick={() => navigate("/register?type=MENTORADO")}
          >
            Quero ser Mentorado <ChevronRight size={20} />
          </button>
          
          <button 
            className={styles["btn-cta-main"]} 
            onClick={() => navigate("/register?type=MENTOR")}
          >
            Quero ser Mentor <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>

      {/* 2. Nossa História */}
      <section id="nossa-historia" className={styles["history-section"]}>
        <div className={styles.container}>
          <div className={styles["history-content"]}>
            <span className={styles["badge-outline"]}>Nossa História</span>
            <h2>De encontros mensais a um hub global de conhecimento.</h2>
            <div className={styles["history-text"]}>
              <p>
                Nascemos em 2023 com um propósito claro: apoiar a comunidade da 42 São Paulo na entrada para o mercado. Vivemos encontros de simulações de entrevistas, auxílio em coding dojos e eventos de tecnologia mensalmente com o apoio da Codurance e dos próprios alunos da 42 São Paulo.
Mesmo quando os desafios nos limitaram a encontros mensais, nossa essência não mudou. 
                Agora, <strong>o jogo virou</strong>. Estamos de volta conectando quem quer aprender com quem tem o conhecimento necessário para ensinar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* 3. Papéis */}
      {/* 3. Papéis */}
      <section className={styles["roles-section"]}>
        <div className={styles.container}>
          <div className={styles["section-header-center"]}>
            <h2 className={styles["section-title-center"]}>Os Papéis na Jornada de Mentoria</h2>
          </div>

          <div className={styles["roles-grid"]}>
            {/* Mentor Card */}
            <div className={`${styles.card} ${styles["mentor-card"]}`}>
              <div className={styles["card-gradient-decoration"]}></div>
              <div className={`${styles["card-icon"]} ${styles["icon-primary"]}`}>
                <Rocket className={`${styles["h-6"]} ${styles["w-6"]}`} />
              </div>
              <h3>Para quem quer Mentorar</h3>
              <p className={`${styles["card-highlight"]} ${styles["highlight-accent"]}`}>Multiplique seu Impacto</p>
              <p className={styles["card-desc"]}>
                O Mentor no ft_bridge é um catalisador. Acreditamos que ensinar
                é a forma mais refinada de aprender. Se você domina uma
                tecnologia ou processo, o ft_bridge é o seu palco para
                consolidar sua senioridade e incentivar com que mais pessoas
                tenham acesso ao conhecimento.
              </p>

              <ul className={styles["benefit-list"]}>
                {[
                  { icon: Sparkles, title: "Liberdade Técnica", text: "Ensine o que você domina, no seu ritmo." },
                  { icon: Users, title: "Networking", text: "Conecte-se com outros especialistas e talentos emergentes." },
                  { icon: TrendingUp, title: "Liderança", text: "Desenvolva habilidades de mentoria e gestão." },
                ].map((item) => (
                  <li key={item.title}>
                    <div className={styles["list-icon"]}>
                      <item.icon className={`${styles["h-4"]} ${styles["w-4"]}`} />
                    </div>
                    <div>
                      <strong>{item.title}:</strong> {item.text}
                    </div>
                  </li>
                ))}
              </ul>

              <div className={`${styles["info-box"]} ${styles["box-accent"]}`}>
                <strong>Regra de Ouro:</strong> Não exigimos "anos de estrada", mas sim a responsabilidade de ter o conhecimento necessário para transmitir e o desejo de impulsionar a comunidade.
              </div>

              <button className={styles["btn-cta-card"]} onClick={() => navigate("/register?type=MENTOR")}>
                QUERO SER MENTOR
              </button>
            </div>

            {/* Mentorado Card */}
            <div className={`${styles.card} ${styles["mentee-card"]}`}>
              <div className={styles["card-gradient-decoration"]}></div>
              <div className={`${styles["card-icon"]} ${styles["icon-accent"]}`}>
                <Target className={`${styles["h-6"]} ${styles["w-6"]}`} />
              </div>
              <h3>Para quem quer ser Mentorado</h3>
              <p className={`${styles["card-highlight"]} ${styles["highlight-primary"]}`}>Acelere sua Carreira</p>
              <p className={styles["card-desc"]}>
                O Mentorado no ft_bridge é o dono da própria trilha. Se você é
                estudante, entusiasta ou está transicionando de carreira, aqui
                você encontra o atalho que os tutoriais não ensinam: a
                experiência real de quem segue carreira na tecnologia.
              </p>

              <ul className={styles["benefit-list"]}>
                {[
                  { icon: Zap, title: "Foco no Real", text: "Tire dúvidas específicas e explore novas ferramentas." },
                  { icon: Handshake, title: "Visão de Mercado", text: "Entenda como as empresas realmente trabalham no dia a dia." },
                  { icon: GraduationCap, title: "Aprofundamento", text: "Mergulhe em desafios reais com mentores dispostos a ensinar." },
                ].map((item) => (
                  <li key={item.title}>
                    <div className={`${styles["list-icon"]} ${styles["list-icon-blue"]}`}>
                      <item.icon className={`${styles["h-4"]} ${styles["w-4"]}`} />
                    </div>
                    <div>
                      <strong>{item.title}:</strong> {item.text}
                    </div>
                  </li>
                ))}
              </ul>

              <div className={`${styles["info-box"]} ${styles["box-primary"]}`}>
                <strong>Modelo v1.0:</strong> Mentoria 100% gratuita, focada em conexões humanas e evolução técnica.
              </div>

              <button className={styles["btn-cta-card"]} onClick={() => navigate("/register?type=MENTORADO")}>
                QUERO SER MENTORADO
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* 4. Gamificação */}
      <section className={styles["gamification-section"]}>
        <div className={styles.container}>
          <div className={styles["section-header-center"]}>
            <span className={styles["badge-v1"]}><Trophy size={14}/> Gamificação</span>
            <h2>Aprender não precisa ser linear. No ft_bridge, é um jogo.</h2>
          </div>

          <div className={styles["features-grid"]}>
            {[
              { icon: Star, title: "Experiência", text: "Cada interação gera pontos de XP no seu perfil." },
              { icon: TrendingUp, title: "Níveis", text: "Evolua seu status conforme cumpre missões." },
              { icon: Medal, title: "Badges", text: "Desbloqueie medalhas exclusivas." },
              { icon: BarChart3, title: "Ranking", text: "Destaque-se como um dos membros mais ativos." },
            ].map((item, i) => (
              <div key={i} className={styles["feature-card"]}>
                <div className={styles["feature-icon"]}><item.icon size={20}/></div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Team */}
      <section className={styles["team-section"]}>
        <div className={styles.container}>
          <h2 className={styles["section-title-center"]}>Time do Projeto</h2>
          <div className={styles["team-grid"]}>
            {[
              { name: "Giovanna Gardinali", role: "UX & Product Manager", linkedin: "https://www.linkedin.com/in/giovanna-gardinali/" },
              { name: "Adedayo Sanni", role: "Front-end Engineer", linkedin: "https://www.linkedin.com/in/asanni/" },
              { name: "Marcelo Machado", role: "Back-end Engineer", linkedin: "https://www.linkedin.com/in/marcelo-d-machado-624599105/" },
              { name: "Fábio Júnior", role: "Back-end Engineer", linkedin: "https://www.linkedin.com/in/fabio-l-l-junior/" },
              { name: "Letícia Sampietro", role: "Front-end Engineer", linkedin: "https://www.linkedin.com/in/leticia-sampietro/" },
            ].map((member, i) => (
              <div key={i} className={styles["team-card"]}>
                <div className={styles["team-avatar"]}>
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h4>{member.name}</h4>
                <p>{member.role}</p>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={styles["linkedin-link"]}>
                  <Linkedin size={16} /> LinkedIn
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}