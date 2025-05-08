import {Profil} from './profil';

export interface Student {




  id : number ;
  nom : string ;
  prenom : string ;
  email : string ;
  password : string ;
  role: string ;
  photoUrl: string ;





}



export interface PageStudent {

  Profil : Profil[];
  page : number ;
  size : number ;
  numberpages : number ;

}
