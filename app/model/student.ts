import {Profil} from './profil';

export interface Student {
  Id: number;
  firstName: string;
  lastName: string;
  email: string;

  Role: string;
  formationId: number;

  niveauId: number;
  photoUrl: string;
}




export interface PageStudent {

  Profil : Student[];
  page : number ;
  size : number ;
  numberpages : number ;

}
