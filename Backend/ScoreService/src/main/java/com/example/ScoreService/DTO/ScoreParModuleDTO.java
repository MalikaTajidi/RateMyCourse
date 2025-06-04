package com.example.ScoreService.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScoreParModuleDTO {
    private int moduleId;
    private double score;
     private ModuleDTO moduleInfo; 


}