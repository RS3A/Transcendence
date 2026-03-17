package com.ft.trans.entity;

public class LoginResponse
{
    public String  token;
    public String  type;
    public Long    expiresIn;

    public LoginResponse(String tk, String tp, Long expires)
    {
        this.token = tk;
        this.type = tp;
        this.expiresIn = expires;
    }
}
