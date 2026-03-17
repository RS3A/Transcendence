package com.ft.trans.entity;

import com.ft.trans.service.JWTService;
import com.ft.trans.service.PasswordService;

public class LoginRequest
{
	PasswordService	passwordService;
	JWTService		jwtService;

    public String	email;
	public String	phoneNumber;
	public String	password;


	public LoginRequest()
	{
		this.passwordService = new PasswordService();
		this.jwtService = new JWTService();
	}

	public String	getToken(User user)
	{
		if (user != null && this.passwordService.matches(this.password, user.password))
			return jwtService.generateToken(user.email);
		return null;
	}
}