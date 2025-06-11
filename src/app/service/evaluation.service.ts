import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Question {
  id: number;
  content: string;
  options: string[];
}

export interface Section {
  title: string;
  questions: Question[];
}

// Interface pour la réponse à une question
export interface QuestionReponse {
  qstId: number;
  choix: string;
}

// Interface pour une section de réponses
export interface SectionReponse {
  secFormId: number;
  reponses: QuestionReponse[];
}

// Interface pour le DTO de réponse étudiant
export interface FormulaireReponseDTO {
  userId: number;
  formationId: number;
  niveauId: number;
  moduleId: number;
  section: SectionReponse[];
}

// Interface pour le DTO de réponse professeur
export interface FormulaireProfDTO {
  userId: number;
  formationId: number;
  niveauId: number;
  moduleId: number;
  section: SectionReponse[];
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = 'http://localhost:7000/api-gateway';

  constructor(private http: HttpClient) { }

  // Enregistrer les réponses d'un étudiant
  enregistrerReponsesEtudiant(formulaire: FormulaireReponseDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/responses/etudiant`, formulaire);
  }

  // Enregistrer les réponses d'un professeur
  enregistrerReponsesProf(formulaire: FormulaireProfDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/responses/professeur`, formulaire);
  }

  // Récupérer les questions d'évaluation
  getQuestionsEvaluation(): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.apiUrl}/questions`);
  }
}
