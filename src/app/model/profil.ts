import {Formation} from './formation';

export interface Profil {


  id : number ;
  nom : string ;
  prenom : string ;
  email : string ;
  password : string ;
  role: string ;
  photoUrl: string ;



}



export interface PageProfil {

  Profil : Profil[];
  page : number ;
  size : number ;
  numberpages : number ;

}
