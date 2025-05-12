package com.example.ScoreService.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ScoreService.Entities.ScoreProf;

public interface ScoreProfRepository extends JpaRepository<ScoreProf, Integer> {
    Optional<ScoreProf> findByFormationIdAndSecFormID(int formationId, int secFormID);
}
