package com.ft.trans.entity;

import java.sql.Date;

<<<<<<< HEAD
=======
import org.passay.CharacterRule;
import org.passay.EnglishCharacterData;
import org.passay.LengthRule;
import org.passay.PasswordData;
import org.passay.PasswordValidator;
import org.passay.WhitespaceRule;

import com.ft.trans.service.PasswordService;
import com.ft.trans.utils.StringUtils;
import com.ft.trans.validation.ValidationResult;
import com.ft.trans.contract.IEntity;

import jakarta.persistence.Column;
>>>>>>> 09d7b60121dd6e23fc9048afff60ee2ed85eb8b2
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
<<<<<<< HEAD
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
=======
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(name = "email", columnNames = "email"),
    @UniqueConstraint(name = "phoneNumber", columnNames = "phoneNumber")
})
public class User implements IEntity{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long		id;
	@Column(nullable = false)
    public String	email;
	public String	name;
	public Boolean	status;
	public Date		createdAt;
	public Long		createdBy;
	public Date		lastUpdateAt;
	public Long		lastUpdateBy;
	@Column(nullable = false)
	public String	phoneNumber;
	@Column(nullable = false)
	public String	password;

	private void isNameValid(ValidationResult result)
	{
		this.name = this.name != null ? this.name.trim() : "";

		if (this.name.isBlank())
			result.addError("name", "Nome em branco.");
		if (this.name.length() < 3 || this.name.length() > 100)
			result.addError("name", "Nome muito pequeno ou muito grande.");
		if (!StringUtils.isAlphaOnly(this.name))
			result.addError("name", "O nome deve conter apenas caracteres alfabeticos e espaços.");
	}

	private void	isPhoneValid(ValidationResult result)
	{
		this.phoneNumber = this.phoneNumber != null ? this.phoneNumber.trim().replaceAll("\\D", "") : "";

		if (this.phoneNumber.isBlank())
			result.addError("phoneNumber", "Numero em branco.");
		if (!this.phoneNumber.matches("^\\d{10,11}$"))
			result.addError("phoneNumber", "Numero inválido.");
	}

	private void	isEmailValid(ValidationResult result)
	{
		this.email = this.email != null ? this.email.trim() : "";

		if (this.email.isBlank())
			result.addError("email", "Email em branco.");
		if (!this.email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$"))
			result.addError("email", "Email invalido.");
	}

	private void isPasswordValid(ValidationResult result)
	{
		PasswordValidator validator = new PasswordValidator(
			new LengthRule(8, 30),
			new CharacterRule(EnglishCharacterData.UpperCase, 1),
			new CharacterRule(EnglishCharacterData.LowerCase, 1),
			new CharacterRule(EnglishCharacterData.Digit, 1),
			new CharacterRule(EnglishCharacterData.Special, 1),
			new WhitespaceRule()
		);
		if (!validator.validate(new PasswordData(this.password)).isValid())
			result.addError("password", "Senha não segue a politica de senhas.");
	}

	public ValidationResult	validate()
	{
		ValidationResult	result = new ValidationResult();
>>>>>>> 09d7b60121dd6e23fc9048afff60ee2ed85eb8b2

		isNameValid(result);
		isPhoneValid(result);
		isEmailValid(result);
		isPasswordValid(result);

<<<<<<< HEAD
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

	
=======
		return result;
	}

	public void				encodePassword()
	{
		this.password = new PasswordService().hashPassword(this.password);
	}
>>>>>>> 09d7b60121dd6e23fc9048afff60ee2ed85eb8b2
}
