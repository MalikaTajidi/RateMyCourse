
import {Module} from './module';

export class Formation {


  id:string = "" ;
  nom:string = "";
  description: string = "";
  ecole : string ="";
  listeModule: Array<Module > = [];



}


export interface PageFormation {

  formations : Formation[];
  page : number ;
  size : number ;
  totalpages : number ;
}
