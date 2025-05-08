import {SectionFormulaire} from './section-formulaire';
import {Question} from './question';


export interface Formulaire {




  id : number ;
  name : string;
  type :string;
  lSectionFormulaire : Array<SectionFormulaire>;


}

