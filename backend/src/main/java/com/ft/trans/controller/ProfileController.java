package com.ft.trans.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ft.trans.entity.Profile;
import com.ft.trans.service.ProfileService;

@RestController
@RequestMapping("/profiles")
public class ProfileController {
    private ProfileService profileService;

    ProfileController (ProfileService ps)
    {
        this.profileService = ps;
    }

    @GetMapping
    public List<Profile>		list()
	{
		return (this.profileService.list());
	}
}
