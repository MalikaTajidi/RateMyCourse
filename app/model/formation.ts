
import {Module} from './module';

export class Formation {


  formationId: number = 0; // correspond à FormationId
  formationName: string = ""; // correspond à FormationName
  schoolName: string = ""; // correspond à SchoolName
  description: string = ""; // correspond à Description
  modules: Array<Module> = []; // correspond à ModuleFormations



}


export interface PageFormation {

  formations : Formation[];
  page : number ;
  size : number ;
  totalpages : number ;
}
