import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.js';

interface Message {
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean;
  createdAt?: string;
}

interface ChatContextData {
  messages: Message[];
  sendMessage: (receiverId: number, content: string) => void;
  activeChatId: number | null;
  setActiveChatId: (id: number | null) => void;
  onlineUsers: Set<number>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

  const token = localStorage.getItem('token'); // Ajuste conforme seu auth
  const myId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        client.subscribe('/user/queue/messages', (msg) => {
          const newMessage = JSON.parse(msg.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      },
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, [token]);

  const sendMessage = (receiverId: number, content: string) => {
    if (stompClient && stompClient.connected) {
      const payload = { senderId: myId, receiverId, content };
      stompClient.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(payload),
      });
      // Adiciona localmente para feedback instantâneo
      setMessages((prev) => [...prev, { ...payload, isRead: false, createdAt: new Date().toISOString() }]);
    }
  };

  return (
  <ChatContext.Provider value={{ messages, setMessages, sendMessage, activeChatId, setActiveChatId, onlineUsers }}>
    {children}
  </ChatContext.Provider>
);
};

export const useChat = () => useContext(ChatContext);