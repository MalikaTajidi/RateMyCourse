import { Injectable } from '@angular/core';
import {Formulaire} from '../model/formulaire';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {


  formulaires : Formulaire[] = [];

  constructor() {

   this.formulaires = [
      {
        id: 1,
        name: 'Formulaire de satisfaction',
        type: 'Évaluation',
        lSectionFormulaire: [
          {
            id: 1,
            Description: 'Satisfaction générale',
            lQuestionnaire: [
              { id: 1, content: 'Êtes-vous satisfait du service ?' },
              { id: 2, content: 'Recommanderiez-vous ce service ?' }
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Formulaire d\'inscription',
        type: 'Inscription',
        lSectionFormulaire: [
          {
            id: 2,
            Description: 'Informations personnelles',
            lQuestionnaire: [
              { id: 3, content: 'Quel est votre nom complet ?' },
              { id: 4, content: 'Quelle est votre date de naissance ?' }
            ]
          }
        ]
      },
      {
        id: 3,
        name: 'Formulaire de feedback',
        type: 'Retour',
        lSectionFormulaire: [
          {
            id: 3,
            Description: 'Avis sur le produit',
            lQuestionnaire: [
              { id: 5, content: 'Qu\'avez-vous pensé du produit ?' },
              { id: 6, content: 'Quelles améliorations proposez-vous ?' }
            ]
          }
        ]
      },
      {
        id: 4,
        name: 'Formulaire RH',
        type: 'Ressources Humaines',
        lSectionFormulaire: [
          {
            id: 4,
            Description: 'Données employé',
            lQuestionnaire: [
              { id: 7, content: 'Quel est votre poste actuel ?' },
              { id: 8, content: 'Depuis combien d\'années travaillez-vous ici ?' }
            ]
          }
        ]
      },
      {
        id: 5,
        name: 'Formulaire d\'évaluation de stage',
        type: 'Évaluation',
        lSectionFormulaire: [
          {
            id: 5,
            Description: 'Encadrement',
            lQuestionnaire: [
              { id: 9, content: 'Comment évaluez-vous l\'encadrement ?' },
              { id: 10, content: 'Votre tuteur était-il disponible ?' }
            ]
          }
        ]
      },
      {
        id: 6,
        name: 'Formulaire de projet',
        type: 'Suivi',
        lSectionFormulaire: [
          {
            id: 6,
            Description: 'Avancement du projet',
            lQuestionnaire: [
              { id: 11, content: 'Le projet avance-t-il selon le planning ?' },
              { id: 12, content: 'Y a-t-il des blocages techniques ?' }
            ]
          }
        ]
      },
      {
        id: 7,
        name: 'Formulaire client',
        type: 'Service client',
        lSectionFormulaire: [
          {
            id: 7,
            Description: 'Service après-vente',
            lQuestionnaire: [
              { id: 13, content: 'Le SAV a-t-il répondu à vos attentes ?' },
              { id: 14, content: 'Souhaitez-vous être recontacté ?' }
            ]
          }
        ]
      },
      {
        id: 8,
        name: 'Formulaire de formation',
        type: 'Pédagogie',
        lSectionFormulaire: [
          {
            id: 8,
            Description: 'Contenu pédagogique',
            lQuestionnaire: [
              { id: 15, content: 'Le contenu était-il clair ?' },
              { id: 16, content: 'Avez-vous appris de nouvelles choses ?' }
            ]
          }
        ]
      },
      {
        id: 9,
        name: 'Formulaire d\'enquête',
        type: 'Recherche',
        lSectionFormulaire: [
          {
            id: 9,
            Description: 'Objectif de l\'étude',
            lQuestionnaire: [
              { id: 17, content: 'Quel est votre domaine d\'activité ?' },
              { id: 18, content: 'Combien d\'heures travaillez-vous par semaine ?' }
            ]
          }
        ]
      },
      {
        id: 10,
        name: 'Formulaire utilisateur',
        type: 'Utilisateur',
        lSectionFormulaire: [
          {
            id: 10,
            Description: 'Profil utilisateur',
            lQuestionnaire: [
              { id: 19, content: 'Quel est votre niveau en informatique ?' },
              { id: 20, content: 'Quelles technologies utilisez-vous souvent ?' }
            ]
          }
        ]
      }
    ];


  }


  public getAllFormulaires(): Observable<Formulaire[]> {
    return of(this.formulaires);
  }

  public getFormulaireById(id: number): Observable<Formulaire | undefined> {
    const formulaire = this.formulaires.find(f => f.id === id);
    return of(formulaire);
  }


  public addFormulaire(formulaire: Formulaire): Observable<Formulaire> {
    const newId = Math.max(...this.formulaires.map(f => f.id), 0) + 1;
    formulaire.id = newId;
    this.formulaires.push(formulaire);
    return of(formulaire);
  }

  public updateFormulaire(updatedFormulaire: Formulaire): Observable<Formulaire> {
    const index = this.formulaires.findIndex(f => f.id === updatedFormulaire.id);
    if (index !== -1) {
      this.formulaires[index] = updatedFormulaire;
      return of(updatedFormulaire);
    } else {
      throw new Error("Formulaire non trouvé");
    }
  }


  public deleteFormulaire(id: number): Observable<boolean> {
    this.formulaires = this.formulaires.filter(f => f.id !== id);
    return of(true);
  }

  public searchFormulaire(keyword: string): Observable<Formulaire[]> {
    const result = this.formulaires.filter(f =>
      f.name.toLowerCase().includes(keyword.toLowerCase())
    );
    return of(result);
  }









}
