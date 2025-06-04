package com.example.ScoreService.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ScoreService.DTO.FormulaireProfDTO;
import com.example.ScoreService.DTO.FormulaireReponseDTO;
import com.example.ScoreService.DTO.StatistiqueScoreFormationDTO;
import com.example.ScoreService.Services.ResponseService;

@RestController
@RequestMapping("/api/responses")
public class ResponseController {

    @Autowired
    private ResponseService responseService;

    @PostMapping("/etudiant")
    public ResponseEntity<?> enregistrer(@RequestBody FormulaireReponseDTO form) {
        responseService.enregistrerReponses(form);
        return ResponseEntity.ok("Réponses et score enregistrés avec succès.");
    }

    @PostMapping("/professeur")
    public ResponseEntity<String> enregistrerProf(@RequestBody FormulaireProfDTO form) {
        responseService.enregistrerReponsesProf(form);
        return ResponseEntity.ok("Réponses du professeur enregistrées avec succès.");
    }

    @GetMapping("/statistiques/modules")
    public ResponseEntity<StatistiqueScoreFormationDTO> getStatistiquesEtudiant(
            
            @RequestParam int formationId,
            @RequestParam int niveauId) {

        StatistiqueScoreFormationDTO stats = responseService.getStatistiquesParModule(formationId, niveauId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/statistiques/sections")
public ResponseEntity<Map<String, Object>> getStatsParSection(
    @RequestParam int formationId,
    @RequestParam int niveauId,
    @RequestParam int moduleId) {

    return ResponseEntity.ok(responseService.getStatsParSection(formationId, niveauId, moduleId));
}

}