function PrivacyPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6', color: '#333' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Política de Privacidade</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Última atualização: 15 de Março de 2026.</p>

      <section style={{ marginBottom: '2rem' }}>
        <p>
          Bem-vindo à <strong>ft_bridge</strong>. Valorizamos a confiança que você deposita em nossa plataforma de mentoria. 
          Esta Política descreve como coletamos, usamos, processamos e protegemos seus dados pessoais dentro do nosso ecossistema gamificado.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>1. Dados que Coletamos</h2>
        <p>Para o funcionamento da plataforma e aplicação das regras de gamificação, coletamos:</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
          <li><strong>Informações de Cadastro:</strong> Nome completo, e-mail, telefone (celular), senha criptografada e stacks tecnológicas.</li>
          <li><strong>Dados de Perfil:</strong> Bio, foto de perfil (avatar) e cargo.</li>
          <li><strong>Dados de Autenticação Social:</strong> Caso utilize Google ou 42 SP, recebemos seu ID de usuário, e-mail e foto de perfil dessas plataformas.</li>
          <li><strong>Dados de Gamificação e Performance:</strong> Histórico de XP, badges conquistadas, ofensivas (streaks), níveis alcançados e avaliações recebidas (estrelas e feedbacks).</li>
          <li><strong>Dados de Mentoria e Agenda:</strong> Horários de disponibilidade, sessões agendadas, logs de presença (no-show), links de reuniões (Google Meet) e anotações privadas de mentoria.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>2. Finalidade do Tratamento de Dados</h2>
        <p>Seus dados são utilizados para:</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
          <li><strong>Viabilizar o Match:</strong> Conectar mentores e mentorados com base em habilidades e interesses.</li>
          <li><strong>Operacionalizar a Gamificação:</strong> Calcular XP, disparar badges e gerir o ranking/níveis conforme as ações realizadas.</li>
          <li><strong>Gestão de Agenda:</strong> Notificar sobre reuniões, permitir remarcações e monitorar o cumprimento dos horários.</li>
          <li><strong>Segurança e Integridade:</strong> Validar a unicidade de contas e prevenir abusos por meio de sistemas de no-show e travas de segurança.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>3. Compartilhamento de Informações</h2>
        <p>Seus dados não são vendidos. Eles são compartilhados apenas em contextos necessários:</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
          <li><strong>Entre Mentor e Mentorado:</strong> Nome, bio e stacks ficam visíveis para facilitar a conexão. O e-mail e link de reunião são compartilhados após a confirmação do match.</li>
          <li><strong>Provedores de Serviço:</strong> Integramos com APIs de terceiros (como Google Calendar/Meet e autenticação OAuth) estritamente para a funcionalidade da plataforma.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>4. Retenção e Exclusão de Dados</h2>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
          <li><strong>Armazenamento:</strong> Os dados de XP e histórico de sessões são mantidos enquanto a conta estiver ativa para garantir a progressão do usuário.</li>
          <li><strong>Exclusão:</strong> O usuário pode solicitar a exclusão de sua conta a qualquer momento. Dados anonimizados de sessões podem ser mantidos para fins estatísticos de performance da plataforma.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>5. Regras de Conduta e Avaliações</h2>
        <p>Ao utilizar a ft_bridge, você entende que:</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
          <li>As avaliações recebidas (estrelas) impactam diretamente seu XP e visibilidade.</li>
          <li>O registro de No-Show (falta) é uma regra de negócio que resulta na perda de recompensas e zeragem de ofensivas.</li>
          <li>Anotações feitas por mentores sobre o progresso do mentorado são de uso restrito para o acompanhamento pedagógico/profissional dentro do ciclo de mentoria.</li>
        </ul>
      </section>
    </main>
  );
}

export default PrivacyPage;
