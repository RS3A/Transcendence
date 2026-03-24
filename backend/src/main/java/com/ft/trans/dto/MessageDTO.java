package com.ft.trans.dto;

import java.sql.Date;

public class MessageDTO {
    public Long    senderId;
    public Long    receiverId;
    public String  content;
    public Boolean isRead;
    public Date    createdAt;
    public Long    createdBy;
    public Date    lastUpdateAt;
    public Long    lastUpdateBy;
}