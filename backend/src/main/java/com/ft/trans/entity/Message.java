package com.ft.trans.entity;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    public User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    public User receiver;

    @Column(nullable = false, columnDefinition = "TEXT")
    public String content;

    @Column(name = "is_read")
    public Boolean isRead = false;

    public Date createdAt;
    public Long  createdBy;
    public Date  lastUpdateAt;
    public Long  lastUpdateBy;
}