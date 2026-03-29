import React, { useEffect, useState } from 'react';
import { User, Search } from 'lucide-react';
import { useChat } from '../ChatContext/ChatContext'
import './Sidebar.css';

interface UserData {
  id: number;
  name: string;
  email: string;
}

export const Sidebar = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { setActiveChatId, activeChatId, onlineUsers } = useChat();
  const myId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    // Busca a lista de usuários/amigos do seu backend
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        // Filtra para não mostrar você mesmo na lista
        setUsers(data.filter((u: UserData) => u.id !== myId));
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, [myId]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="chat-sidebar">
      <div className="sidebar-header">
        <h2>Mensagens</h2>
        <div className="search-bar">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar conversa..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="user-list">
        {filteredUsers.map((user) => (
          <div 
            key={user.id} 
            className={`user-item ${activeChatId === user.id ? 'active' : ''}`}
            onClick={() => setActiveChatId(user.id)}
          >
            <div className="avatar-container">
              <div className="sidebar-avatar">
                <User size={20} />
              </div>
              {/* O status online vem do nosso ChatContext */}
              {onlineUsers.has(user.id) && <div className="status-indicator online" />}
            </div>
            
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="last-msg">Clique para conversar</span>
            </div>
          </div>
        ))}
        
        {filteredUsers.length === 0 && (
          <p className="empty-list">Nenhum usuário encontrado.</p>
        )}
      </div>
    </aside>
  );
};