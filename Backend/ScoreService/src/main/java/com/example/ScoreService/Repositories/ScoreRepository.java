package com.example.ScoreService.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ScoreService.Entities.Score;

public interface ScoreRepository extends JpaRepository<Score, Integer> {
Optional<Score> findByFormationIdAndNiveauIdAndModuleIdAndSecFormID(int formationId, int niveauId, int moduleId, int secFormID);
List<Score> findByFormationIdAndNiveauId( int formationId, int niveauId);
List<Score> findByFormationIdAndNiveauIdAndModuleId(int formationId, int niveauId, int moduleId);

}