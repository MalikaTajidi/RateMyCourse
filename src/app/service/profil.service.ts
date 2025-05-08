import { Injectable } from '@angular/core';
import {PageProfil, Profil} from '../model/profil';
import {Observable, of} from 'rxjs';
import {UUID} from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {


  profils :Array<Profil>=[];

  constructor() {

    this.profils= [
      {
        id: 1,
        nom: 'Benali',
        prenom: 'Sara',
        email: 'sara.benali@example.com',
        password: 'azerty123',
        role: 'prof',
        photoUrl: ''
      },
      {
        id: 2,
        nom: 'El Fassi',
        prenom: 'Youssef',
        email: 'youssef.elfassi@example.com',
        password: 'password456',
        role: 'prof',
        photoUrl: ''
      },
      {
        id: 3,
        nom: 'Amrani',
        prenom: 'Leila',
        email: 'leila.amrani@example.com',
        password: 'leila2025',
        role: 'prof',
        photoUrl: ''
      },
      {
        id: 4,
        nom: 'Tahiri',
        prenom: 'Karim',
        email: 'karim.tahiri@example.com',
        password: 'karimdev',
        role: 'prof',
        photoUrl: ''
      },
      {
        id: 5,
        nom: 'Zahraoui',
        prenom: 'Imane',
        email: 'imane.zahraoui@example.com',
        password: 'imane2024',
        role: 'prof',
        photoUrl: ''
      },
      {
        id: 6,
        nom: 'Mehdi',
        prenom: 'Omar',
        email: 'omar.mehdi@example.com',
        password: 'omarpass',
        role: 'prof',
        photoUrl: ''
      }
    ];


    for(let i = 0 ; i<15 ; i ++){

      this.profils.push(
        {
          id:  i ,
          nom: 'Mehdi',
          prenom: 'Omar',
          email: 'omar.mehdi@example.com',
          password: 'omarpass',
          role: 'prof',
          photoUrl: ''
        },
        {
          id:  i+15 ,
          nom: 'Mehdi',
          prenom: 'Omar',
          email: 'omar.mehdi@example.com',
          password: 'omarpass',
          role: 'prof',
          photoUrl: ''
        },

      )
    }

  }



  public getProfils(): Observable<Array<Profil>> {

    let profils = this.profils;
    return of(profils);

  }

  public getAllPageProfil(page : number , size:number ) : Observable<PageProfil>{


    let index = page*size;

    let totalPage =~~(this.profils.length /size);

    if(this.profils.length % size !=0){
      totalPage++;
    }

     let pageProfil = this.profils.slice(index , index + size ) ;

    return of (
      {
        page : page ,
        size : size ,
        numberpages : totalPage ,
        Profil : pageProfil

      }
    )


  }


  public deletProfil(id : number ) : Observable<boolean> {
    //on garde l’élément si son id est différent de celui qu’on veut supprimer
    this.profils = this.profils.filter(profils => profils.id !== id);
    return of(true);
  }




  public serchProfil(keyword : string , page : number , size : number ):Observable<PageProfil> {

    let result : Profil[] = this.profils.filter(p=> p.nom.includes(keyword));
    let index = page *size;
    let numberpage = ~~(result.length /size);

    if(result.length % size != 0){
      numberpage ++;
    }


    let pageProfil : Profil[] = result.slice(index , index+ size);

    return of(
      {
        Profil : pageProfil,
        page :  page,
        size : size  ,
        numberpages :  numberpage
      }


    )

  }



  public addProfil(profil: Profil): Observable<Profil> {
    // Générer un ID automatiquement (par exemple, max ID + 1)
    const newId = Math.max(...this.profils.map(p => p.id), 0) + 1;
    profil.id = newId;
    this.profils.push(profil);
    return of(profil);
  }



  public updateProfil(updatedProfil: Profil): Observable<Profil> {
    const index = this.profils.findIndex(p => p.id === updatedProfil.id);
    if (index !== -1) {
      this.profils[index] = updatedProfil;
      return of(updatedProfil);
    } else {
      throw new Error("Profil non trouvé");
    }
  }


  public loadProfilById(id: number): Observable<Profil | undefined> {
    const profil = this.profils.find(p => p.id === id);
    return of(profil);
  }












}
