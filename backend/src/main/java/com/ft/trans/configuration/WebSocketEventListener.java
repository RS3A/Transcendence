package com.ft.trans.configuration;

import java.security.Principal;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private final OnlineUserRegistry onlineUserRegistry;

    public WebSocketEventListener(OnlineUserRegistry onlineUserRegistry) {
        this.onlineUserRegistry = onlineUserRegistry;
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();
        if (user != null) {
            onlineUserRegistry.userDisconnected(Long.parseLong(user.getName()));
        }
    }
}