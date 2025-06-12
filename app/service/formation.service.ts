import { Injectable } from '@angular/core';
import {Formation, PageFormation} from '../model/formation';
import {Observable, of} from 'rxjs';
import {UUID} from 'angular2-uuid';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Module} from '../model/module';
import {StudentService} from './student.service';

@Injectable({
  providedIn: 'root'
})
export class FormationService {


  Formations :Array<Formation> = [];
  Modules :Array<Module> = [];



  constructor(private http: HttpClient ) { }

  private apiUrl = 'http://localhost:7000/api-gateway/formations';






  public chargerToutesLesFormations(): void {
    this.http.get<Formation[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.Formations = data;
        console.log("Formations chargées :", this.Formations);
      },
      error: (err) => {
        console.error("Erreur lors du chargement des formations", err);
      }
    });
  }


  public getAllPagesFormations (page : number , size : number ):Observable<PageFormation > {

    this.chargerToutesLesFormations();
    let index = page*size;

    let totalpages = ~~(this.Formations.length/size) ;

    if(this.Formations.length % size != 0){
      totalpages++
    }


    let pagesFormation = this.Formations.slice(index, index+size);

    return of({ page: page, size: size, totalpages: totalpages, formations: pagesFormation })

  }






  public getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }


  // Nouvelle méthode pour ajouter une formation
  public AjouterFormation(formation: Formation): Observable<Formation> {
    this.Formations.push(formation);
    return this.http.post<Formation>('http://localhost:7000/api-gateway/formations', formation);
  }


  //
  // public UpdateFormation(updatedFormation: Formation):Observable<Formation> {
  //   const index = this.Formations.findIndex(f => f.formationId === updatedFormation.formationId);
  //
  //   if (index !== -1) {
  //     this.Formations[index] = updatedFormation;
  //     return of (updatedFormation);
  //   }else{
  //     throw new Error("Formation non trouvé");
  //   }
  //
  //
  //
  // }

  public UpdateFormation(updatedFormation: Formation): Observable<Formation> {
    const url = `http://localhost:7000/api-gateway/formations/${updatedFormation.formationId}`;
    return this.http.put<Formation>(url, updatedFormation);
  }

  public deleteFormation(id:number) : Observable<any> {

    const url = `http://localhost:7000/api-gateway/formations/${id}`;

    return this.http.delete<Formation>(url);
  }


  // public getAllFormations ():Observable<Array<Formation>> {
  //   return of(this.Formations);
  // }

  // public AjouterFormation(formation: Formation):Observable<boolean> {
  //   this.Formations.push(formation);
  //   return of(true)
  // }





  // public deleteFormation(id:number) : Observable<boolean> {
  //
  //   this.Formations = this.Formations.filter(Formation => Formation.formationId !== id);
  //
  //   return of(true)
  // }














  // public findFormationById(id: number): Observable<Formation | undefined> {
  //   const formation = this.Formations.find(f => f.formationId === id);
  //   return of(formation);
  // }


  public findFormationById(id: number): Observable<Formation> {
    const url = `http://localhost:7000/api-gateway/formations/${id}`;
    return this.http.get<Formation>(url);
  }

  public searchFormation(keyword: string , page : number , size:number): Observable<PageFormation> {

    let result = this.Formations.filter(f=>f.formationName.includes(keyword) );
    let index = page * size;
    let totalpages = ~~(result.length/size) ;

    if(this.Formations.length % size != 0){
      totalpages++
    }

    let pageFormation = result.slice(index , index+size);

    return of({page : page , size : size, totalpages : totalpages , formations : pageFormation})

  }















}




// public searchFormation(keyword: string): Observable<Formation[]> {
//   // Convertir les deux en minuscules pour rendre la recherche insensible à la casse
//   let formations = this.Formations.filter(p => p.nom.includes(keyword));
//   return of(formations);
// }
