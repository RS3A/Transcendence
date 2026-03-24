package com.ft.trans.configuration;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class OnlineUserRegistry {

    private final Set<Long> onlineUsers = ConcurrentHashMap.newKeySet();

    public void userConnected(Long userId) {
        onlineUsers.add(userId);
    }

    public void userDisconnected(Long userId) {
        onlineUsers.remove(userId);
    }

    public boolean isOnline(Long userId) {
        return onlineUsers.contains(userId);
    }

    public Set<Long> getOnlineUsers() {
        return Collections.unmodifiableSet(onlineUsers);
    }
}