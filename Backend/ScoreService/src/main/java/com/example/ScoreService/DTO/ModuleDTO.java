package com.example.ScoreService.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ModuleDTO {

    @JsonProperty("moduleId")
    private int ModuleId;

    @JsonProperty("name")
    private String Name;

    // Getters et Setters
}