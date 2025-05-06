package com.example.ScoreService.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data 
@AllArgsConstructor 
@NoArgsConstructor
public class FormulaireReponseDTO {
    private int userId;
    private int formationId;
    private int niveauId;
    private int moduleId;
    private List<SectionReponseDTO> section;
}
