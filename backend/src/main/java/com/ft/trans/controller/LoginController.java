package com.ft.trans.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.ft.trans.entity.User;
import com.ft.trans.entity.LoginRequest;
import com.ft.trans.entity.LoginResponse;
import com.ft.trans.service.UserService;

@RestController
@RequestMapping
public class LoginController
{
    private UserService userService;

    LoginController(UserService us)
    {
        this.userService = us;
    }

    @PostMapping("/login")
    public ResponseEntity<?>    login(@RequestBody LoginRequest login)
    {
        User    user = userService.findLogin(login);
		String	token = login.getToken(user);
        if (token != null)
			return ResponseEntity.ok(new LoginResponse(token, "Bearer", 86400000L));
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}