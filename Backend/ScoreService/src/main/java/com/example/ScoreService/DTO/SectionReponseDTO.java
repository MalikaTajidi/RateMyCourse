package com.example.ScoreService.DTO;

import java.util.List;

import lombok.Data;

@Data
public class SectionReponseDTO {
    private int secFormId;
    private List<ReponseDTO> reponses;
}
