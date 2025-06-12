import {Question} from './question';

export interface SectionFormulaire {


  secFormId : number;
  description : string;
  questions : Array<Question>;

}
