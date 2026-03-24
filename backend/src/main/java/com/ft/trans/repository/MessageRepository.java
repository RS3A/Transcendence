package com.ft.trans.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.ft.trans.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.sender.id = :a AND m.receiver.id = :b) OR (m.sender.id = :b AND m.receiver.id = :a) ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("a") Long userId1, @Param("b") Long userId2);

    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.isRead = true, m.lastUpdateAt = :now, m.lastUpdateBy = :receiverId WHERE m.receiver.id = :receiverId AND m.sender.id = :senderId AND m.isRead = false")
    void markAsRead(@Param("receiverId") Long receiverId, @Param("senderId") Long senderId, @Param("now") Date now);
}