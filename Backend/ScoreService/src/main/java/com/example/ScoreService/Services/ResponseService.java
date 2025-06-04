package com.example.ScoreService.Services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.ScoreService.DTO.FormulaireProfDTO;
import com.example.ScoreService.DTO.FormulaireReponseDTO;
import com.example.ScoreService.DTO.ModuleDTO;
import com.example.ScoreService.DTO.ScoreParModuleDTO;
import com.example.ScoreService.DTO.SectionReponseDTO;
import com.example.ScoreService.DTO.StatistiqueScoreFormationDTO;
import com.example.ScoreService.Entities.Response;
import com.example.ScoreService.Entities.ResponseProf;
import com.example.ScoreService.Entities.Score;
import com.example.ScoreService.Entities.ScoreProf;
import com.example.ScoreService.Repositories.ResponseProfRepository;
import com.example.ScoreService.Repositories.ResponseRepository;
import com.example.ScoreService.Repositories.ScoreProfRepository;
import com.example.ScoreService.Repositories.ScoreRepository;

@Service
public class ResponseService {

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private ScoreRepository scoreRepository;
    @Autowired
    private ResponseProfRepository responseProfRepository;

    @Autowired
    private ScoreProfRepository scoreProfRepository;
    @Autowired
private RestTemplate restTemplate;


    public void enregistrerReponses(FormulaireReponseDTO form) {

        for (SectionReponseDTO section : form.getSection()) {
            int secFormId = section.getSecFormId();

            List<Response> responses = section.getReponses().stream().map(r -> {
                Response response = new Response();
                response.setUserId(form.getUserId());
                response.setFormationId(form.getFormationId());
                response.setModuleId(form.getModuleId());
                response.setQstId(r.getQstId());
                response.setChoix(r.getChoix());
                return response;
            }).toList();

            responseRepository.saveAll(responses);

            // Calcul du score pour la section
            double moyenne = responses.stream()
    .mapToDouble(r -> mapChoixToPonderation(r.getChoix()))
    .average()
    .orElse(0.0);

double totalScore = (moyenne / 5.0) * 100.0;
            Optional<Score> existingScore = scoreRepository
                .findByFormationIdAndNiveauIdAndModuleIdAndSecFormID(
                    form.getFormationId(),
                    form.getNiveauId(),
                    form.getModuleId(),
                    secFormId
                );

            if (existingScore.isPresent()) {
                Score score = existingScore.get();
                score.setScore(totalScore);
                scoreRepository.save(score);
            } else {
                Score score = new Score();
                score.setFormationId(form.getFormationId());
                score.setNiveauId(form.getNiveauId());
                score.setModuleId(form.getModuleId());
                score.setSecFormID(secFormId);
                score.setScore(totalScore);
                scoreRepository.save(score);
            }
        }
    }


    public void enregistrerReponsesProf(FormulaireProfDTO form) {
        for (SectionReponseDTO section : form.getSection()) {
            int secFormId = section.getSecFormId();

            var responses = section.getReponses().stream().map(r -> {
                ResponseProf resp = new ResponseProf();
                resp.setUserId(form.getUserId());
                resp.setFormationId(form.getFormationId());
                resp.setQstId(r.getQstId());
                resp.setChoix(r.getChoix());
                return resp;
            }).toList();

            responseProfRepository.saveAll(responses);

            double moyenne = responses.stream()
                .mapToDouble(r -> mapChoixToPonderation(r.getChoix()))
                .average()
                .orElse(0.0);

            double scorePourcentage = (moyenne / 5.0) * 100.0;

            Optional<ScoreProf> existing = scoreProfRepository
                .findByFormationIdAndSecFormID(form.getFormationId(), secFormId);

            if (existing.isPresent()) {
                ScoreProf score = existing.get();
                score.setScore(scorePourcentage);
                scoreProfRepository.save(score);
            } else {
                ScoreProf score = new ScoreProf();
                score.setFormationId(form.getFormationId());
                score.setSecFormID(secFormId);
                score.setScore(scorePourcentage);
                scoreProfRepository.save(score);
            }
        }
    }

    private double mapChoixToPonderation(String choix) {
        return switch (choix) {
            case "1" -> 1.0;
            case "2" -> 2.0;
            case "3" -> 3.0;
            case "4" -> 4.0;
            case "5" -> 5.0;
            default -> 0.0;
        };
    }
    
public StatistiqueScoreFormationDTO getStatistiquesParModule(int formationId, int niveauId) {
    List<Score> scores = scoreRepository.findByFormationIdAndNiveauId(formationId, niveauId);

    Map<Integer, List<Score>> groupedByModule = scores.stream()
        .collect(Collectors.groupingBy(Score::getModuleId));

    List<ScoreParModuleDTO> modules = groupedByModule.entrySet().stream()
        .map(entry -> {
            int moduleId = entry.getKey();
            List<Score> moduleScores = entry.getValue();
            double averageScore = moduleScores.stream()
                .mapToDouble(Score::getScore)
                .average()
                .orElse(0.0);

            // Appel au microservice formation pour récupérer les infos détaillées du module
            String url = "http://formationservice/api/responses//modules/" + moduleId;
            ModuleDTO moduleInfo = restTemplate.getForObject(url, ModuleDTO.class);

            return new ScoreParModuleDTO(moduleId, averageScore, moduleInfo);
        })
        .collect(Collectors.toList());

    return new StatistiqueScoreFormationDTO(formationId, niveauId, modules);
}
public Map<String, Object> getStatsParSection(int formationId, int niveauId, int moduleId) {
    List<Score> scores = scoreRepository.findByFormationIdAndNiveauIdAndModuleId(formationId, niveauId, moduleId);

    Map<Integer, List<Score>> groupedBySection = scores.stream()
        .collect(Collectors.groupingBy(Score::getSecFormID));

    List<Map<String, Object>> sections = groupedBySection.entrySet().stream()
        .map(entry -> {
            Map<String, Object> sectionMap = new HashMap<>();
            sectionMap.put("secFormId", entry.getKey());
            sectionMap.put("score", entry.getValue().stream()
                .mapToDouble(Score::getScore)
                .average()
                .orElse(0.0));
            return sectionMap;
        })
        .collect(Collectors.toList());

    // Appel au microservice FormationService pour récupérer les infos du module
    String moduleServiceUrl = "https://localhost:7179/api/Formulaires/DeleteSection/19" + moduleId; // change l’URL selon ton infra
    ModuleDTO moduleInfo = restTemplate.getForObject(moduleServiceUrl, ModuleDTO.class);

    Map<String, Object> result = new HashMap<>();
    result.put("formationId", formationId);
    result.put("niveauId", niveauId);
    result.put("moduleId", moduleId);
    result.put("moduleInfo", moduleInfo);  // <-- infos récupérées du microservice
    result.put("sections", sections);

    return result;
}

}