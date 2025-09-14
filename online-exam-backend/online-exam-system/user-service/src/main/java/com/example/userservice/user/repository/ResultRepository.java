package com.example.userservice.user.repository;

import com.example.userservice.user.model.Result;
import com.example.userservice.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByUser(User user);
}
