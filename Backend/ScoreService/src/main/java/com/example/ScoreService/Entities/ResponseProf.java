package com.example.ScoreService.Entities;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data 
@AllArgsConstructor 
@NoArgsConstructor
public class ResponseProf {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int responseId;
    private int userId;
    private int qstId;
    private int formationId;
    private String choix;
} 
