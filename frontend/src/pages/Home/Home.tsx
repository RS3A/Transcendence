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
    <div className={styles.homeWrapper}>
      {/* 1. Hero Section */}
      <section className={styles.heroSection}>
      {/* Camada de Fundo com Efeito Lilás */}
      <div className={styles.heroBackground}>
        <div className={`${styles.blob} ${styles.blob1}`}></div>
        <div className={`${styles.blob} ${styles.blob2}`}></div>
        <div className={`${styles.blob} ${styles.blob3}`}></div>
      </div>

      <div className={`${styles.container} ${styles.heroContent}`}>
        {/* Badge de Versão */}
        <div className={styles.badgeV1Container}>
          <span className={styles.badgeV1}>v1.0 — Plataforma de Mentoria Gratuita</span>
        </div>

        {/* Título Principal */}
        <h1 className={styles.heroTitle}>
          Onde o entusiasmo encontra a <br />
          <span className={styles.textGradient}>experiência.</span>
        </h1>

        {/* Subtítulo */}
        <p className={styles.heroSubtitle}>
          Conectamos talentos da tecnologia ao mercado de trabalho através de 
          uma plataforma de mentoria gratuita, colaborativa e prática.
        </p>

        {/* Botões de Ação Unificados */}
        <div className={styles.heroButtons}>
          <button 
            className={styles.btnCtaMain} 
            onClick={() => navigate("/register?type=MENTORADO")}
          >
            Quero ser Mentorado <ChevronRight size={20} />
          </button>
          
          <button 
            className={styles.btnCtaMain} 
            onClick={() => navigate("/register?type=MENTOR")}
          >
            Quero ser Mentor <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>

      {/* 2. Nossa História */}
      <section id="nossa-historia" className={styles.historySection}>
        <div className={styles.container}>
          <div className={styles.historyContent}>
            <span className={styles.badgeOutline}>Nossa História</span>
            <h2>De encontros mensais a um hub global de conhecimento.</h2>
            <div className={styles.historyText}>
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
      <section className={styles.rolesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <h2 className={styles.sectionTitleCenter}>Os Papéis na Jornada de Mentoria</h2>
          </div>

          <div className={styles.rolesGrid}>
            {/* Mentor Card */}
            <div className={`${styles.card} ${styles.mentorCard}`}>
              <div className={styles.cardGradientDecoration}></div>
              <div className={`${styles.cardIcon} ${styles.iconPrimary}`}>
                <Rocket className={`${styles.h6} ${styles.w6}`} />
              </div>
              <h3>Para quem quer Mentorar</h3>
              <p className={`${styles.cardHighlight} ${styles.highlightAccent}`}>Multiplique seu Impacto</p>
              <p className={styles.cardDesc}>
                O Mentor no ft_bridge é um catalisador. Acreditamos que ensinar
                é a forma mais refinada de aprender. Se você domina uma
                tecnologia ou processo, o ft_bridge é o seu palco para
                consolidar sua senioridade e incentivar com que mais pessoas
                tenham acesso ao conhecimento.
              </p>

              <ul className={styles.benefitList}>
                {[
                  { icon: Sparkles, title: "Liberdade Técnica", text: "Ensine o que você domina, no seu ritmo." },
                  { icon: Users, title: "Networking", text: "Conecte-se com outros especialistas e talentos emergentes." },
                  { icon: TrendingUp, title: "Liderança", text: "Desenvolva habilidades de mentoria e gestão." },
                ].map((item) => (
                  <li key={item.title}>
                    <div className={styles.listIcon}>
                      <item.icon className={`${styles.h4} ${styles.w4}`} />
                    </div>
                    <div>
                      <strong>{item.title}:</strong> {item.text}
                    </div>
                  </li>
                ))}
              </ul>

              <div className={`${styles.infoBox} ${styles.boxAccent}`}>
                <strong>Regra de Ouro:</strong> Não exigimos "anos de estrada", mas sim a responsabilidade de ter o conhecimento necessário para transmitir e o desejo de impulsionar a comunidade.
              </div>

              <button className={styles.btnCtaCard} onClick={() => navigate("/register?type=MENTOR")}>
                QUERO SER MENTOR
              </button>
            </div>

            {/* Mentorado Card */}
            <div className={`${styles.card} ${styles.menteeCard}`}>
              <div className={styles.cardGradientDecoration}></div>
              <div className={`${styles.cardIcon} ${styles.iconAccent}`}>
                <Target className={`${styles.h6} ${styles.w6}`} />
              </div>
              <h3>Para quem quer ser Mentorado</h3>
              <p className={`${styles.cardHighlight} ${styles.highlightPrimary}`}>Acelere sua Carreira</p>
              <p className={styles.cardDesc}>
                O Mentorado no ft_bridge é o dono da própria trilha. Se você é
                estudante, entusiasta ou está transicionando de carreira, aqui
                você encontra o atalho que os tutoriais não ensinam: a
                experiência real de quem segue carreira na tecnologia.
              </p>

              <ul className={styles.benefitList}>
                {[
                  { icon: Zap, title: "Foco no Real", text: "Tire dúvidas específicas e explore novas ferramentas." },
                  { icon: Handshake, title: "Visão de Mercado", text: "Entenda como as empresas realmente trabalham no dia a dia." },
                  { icon: GraduationCap, title: "Aprofundamento", text: "Mergulhe em desafios reais com mentores dispostos a ensinar." },
                ].map((item) => (
                  <li key={item.title}>
                    <div className={`${styles.listIcon} ${styles.listIconBlue}`}>
                      <item.icon className={`${styles.h4} ${styles.w4}`} />
                    </div>
                    <div>
                      <strong>{item.title}:</strong> {item.text}
                    </div>
                  </li>
                ))}
              </ul>

              <div className={`${styles.infoBox} ${styles.boxPrimary}`}>
                <strong>Modelo v1.0:</strong> Mentoria 100% gratuita, focada em conexões humanas e evolução técnica.
              </div>

              <button className={styles.btnCtaCard} onClick={() => navigate("/register?type=MENTORADO")}>
                QUERO SER MENTORADO
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* 4. Gamificação */}
      <section className={styles.gamificationSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.badgeV1}><Trophy size={14}/> Gamificação</span>
            <h2>Aprender não precisa ser linear. No ft_bridge, é um jogo.</h2>
          </div>

          <div className={styles.featuresGrid}>
            {[
              { icon: Star, title: "Experiência", text: "Cada interação gera pontos de XP no seu perfil." },
              { icon: TrendingUp, title: "Níveis", text: "Evolua seu status conforme cumpre missões." },
              { icon: Medal, title: "Badges", text: "Desbloqueie medalhas exclusivas." },
              { icon: BarChart3, title: "Ranking", text: "Destaque-se como um dos membros mais ativos." },
            ].map((item, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}><item.icon size={20}/></div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Team */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleCenter}>Time do Projeto</h2>
          <div className={styles.teamGrid}>
            {[
              { name: "Giovanna Gardinali", role: "UX & Product Manager", linkedin: "https://www.linkedin.com/in/giovanna-gardinali/" },
              { name: "Adedayo Sanni", role: "Front-end Engineer", linkedin: "https://www.linkedin.com/in/asanni/" },
              { name: "Marcelo Machado", role: "Back-end Engineer", linkedin: "https://www.linkedin.com/in/marcelo-d-machado-624599105/" },
              { name: "Fábio Júnior", role: "Back-end Engineer", linkedin: "https://www.linkedin.com/in/fabio-l-l-junior/" },
              { name: "Letícia Sampietro", role: "Front-end Engineer", linkedin: "https://www.linkedin.com/in/leticia-sampietro/" },
            ].map((member, i) => (
              <div key={i} className={styles.teamCard}>
                <div className={styles.teamAvatar}>
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h4>{member.name}</h4>
                <p>{member.role}</p>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={styles.linkedinLink}>
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