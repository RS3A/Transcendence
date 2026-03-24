package com.ft.trans.service;

import java.sql.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ft.trans.dto.MessageDTO;
import com.ft.trans.entity.Message;
import com.ft.trans.repository.MessageRepository;
import com.ft.trans.repository.UserRepository;

@Service
public class ChatService {

    private MessageRepository messageRepository;
    private UserRepository userRepository;

    public ChatService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public MessageDTO save(MessageDTO dto) {
        Date now = new Date(System.currentTimeMillis());
        Message message = new Message();
        message.sender       = userRepository.findById(dto.senderId).orElseThrow();
        message.receiver     = userRepository.findById(dto.receiverId).orElseThrow();
        message.content      = dto.content;
        message.isRead       = false;
        message.createdAt    = now;
        message.createdBy    = dto.senderId;
        message.lastUpdateAt = now;
        message.lastUpdateBy = dto.senderId;
        return toDTO(messageRepository.save(message));
    }

    public List<MessageDTO> getConversation(Long readerId, Long otherId) {
        messageRepository.markAsRead(readerId, otherId, new Date(System.currentTimeMillis()));
        return messageRepository.findConversation(readerId, otherId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private MessageDTO toDTO(Message m) {
        MessageDTO dto = new MessageDTO();
        dto.senderId     = m.sender.id;
        dto.receiverId   = m.receiver.id;
        dto.content      = m.content;
        dto.isRead       = m.isRead;
        dto.createdAt    = m.createdAt;
        dto.createdBy    = m.createdBy;
        dto.lastUpdateAt = m.lastUpdateAt;
        dto.lastUpdateBy = m.lastUpdateBy;
        return dto;
    }
}