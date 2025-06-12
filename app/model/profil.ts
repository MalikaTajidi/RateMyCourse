import {Formation} from './formation';

export interface Profil {


  Id : number ;
  firstName : string ;
  lastName : string ;
  email : string ;
  role : string ;
  FormationId : number ;


  photoUrl: string ;


}



export interface PageProfil {

  Profil : Profil[];
  page : number ;
  size : number ;
  numberpages : number ;

}
