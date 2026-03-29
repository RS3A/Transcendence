import React, { useState, useEffect, useRef } from 'react';
import { X, MoreHorizontal, User, Send, Loader2 } from 'lucide-react'; // Adicionei Loader2
import { useChat } from '../ChatContext/ChatContext'
import './Chat.css';

export const ChatWindow = () => {
  const { activeChatId, setActiveChatId, messages, setMessages, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const myId = Number(localStorage.getItem('userId'));
  const token = localStorage.getItem('token');

  // BUSCAR HISTÓRICO VIA REST
  useEffect(() => {
    if (!activeChatId) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/chat/${myId}/${activeChatId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const history = await response.json();
          // Substitui as mensagens atuais pelo histórico oficial do banco
          setMessages(history);
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
    <div className="chat-window">
      <div className="chat-header">
        <div className="user-info">
          <div className="avatar"><User size={20} /></div>
          <span className="username">Conversa #{activeChatId}</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setActiveChatId(null)}><X size={20} /></button>
        </div>
      </div>

      <div className="chat-messages" ref={scrollRef}>
        {loading ? (
          <div className="chat-loading">
            <Loader2 className="animate-spin" size={24} />
            <span>Carregando histórico...</span>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.senderId === myId ? 'mine' : 'theirs'}`}>
              <div className="message-bubble">
                {msg.content}
                <span className="message-time">
                   {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chat-input-area">
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
        <button className="send-btn" onClick={() => {
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