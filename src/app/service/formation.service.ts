import { Injectable } from '@angular/core';
import {Formation, PageFormation} from '../model/formation';
import {Observable, of} from 'rxjs';
import {UUID} from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class FormationService {


  Formations :Array<Formation> = [];



  constructor() {

    this.Formations = [
      {
        id: UUID.UUID() ,
        nom: "Génie Civil",
        description: "Formation solide en construction et infrastructures.",
        ecole: "ENSA Tétouan",
        listeModule: [
          { id: 4, nom: "Béton Armé" },
          { id: 5, nom: "Topographie" },
          { id: 6, nom: "Mécanique des sols" },
          { id: 7, nom: "Mécanique de" },

        ]
      },
      {
        id:  UUID.UUID(),
        nom: "Informatique Décisionnelle",
        description: "Analyse et interprétation de données massives.",
        ecole: "ENSA Marrakech",
        listeModule: [
          { id: 7, nom: "Big Data" },
          { id: 8, nom: "Machine Learning" },
          { id: 9, nom: "Business Intelligence" }
        ]
      },
      {
        id: UUID.UUID(),
        nom: "Génie Électrique",
        description: "Énergie, électrotechnique et automatisme industriel.",
        ecole: "ENSA Agadir",
        listeModule: [
          { id: 10, nom: "Electronique de puissance" },
          { id: 11, nom: "Automatique" },
          { id: 12, nom: "Réseaux électriques" }
        ]
      },
      {
        id: UUID.UUID(),
        nom: "Génie Mécanique",
        description: "Conception, fabrication et maintenance des systèmes mécaniques.",
        ecole: "ENSA Safi",
        listeModule: [
          { id: 13, nom: "Thermodynamique" },
          { id: 14, nom: "Conception assistée par ordinateur (CAO)" },
          { id: 15, nom: "Mécanique des fluides" }
        ]
      }
    ];


    for(let i =0 ; i<10 ; i++){

      this.Formations.push( {
        id: UUID.UUID(),
        nom: "Génie Mécanique",
        description: "Conception, fabrication et maintenance des systèmes mécaniques.",
        ecole: "ENSA Safi",
        listeModule: [
          { id: 13, nom: "Thermodynamique" },
          { id: 14, nom: "Conception assistée par ordinateur (CAO)" },
          { id: 15, nom: "Mécanique des fluides" }
        ]
      });



      this.Formations.push( {
          id: UUID.UUID(),
          nom: "Génie Électrique",
          description: "Énergie, électrotechnique et automatisme industriel.",
          ecole: "ENSA Agadir",
          listeModule: [
            { id: 10, nom: "Electronique de puissance" },
            { id: 11, nom: "Automatique" },
            { id: 12, nom: "Réseaux électriques" }
          ]
        }

      );


      this.Formations.push( {
        id: UUID.UUID() ,
        nom: "Génie Civil",
        description: "Formation solide en construction et infrastructures.",
        ecole: "ENSA Tétouan",
        listeModule: [
          { id: 4, nom: "Béton Armé" },
          { id: 5, nom: "Topographie" },
          { id: 6, nom: "Mécanique des sols" },

        ]
      })
    }





  }



  public getAllFormations ():Observable<Array<Formation>> {
    return of(this.Formations);
  }



  public getAllPagesFormations (page : number , size : number ):Observable<PageFormation > {

    let index = page*size;

    let totalpages = ~~(this.Formations.length/size) ;

    if(this.Formations.length % size != 0){
      totalpages++
    }


    let pagesFormation = this.Formations.slice(index, index+size);



    return of({ page: page, size: size, totalpages: totalpages, formations: pagesFormation })


  }



  public deleteFormation(id:string) : Observable<boolean> {

    this.Formations = this.Formations.filter(Formation => Formation.id !== id);

    return of(true)
  }





  public searchFormation(keyword: string , page : number , size:number): Observable<PageFormation> {

    let result = this.Formations.filter(f=>f.nom.includes(keyword) );
    let index = page * size;
    let totalpages = ~~(result.length/size) ;

    if(this.Formations.length % size != 0){
      totalpages++
    }

    let pageFormation = result.slice(index , index+size);

    return of({page : page , size : size, totalpages : totalpages , formations : pageFormation})

  }


  public AjouterFormation(formation: Formation):Observable<boolean> {

    formation.id = UUID.UUID();
    this.Formations.push(formation);
    return of(true)
  }


  public UpdateFormation(updatedFormation: Formation):Observable<Formation> {
    const index = this.Formations.findIndex(f => f.id === updatedFormation.id);

    if (index !== -1) {
      this.Formations[index] = updatedFormation;
      return of (updatedFormation);
    }else{
      throw new Error("Formation non trouvé");
    }



  }




  public findFormationById(id: string): Observable<Formation | undefined> {
    const formation = this.Formations.find(f => f.id === id);
    return of(formation);
  }

















}




// public searchFormation(keyword: string): Observable<Formation[]> {
//   // Convertir les deux en minuscules pour rendre la recherche insensible à la casse
//   let formations = this.Formations.filter(p => p.nom.includes(keyword));
//   return of(formations);
// }
