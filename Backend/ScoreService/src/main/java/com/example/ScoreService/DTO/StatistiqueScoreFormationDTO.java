package com.example.ScoreService.DTO;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatistiqueScoreFormationDTO {
    private int formationId;
    private int niveauId;
   private List<ScoreParModuleDTO> modules;
}
