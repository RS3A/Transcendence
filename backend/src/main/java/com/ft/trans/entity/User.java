package com.ft.trans.entity;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
	// uu_id
    // password
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long	id;
    private String	email;
	private String	username;
	private String	role;
	private String	status;
	private Date	created_at;
	private String	created_by;
	private Date	last_update_at;
	private String	last_update_by;
	private String	phone_number;

	public Long		getId() {
		return id;
	}

	public void		setId(Long id) {
		this.id = id;
	}

	public String	getEmail() {
		return email;
	}

	public void		setEmail(String email) {
		this.email = email;
	}

	public String	getUsername() {
		return username;
	}

	public void		setUsername(String username) {
		this.username = username;
	}

	public String	getRole() {
		return role;
	}

	public void		setRole(String role) {
		this.role = role;
	}

	public String	getStatus() {
		return status;
	}

	public void		setStatus(String status) {
		this.status = status;
	}

	public Date		getCreated_at() {
		return created_at;
	}

	public void		setCreated_at(Date created_at) {
		this.created_at = created_at;
	}

	public String	getCreated_by() {
		return created_by;
	}

	public void		setCreated_by(String created_by) {
		this.created_by = created_by;
	}

	public Date		getLast_update_at() {
		return last_update_at;
	}

	public void		setLast_update_at(Date last_update_at) {
		this.last_update_at = last_update_at;
	}

	public String	getLast_update_by() {
		return last_update_by;
	}

	public void		setLast_update_by(String last_update_by) {
		this.last_update_by = last_update_by;
	}

	public String	getPhone_number() {
		return phone_number;
	}

	public void		setPhone_number(String phone_number) {
		this.phone_number = phone_number;
	}

	
}
