package com.ft.trans.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ft.trans.configuration.OnlineUserRegistry;
import com.ft.trans.dto.MessageDTO;
import com.ft.trans.service.ChatService;

@Controller
public class ChatController {

    private ChatService chatService;
    private SimpMessagingTemplate messagingTemplate;
    private OnlineUserRegistry onlineUserRegistry;

    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate, OnlineUserRegistry onlineUserRegistry) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
        this.onlineUserRegistry = onlineUserRegistry;
    }

    @org.springframework.messaging.handler.annotation.MessageMapping("/chat.send")
    public void sendMessage(@Payload MessageDTO messageDTO) {
        MessageDTO saved = chatService.save(messageDTO);
        messagingTemplate.convertAndSendToUser(
            messageDTO.receiverId.toString(),
            "/queue/messages",
            saved
        );
    }

    @GetMapping("/chat/{readerId}/{otherId}")
    @ResponseBody
    public ResponseEntity<List<MessageDTO>> getConversation(
            @PathVariable Long readerId,
            @PathVariable Long otherId) {
        return ResponseEntity.ok(chatService.getConversation(readerId, otherId));
    }

    @GetMapping("/users/{id}/online")
    @ResponseBody
    public ResponseEntity<Boolean> isOnline(@PathVariable Long id) {
        return ResponseEntity.ok(onlineUserRegistry.isOnline(id));
    }
}