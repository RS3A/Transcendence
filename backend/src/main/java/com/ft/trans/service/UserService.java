package com.ft.trans.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ft.trans.entity.User;
import com.ft.trans.repository.UserRepository;

@Service
public class UserService {
    private UserRepository userRepository;

    public				UserService(UserRepository ur)
    {
        this.userRepository = ur;
    }

    public User			create(User user)
    {
        this.userRepository.save(user);
        User	savedUser = this.userRepository.findByEmail(user.getEmail())
			.orElseThrow(() -> new RuntimeException("Failed to create user"));
        return (savedUser);
    }

    public List<User>	list()
    {
        return (this.userRepository.findAll());
    }

    public User			update(User user)
    {
        this.userRepository.save(user);
        User	savedUser = this.userRepository.findById(user.getId())
			.orElseThrow(()-> new RuntimeException("Failed to update user"));
        return (savedUser);
    }

    public Boolean		delete(Long id)
    {
        this.userRepository.deleteById(id);
		Optional<User> result = this.userRepository.findById(id);
		return (result.isEmpty());
    }
}
