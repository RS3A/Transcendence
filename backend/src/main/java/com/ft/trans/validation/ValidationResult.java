package com.ft.trans.validation;

import java.util.ArrayList;
import java.util.List;


public class	ValidationResult
{
	public record DomainError(String field, String message) {}

	private List<DomainError>	errors = new ArrayList<>();

	public void					addError(String field, String erroMsg)
	{
		this.errors.add(new DomainError(field, erroMsg));
	}

	public Boolean				hasErrors()
	{
		return !this.errors.isEmpty();
	}

	public List<DomainError>	getErrors()
	{
		return List.copyOf(this.errors);
	}

}
