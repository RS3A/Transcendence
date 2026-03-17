package com.ft.trans.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public String	hashPassword(String rawPassword) {
        return encoder.encode(rawPassword);
    }

    public boolean	matches(String rawPassword, String hashedByDb) {
        return encoder.matches(rawPassword, hashedByDb);
    }
}