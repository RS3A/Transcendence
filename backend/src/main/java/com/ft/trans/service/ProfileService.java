package com.ft.trans.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ft.trans.entity.Profile;
import com.ft.trans.repository.ProfileRepository;
import com.ft.trans.validation.Result;
import com.ft.trans.validation.ValidationResult;

@Service
public class ProfileService {

    private ProfileRepository   profileRepository;

    public ProfileService(ProfileRepository pr)
    {
        this.profileRepository = pr;
    }

	public List<Profile>	list()
    {
        return (this.profileRepository.findAll());
    }

    public Result _persistProfile(Profile profile)
	{
	    Profile				savedProfile = null;
	    ValidationResult	result = profile.validate();

	    if (!result.hasErrors()) {
	        try {
	            savedProfile = this.profileRepository.save(profile);
	        } catch (org.springframework.dao.DataIntegrityViolationException e) {
	            String errorMsg = e.getMostSpecificCause().getMessage();
				result.addError("Profile", errorMsg);
	        } catch (Exception e) {
	            result.addError("global", "Ocorreu um erro interno ao salvar o Perfil.");
	        }
    	}
    	return new Result(savedProfile, result);
	}
}
