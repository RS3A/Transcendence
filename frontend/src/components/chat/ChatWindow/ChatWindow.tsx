import React, { useState, useEffect, useRef } from 'react';
import { X, MoreHorizontal, User, Send, Loader2 } from 'lucide-react';
import { useChat } from '../ChatContext/ChatContext'
import { getAuthToken, apiFetch } from '../../../services/api';
import styles from './Chat.module.css';

// Utility function to generate avatar color from name
const getAvatarColor = (name: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Utility function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const ChatWindow = () => {
  const { activeChatId, setActiveChatId, messages, setMessages, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [contactName, setContactName] = useState<string>('');
  const [contactAvatar, setContactAvatar] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const myId = Number(localStorage.getItem('userId'));
  const token = getAuthToken();

  // BUSCAR DADOS DO CONTATO
  useEffect(() => {
    if (!activeChatId) {
      setContactName('');
      setContactAvatar('');
      return;
    }

    const fetchContactData = async () => {
      try {
        const response = await apiFetch(`/users/${activeChatId}`);
        if (response.ok) {
          const data = await response.json();
          const user = data.user;
          setContactName(user.name || 'Usuário');
          
          // Busca também o avatar do perfil
          if (data.profiles && data.profiles.length > 0) {
            const profile = data.profiles[0];
            console.log('[ChatWindow] Profile found:', profile.id);
            
            // Fetch the avatar image from the specific endpoint (same as Chatbar)
            try {
              const imageResponse = await apiFetch(`/profiles/image/${profile.id}`);
              if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                console.log('[ChatWindow] Image data received');
                
                if (imageData && imageData.avatarUrl) {
                  try {
                    const parsed = JSON.parse(imageData.avatarUrl);
                    const avatarUrl = parsed.image_base64 || imageData.avatarUrl;
                    setContactAvatar(avatarUrl.startsWith('data:') ? avatarUrl : `data:image/png;base64,${avatarUrl}`);
                  } catch {
                    const avatarUrl = String(imageData.avatarUrl);
                    setContactAvatar(avatarUrl.startsWith('data:') ? avatarUrl : `data:image/png;base64,${avatarUrl}`);
                  }
                } else {
                  console.log('[ChatWindow] No avatarUrl in imageData');
                  setContactAvatar('');
                }
              } else {
                console.log('[ChatWindow] Image endpoint returned status:', imageResponse.status);
                setContactAvatar('');
              }
            } catch (imageError) {
              console.error('[ChatWindow] Error fetching profile image:', imageError);
              setContactAvatar('');
            }
          } else {
            console.log('[ChatWindow] No profiles found in response');
            setContactAvatar('');
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do contato:', error);
        setContactName('Usuário');
        setContactAvatar('');
      }
    };

    fetchContactData();
  }, [activeChatId]);
  useEffect(() => {
    if (!activeChatId) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await apiFetch(`/chat/${myId}/${activeChatId}`);
        if (response.ok) {
          const history = await response.json();
          
          // Garante que todas as mensagens recebidas deste contato sejam marcadas como lidas localmente
          const markedAsRead = history.map((msg: any) => 
            msg.receiverId === myId && msg.senderId === activeChatId
              ? { ...msg, isRead: true }
              : msg
          );
          
          // Atualiza o estado com mensagens marcadas como lidas
          setMessages(markedAsRead);
          console.log('[ChatWindow] History loaded and messages marked as read');
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [activeChatId, myId, token, setMessages]);

  // SCROLL AUTOMÁTICO
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!activeChatId) return null;

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {contactAvatar ? (
              <img 
                src={contactAvatar} 
                alt={contactName} 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => {
                  console.error('[ChatWindow] Image failed to load:', contactAvatar?.substring(0, 50));
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: getAvatarColor(contactName),
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: '2px solid #e5e7eb'
                }}
              >
                {contactName ? getInitials(contactName) : <User size={20} />}
              </div>
            )}
          </div>
          <span className={styles.username}>{contactName}</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={() => setActiveChatId(null)}><X size={20} /></button>
        </div>
      </div>

      <div className={styles.chatMessages} ref={scrollRef}>
        {loading ? (
          <div className={styles.chatLoading}>
            <Loader2 className={styles.animateSpin} size={24} />
            <span>Carregando histórico...</span>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.senderId === myId ? 'mine' : 'theirs'}`}>
              <div className={styles.messageBubble}>
                {msg.content}
                <span className={styles.messageTime}>
                   {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.chatInputArea}>
        <textarea 
          placeholder="Escreva uma mensagem..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if(input.trim()) {
                sendMessage(activeChatId, input);
                setInput('');
              }
            }
          }}
        />
        <button className={styles.sendBtn} onClick={() => {
           if(input.trim()) {
             sendMessage(activeChatId, input);
             setInput('');
           }
        }}>
          Enviar <Send size={14} style={{marginLeft: 8}} />
        </button>
      </div>
    </div>
  );
};