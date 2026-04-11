import React, { useEffect, useState } from 'react';
import { User, Search, MessageCircle } from 'lucide-react';
import { useChat } from '../ChatContext/ChatContext';
import { apiFetch } from '../../../services/api';
import styles from './Chatbar.module.css';

interface UserData {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
}

export const Sidebar = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsed, setCollapsed] = useState(true); // Inicia colapsado
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false); // Track se há mensagens não lidas
  const { setActiveChatId, activeChatId, onlineUsers, contactsVersion, messages } = useChat();
  const myId = Number(localStorage.getItem('userId'));

  // Função para buscar a imagem de perfil de um usuário
  const fetchProfileImage = async (userId: number): Promise<string | undefined> => {
    try {
      console.log(`[fetchProfileImage] Starting fetch for user ${userId}`);
      
      // Primeiro, busca o usuário e seus profiles
      const userResponse = await apiFetch(`/users/${userId}`);
      console.log(`[fetchProfileImage] User response status: ${userResponse.status}`);
      if (!userResponse.ok) {
        console.log(`[fetchProfileImage] User response not ok, returning undefined`);
        return undefined;
      }
      
      const userData = await userResponse.json();
      console.log(`[fetchProfileImage] User data:`, userData);
      
      const profile = userData.profiles && userData.profiles.length > 0 ? userData.profiles[0] : null;
      console.log(`[fetchProfileImage] Profile:`, profile);
      
      if (!profile || !profile.id) {
        console.log(`[fetchProfileImage] No profile found, returning undefined`);
        return undefined;
      }
      
      // Depois, busca a imagem do profile usando o endpoint específico de imagem
      console.log(`[fetchProfileImage] Fetching image for profile ${profile.id}`);
      const imageResponse = await apiFetch(`/profiles/image/${profile.id}`);
      console.log(`[fetchProfileImage] Image response status: ${imageResponse.status}`);
      if (!imageResponse.ok) {
        console.log(`[fetchProfileImage] Image response not ok`);
        return undefined;
      }
      
      const imageData = await imageResponse.json();
      console.log(`[fetchProfileImage] Image data:`, imageData);
      
      if (imageData && imageData.avatarUrl) {
        // Se a imagem for um JSON, parse dela
        try {
          const parsed = JSON.parse(imageData.avatarUrl);
          console.log(`[fetchProfileImage] Parsed image data`);
          return parsed.image_base64 || imageData.avatarUrl;
        } catch (e) {
          console.log(`[fetchProfileImage] Could not parse as JSON, using as-is`);
          return imageData.avatarUrl.startsWith('data:') 
            ? imageData.avatarUrl 
            : `data:image/png;base64,${imageData.avatarUrl}`;
        }
      }
      console.log(`[fetchProfileImage] No avatarUrl found in imageData`);
      return undefined;
    } catch (error) {
      console.error(`[fetchProfileImage] Error fetching profile image for user ${userId}:`, error);
      return undefined;
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiFetch(`/chat/${myId}/contacts`, {
          method: 'GET',
        });

        const data = await response.json();
        const usersList = Array.isArray(data) ? data : [];
        
        console.log('Contacts fetched:', usersList);
        
        // Para cada usuário, busca a imagem de perfil
        const usersWithImages = await Promise.all(
          usersList.map(async (user: any) => {
            const avatarUrl = await fetchProfileImage(user.id);
            console.log(`Avatar for user ${user.id} (${user.name}):`, avatarUrl ? 'loaded' : 'not found');
            return { ...user, avatarUrl };
          })
        );
        
        console.log('Users with images:', usersWithImages);
        setUsers(usersWithImages);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setUsers([]);
      }
    };

    if (myId && myId > 0) fetchUsers();
  }, [myId, contactsVersion]);

  // Detecta se há mensagens não lidas usando ChatContext em tempo real
  useEffect(() => {
    if (Array.isArray(messages) && myId > 0) {
      // Verifica se há alguma mensagem recebida (receiverId === myId) que não foi lida (isRead === false)
      const hasUnread = messages.some(msg => msg.receiverId === myId && !msg.isRead);
      setHasUnreadMessages(hasUnread);
      console.log('[Chatbar] Unread messages check:', hasUnread, 'Total messages:', messages.length);
    }
  }, [messages, myId]);

  const filteredUsers = Array.isArray(users) ? users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <aside className={`chat-sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className={styles.sidebarHeader}>
  {!collapsed && <h2>Mensagens</h2>}
  <button
    className={styles.sidebarToggleBtn}
    onClick={() => setCollapsed((c) => !c)}
    title={collapsed ? 'Expandir' : 'Minimizar'}
    style={hasUnreadMessages ? { color: '#7c3aed' } : {}}
  >
    <MessageCircle size={22} fill={hasUnreadMessages ? '#7c3aed' : 'none'} />
  </button>
        {!collapsed && (
          <div className={styles.searchBar}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar conversa..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>
      {!collapsed && (
        <div className={styles.userList}>
          {filteredUsers.map((user) => (
            <div 
              key={user.id} 
              className={`user-item ${activeChatId === user.id ? 'active' : ''}`}
              onClick={() => setActiveChatId(user.id)}
            >
              <div className={styles.avatarContainer}>
                <div className={styles.sidebarAvatar}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#7c3aed',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                {onlineUsers.has(user.id) && <div className={`${styles.statusIndicator} ${styles.online}`} />}
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.lastMsg}>Clique para conversar</span>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <p className={styles.emptyList}>Nenhum usuário encontrado.</p>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;