package com.ft.trans.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ft.trans.dto.UserDTO;
import com.ft.trans.dto.UserProfilesDTO;
import com.ft.trans.entity.LoginRequest;
import com.ft.trans.entity.Profile;
import com.ft.trans.entity.User;
import com.ft.trans.repository.UserRepository;
import com.ft.trans.repository.ProfileRepository;
import com.ft.trans.validation.Result;
import com.ft.trans.validation.ValidationResult;

@Service
public class UserService {
    private UserRepository		userRepository;
	private ProfileService		profileService;
	private ProfileRepository	profileRepository;

    public				UserService(UserRepository ur, ProfileRepository pr, ProfileService ps)
    {
        this.userRepository = ur;
		this.profileRepository = pr;
		this.profileService = ps;
    }

    public Result		create(UserDTO userDTO)
    {
<<<<<<< HEAD
        this.userRepository.save(user);
        User	savedUser = this.userRepository.findByEmail(user.getEmail())
			.orElseThrow(() -> new RuntimeException("Failed to create user"));
        return (savedUser);
=======
		User	user = userDTO.toUser();
		Result	result = _persistUser(user, false);
		if (result.validationResult().hasErrors())
			return result;
		Profile	profile = new Profile();
		profile.user = user;
		profile.setRole(userDTO.profileType);

		result.consume(profileService._persistProfile(profile));
        return (result);
>>>>>>> 09d7b60121dd6e23fc9048afff60ee2ed85eb8b2
    }

	public List<User>	list()
    {
        return (this.userRepository.findAll());
    }

	public User			findLogin(LoginRequest login)
	{
		User	userFound = null;
		if (login.email.isEmpty())
			userFound = userRepository.findByPhoneNumber(login.phoneNumber).orElse(null);
		else
			userFound = userRepository.findByEmail(login.email).orElse(null);
		return userFound;
	}

    public Result		update(User user)
    {
<<<<<<< HEAD
        this.userRepository.save(user);
        User	savedUser = this.userRepository.findById(user.getId())
			.orElseThrow(()-> new RuntimeException("Failed to update user"));
        return (savedUser);
=======
		if (user.id == null)
		{
			ValidationResult result = new ValidationResult();
			result.addError("id", "Não foi possível alterar o usuário. Campo id está faltando");
			return new Result(user, result);
		}
        return (_persistUser(user, true));
>>>>>>> 09d7b60121dd6e23fc9048afff60ee2ed85eb8b2
    }

    public Boolean		delete(Long id)
    {
        this.userRepository.deleteById(id);
		Optional<User>	result = this.userRepository.findById(id);
		return (result.isEmpty());
    }
<<<<<<< HEAD
=======

    private Result _persistUser(User user, Boolean isUpdate)
	{
	    User savedUser = null;
	    ValidationResult result = user.validate();

	    if (!result.hasErrors()) {
	        try {
	            user.status = true;
				if (!isUpdate)
	            	user.encodePassword();
	            savedUser = this.userRepository.save(user);
	        } catch (org.springframework.dao.DataIntegrityViolationException e) {
	            String errorMsg = e.getMostSpecificCause().getMessage();
			
	            if (errorMsg.contains("email"))
	                result.addError("email", "Este e-mail já está sendo utilizado.");
	            else if (errorMsg.contains("phoneNumber"))
	                result.addError("phoneNumber", "Este telefone já está sendo utilizado.");
	        	else
	                result.addError("global", "Erro de integridade: um registro duplicado foi detectado.");
	        } catch (Exception e) {
	            result.addError("global", "Ocorreu um erro interno ao salvar o usuário.");
	        }
    	}
    	return new Result(savedUser, result);
	}

	public UserProfilesDTO	getUserProfiles(long user_id)
	{
		UserProfilesDTO dto = new UserProfilesDTO();

		dto.user = userRepository.findById(user_id)
			.orElse(null);
		dto.profiles = profileRepository.findByUserId(user_id);

		return dto;
	}
>>>>>>> 09d7b60121dd6e23fc9048afff60ee2ed85eb8b2
}
