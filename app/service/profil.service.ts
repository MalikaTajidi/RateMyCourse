import { Injectable } from '@angular/core';
import {PageProfil, Profil} from '../model/profil';
import {Observable, of} from 'rxjs';


import {HttpClient} from '@angular/common/http';
import {Student} from '../model/student';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {


  profils :Array<Profil>=[];

  constructor(private http: HttpClient) {



  }



  public chargertouteprof(){
    this.http.get<Profil[]>("http://localhost:7000/api-gateway/users/getProfs").subscribe({
      next: (data) => {
        this.profils = data;
        console.log("Formations chargées :", this.profils);
      },
      error: (err) => {
        console.error("Erreur lors du chargement des formations", err);
      }
    });



  }


  public getProfils(): Observable<Array<Profil>> {

    let profils = this.profils;
    return of(profils);

  }

  public getAllPageProfil(page : number , size:number ) : Observable<PageProfil>{

    this.chargertouteprof();

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
    this.profils = this.profils.filter(profils => profils.Id !== id);
    return of(true);
  }




  public serchProfil(keyword : string , page : number , size : number ):Observable<PageProfil> {

    let result : Profil[] = this.profils.filter(p=> p.firstName.includes(keyword));
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



  // public addProfil(profil: Profil): Observable<Profil> {
  //   // Générer un ID automatiquement (par exemple, max ID + 1)
  //   const newId = Math.max(...this.profils.map(p => p.Id), 0) + 1;
  //   profil.Id = newId;
  //   this.profils.push(profil);
  //   return of(profil);
  // }


  public addProfil(profil: Profil): Observable<Student> {

    console.log("hello")
    const prof ={
      firstName : profil.firstName,
      lastName : profil.lastName,
      email : profil.email,
      FormationId :profil.FormationId,
    }

    return this.http.post<Student>('http://localhost:7000/api-gateway/users/add-prof', prof );

  }





  public updateProfil(updatedProfil: Profil): Observable<Profil> {
    const index = this.profils.findIndex(p => p.Id === updatedProfil.Id);
    if (index !== -1) {
      this.profils[index] = updatedProfil;
      return of(updatedProfil);
    } else {
      throw new Error("Profil non trouvé");
    }
  }


  public loadProfilById(id: number): Observable<Profil | undefined> {
    const profil = this.profils.find(p => p.Id === id);
    return of(profil);
  }












}
