package com.ft.trans.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ft.trans.entity.User;
import com.ft.trans.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
    private UserService userService;

    public UserController(UserService us)
    {
        this.userService = us;
    }

	@PostMapping
    public User		create(@RequestBody User user)
	{
		return (this.userService.create(user));
	}

	@GetMapping
    public List<User>		list()
	{
		return (this.userService.list());
	}

	@PutMapping
    public User		update(@RequestBody User user)
	{
		return (this.userService.update(user));
	}

	@DeleteMapping("{id}")
    public Boolean	delete(@PathVariable("id") Long id)
	{
		return (this.userService.delete(id));
	}
}
