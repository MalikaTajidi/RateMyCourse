import {SectionFormulaire} from './section-formulaire';
import {Question} from './question';


export interface Formulaire {




  formulaireId   : number ;
  name : string;
  type :string;
  sections : Array<SectionFormulaire>;


}

