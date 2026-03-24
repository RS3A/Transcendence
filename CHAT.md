# Chat em Tempo Real — Documentação de Integração

## Visão Geral

O sistema de chat foi implementado usando **WebSocket + STOMP** no backend Spring Boot. As mensagens são persistidas no PostgreSQL e entregues em tempo real via WebSocket.

---

## Arquitetura e Fluxo

```
Frontend
  │
  ├── REST  ──────────────────────────────► ChatController
  │   GET /chat/{readerId}/{otherId}            │
  │   GET /users/{id}/online                    ▼
  │                                        ChatService
  │                                             │
  └── WebSocket (STOMP)                         ▼
      /ws  ──── CONNECT ──────────────►  WebSocketConfig
                  │                     (valida JWT, seta principal,
                  │                      registra como online)
                  │
           SUBSCRIBE ──────────────────► SimpleBroker /queue
           /user/queue/messages               │
                  │                           │
           SEND ──────────────────────► ChatController
           /app/chat.send                     │
                                         ChatService.save()
                                              │
                                         MessageRepository
                                              │
                                         PostgreSQL (tabela messages)
                                              │
                                    SimpMessagingTemplate
                                    .convertAndSendToUser()
                                              │
                                    ◄─────────┘
                              entrega em /user/queue/messages
                              para o destinatário conectado
```

---

## Fluxo Detalhado

### 1. Conectar ao WebSocket

O frontend conecta ao endpoint `/ws` via SockJS, passando o JWT no header do STOMP CONNECT.

**Quem chama quem:**
```
Frontend → SockJS /ws → WebSocketConfig.configureClientInboundChannel
  → valida JWT via JWTService.extractEmail()
  → busca User via UserRepository.findByEmail()
  → seta StompPrincipal(userId) na sessão
  → registra userId em OnlineUserRegistry
```

### 2. Abrir um chat (buscar histórico + marcar como lido)

O frontend chama o endpoint REST ao abrir a tela de conversa.

**Endpoint:**
```
GET /chat/{seuUserId}/{idDaOutraPessoa}
```

**Quem chama quem:**
```
Frontend → ChatController.getConversation()
  → ChatService.getConversation()
    → MessageRepository.markAsRead()   ← marca como lidas as mensagens recebidas
    → MessageRepository.findConversation()  ← busca histórico completo
  → retorna List<MessageDTO>
```

**Comportamento:**
- Primeira conversa → retorna `[]`, frontend abre chat vazio
- Conversa existente → retorna histórico ordenado por `createdAt`
- Mensagens enviadas enquanto offline são recuperadas normalmente

### 3. Enviar mensagem (tempo real)

**Quem chama quem:**
```
Frontend → STOMP SEND /app/chat.send  com payload MessageDTO
  → ChatController.sendMessage()
    → ChatService.save()
      → salva no banco com isRead=false
    → SimpMessagingTemplate.convertAndSendToUser(receiverId, "/queue/messages", mensagem)
      → entrega para o destinatário que está inscrito em /user/queue/messages
```

### 4. Receber mensagem (tempo real)

```
Destinatário conectado e inscrito em /user/queue/messages
  ← recebe o MessageDTO automaticamente quando alguém envia para ele
```

### 5. Verificar se usuário está online

**Endpoint:**
```
GET /users/{id}/online
```

**Retorna:** `true` ou `false`

**Quem chama quem:**
```
Frontend → ChatController.isOnline()
  → OnlineUserRegistry.isOnline(userId)
  → retorna Boolean
```

**Quando muda:**
- Vira `true` → no CONNECT do WebSocket
- Vira `false` → no DISCONNECT (evento `SessionDisconnectEvent` capturado por `WebSocketEventListener`)

---

## Integração no Frontend

### Dependências necessárias

```bash
npm install sockjs-client @stomp/stompjs
```

### Código de conexão

```typescript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const stompClient = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
  connectHeaders: {
    Authorization: 'Bearer ' + token,  // JWT obtido no login
  },

  onConnect: () => {
    // inscreve para receber mensagens
    stompClient.subscribe('/user/queue/messages', (msg) => {
      const message = JSON.parse(msg.body); // MessageDTO
      // atualiza a UI com a nova mensagem
    });
  },

  onDisconnect: () => {
    // atualiza UI: usuário offline
  },
});

stompClient.activate();
```

### Enviar mensagem

```typescript
stompClient.publish({
  destination: '/app/chat.send',
  body: JSON.stringify({
    senderId: 1,
    receiverId: 2,
    content: 'Olá!',
  }),
});
```

### Abrir chat (buscar histórico)

```typescript
// ao abrir a tela de chat com outra pessoa
const response = await fetch(`http://localhost:8080/chat/${meuId}/${idDaPessoa}`);
const mensagens = await response.json(); // MessageDTO[]
// renderiza o histórico
// mensagens do outro para mim já são marcadas como lidas automaticamente
```

### Verificar status online

```typescript
const response = await fetch(`http://localhost:8080/users/${idDaPessoa}/online`);
const online = await response.json(); // true | false
```

---

## Estrutura do MessageDTO

```json
{
  "senderId":     1,
  "receiverId":   2,
  "content":      "Olá!",
  "isRead":       false,
  "createdAt":    "2026-03-17",
  "createdBy":    1,
  "lastUpdateAt": "2026-03-17",
  "lastUpdateBy": 1
}
```

| Campo | Descrição |
|---|---|
| `senderId` | ID de quem enviou |
| `receiverId` | ID de quem recebe |
| `content` | Texto da mensagem |
| `isRead` | `false` ao enviar, `true` quando o destinatário abrir o chat |
| `createdAt` | Data/hora do envio |
| `createdBy` | ID do sender (quem criou) |
| `lastUpdateAt` | Atualiza quando marcado como lido |
| `lastUpdateBy` | Atualiza para o ID do receiver quando ele lê |

---

## Arquivos implementados

| Arquivo | Tipo | Responsabilidade |
|---|---|---|
| `entity/Message.java` | Entidade JPA | Tabela `messages` no banco |
| `dto/MessageDTO.java` | DTO | Objeto trafegado no WebSocket e REST |
| `repository/MessageRepository.java` | Repository | Queries de busca e markAsRead |
| `service/ChatService.java` | Service | Lógica de salvar e buscar conversa |
| `controller/ChatController.java` | Controller | Endpoints REST e WebSocket handler |
| `configuration/WebSocketConfig.java` | Config | Configura STOMP, autenticação JWT, registra online |
| `configuration/StompPrincipal.java` | Config | Principal da sessão WebSocket |
| `configuration/OnlineUserRegistry.java` | Config | Set em memória de usuários online |
| `configuration/WebSocketEventListener.java` | Config | Escuta desconexão e remove do Set |

---

## Arquivo de teste

O arquivo `chat-test.html` na raiz do projeto é uma página HTML de teste manual do chat. **Deve ser deletado antes de ir para produção.**

Para usar durante o desenvolvimento:

```bash
# 1. sobe o backend
make

# 2. serve o arquivo de teste
cd ~ && python3 -m http.server 3000 --directory /mnt/c/Users/giova/Documents/ft_trans_v3/Transcendence

# 3. acessa no browser
# http://localhost:3000/chat-test.html
```

**Fluxo de teste:**
1. Login com `user1@test.com / Senha@123` → clica **Fazer login**
2. Clica **Conectar**
3. Repete nas duas abas com `user2@test.com`
4. Na aba do User 1: `Seu userId = 1`, `userId destinatário = 2`, envia mensagem
5. Na aba do User 2: mensagem aparece em verde no log
6. Para testar markAsRead: `curl http://localhost:8080/chat/2/1` e checar no banco

---

## Observações

- **Status online é em memória** — se o servidor reiniciar, todos aparecem como offline até reconectarem. Para produção, substituir `OnlineUserRegistry` por Redis.
- **Histórico persiste** entre restarts do Docker, pois fica no volume PostgreSQL. Só é apagado com `docker compose down -v`.
- **Mensagens offline** são entregues via histórico (GET), não via WebSocket push.