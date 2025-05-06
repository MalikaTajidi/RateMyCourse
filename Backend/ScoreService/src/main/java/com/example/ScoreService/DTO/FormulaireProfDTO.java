package com.example.ScoreService.DTO;

import java.util.List;

import lombok.Data;

@Data
public class FormulaireProfDTO {
    private int userId;
    private int formationId;
    private List<SectionReponseDTO> section;
}
