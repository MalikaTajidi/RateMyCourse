import { Injectable } from '@angular/core';
import {Formulaire} from '../model/formulaire';
import {Observable, of} from 'rxjs';
import {Module} from '../model/module';
import {Formation} from '../model/formation';
import {FormationService} from './formation.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {


  formulaires : Formulaire[] = [];


  constructor(private http: HttpClient) {}



  public chargerToutesLesFormations(): void {
    this.http.get<Formulaire[]>("http://localhost:7000/api-gateway/Formulaires").subscribe({
      next: (data) => {
        this.formulaires = data;
        console.log("Formations chargées :", this.formulaires);
      },
      error: (err) => {
        console.error("Erreur lors du chargement des formations", err);
      }
    });
  }



  public getAllFormulaires(): Observable<Formulaire[]> {
    this.chargerToutesLesFormations();
    return of(this.formulaires);
  }

  public getFormulaireById(id: number): Observable<Formulaire | undefined> {
    const url = `http://localhost:7000/api-gateway/Formulaires/${id}`;
    return this.http.get<Formulaire>(url);
  }

  // public findFormationById(id: number): Observable<Formation> {
  //   const url = `http://localhost:7000/api-gateway/formations/${id}`;
  //   return this.http.get<Formation>(url);
  // }


  // public addFormulaire(formulaire: Formulaire): Observable<Formulaire> {
  //   const newId = Math.max(...this.formulaires.map(f => f.formulaireId), 0) + 1;
  //   formulaire.formulaireId = newId;
  //   this.formulaires.push(formulaire);
  //   return of(formulaire);
  // }


  public addFormulaire(formulaire: Formulaire): Observable<Formulaire> {

    return this.http.post<Formulaire>('http://localhost:7000/api-gateway/Formulaires', formulaire);

  }

  public updateFormulaire(updatedFormulaire: Formulaire): Observable<Formulaire> {
    const index = this.formulaires.findIndex(f => f.formulaireId === updatedFormulaire.formulaireId);
    if (index !== -1) {
      this.formulaires[index] = updatedFormulaire;
      return of(updatedFormulaire);
    } else {
      throw new Error("Formulaire non trouvé");
    }
  }


  public deleteFormulaire(id: number): Observable<any> {
    return this.http.delete(`http://localhost:7000/api-gateway/Formulaires/${id}`);
  }

  public searchFormulaire(keyword: string): Observable<Formulaire[]> {
    const result = this.formulaires.filter(f =>
      f.name.toLowerCase().includes(keyword.toLowerCase())
    );
    return of(result);
  }









}
