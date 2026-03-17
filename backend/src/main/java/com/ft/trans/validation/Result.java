package com.ft.trans.validation;

import com.ft.trans.contract.IEntity;

public record		Result(
		IEntity				entity,
		ValidationResult	validationResult
	){

		public void	consume(Result other)
		{
			if (other.validationResult().hasErrors())
			{
				for (ValidationResult.DomainError error : other.validationResult().getErrors())
				{
					this.validationResult.addError(error.field(), error.message());
				}
			}
		}
	};
