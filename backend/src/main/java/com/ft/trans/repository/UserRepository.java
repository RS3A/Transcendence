package com.ft.trans.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ft.trans.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User>  findByEmail(String email);
}
