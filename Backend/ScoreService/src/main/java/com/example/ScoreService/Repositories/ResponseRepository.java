package com.example.ScoreService.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ScoreService.Entities.Response;

public interface ResponseRepository extends JpaRepository<Response, Integer> {
}
