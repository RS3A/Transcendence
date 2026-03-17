package com.ft.trans.entity;

import java.sql.Date;

import com.ft.trans.contract.IEntity;
import com.ft.trans.validation.ValidationResult;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "profiles", uniqueConstraints = {
	@UniqueConstraint(columnNames = {"user_id", "role"})
})
public class Profile implements IEntity
{
	public enum ProfileType
	{
		MENTOR,
		MENTORADO
	};

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long			id;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	public User			user;
	public String		avatarUrl;
	public String		position;
	public String		bio;
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	public ProfileType	role;
	public Long			xp;
	public Integer		level;
	public String		linkedin;
	public String		github;
	public String		instagram;
	public Date			createdAt;
	public Long			createdBy;
	public Date			lastUpdateAt;
	public Long			lastUpdateBy;

	public void			setRole(String profileType)
	{
		this.role = ProfileType.valueOf(profileType);
	}

	private	ValidationResult isUserValid(ValidationResult result)
	{
		if (this.user == null)
			result.addError("User", "Profile precisa ter um usuario atrelado para poder ser criado.");
		return result;
	}

	private	ValidationResult isRoleValid(ValidationResult result)
	{
		if (this.user == null)
			result.addError("role", "Role do perfil não especificado (MENTOR ou MENTORADO)");
		return result;
	}

	public ValidationResult	validate()
	{
		ValidationResult	result = new ValidationResult();

		isUserValid(result);
		isRoleValid(result);

		return result;
	}
}
