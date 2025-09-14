package com.example.adminservice.user.repository;

import com.example.adminservice.user.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultRepository extends JpaRepository<Result, Long> {
}