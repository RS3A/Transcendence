package com.ft.trans.dto;

import java.sql.Date;

import com.ft.trans.entity.User;

public class UserDTO {
	public Long		id;
    public String	email;
	public String	name;
	public Boolean	status;
	public Date		createdAt;
	public Long		createdBy;
	public Date		lastUpdateAt;
	public Long		lastUpdateBy;
	public String	phoneNumber;
	public String	password;
    
    public String   profileType;

    public User     toUser()
    {
        User    user = new User();

		user.id = this.id;
    	user.email = this.email;
		user.name = this.name;
		user.status = this.status;
		user.createdAt = this.createdAt;
		user.createdBy = this.createdBy;
		user.lastUpdateAt = this.lastUpdateAt;
		user.lastUpdateBy = this.lastUpdateBy;
		user.phoneNumber = this.phoneNumber;
		user.password = this.password;

		return user;
    }

}
