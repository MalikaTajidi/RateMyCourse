import {Question} from './question';

export interface SectionFormulaire {


  id : number;
  Description : string;
  lQuestionnaire : Array<Question>;
}
