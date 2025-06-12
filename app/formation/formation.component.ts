import {Component, OnInit} from '@angular/core';
import {Formation} from '../model/formation';
import {FormationService} from '../service/formation.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-formation',
  standalone: false,
  templateUrl: './formation.component.html',
  styleUrl: './formation.component.css'
})
export class FormationComponent implements OnInit {

  Formations :Array<Formation> = [];
  errorMessage !: string;
  // c est 1 pour la recherche  , il faut faire une data biding [formGroup]="serchFormGroup"
  serchFormGroup ! : FormGroup;

  currentPage : number = 0;
  pagesSize : number =8 ;
  totalPages : number =0;

  currentAcction : string = "all";


  constructor(private formationService : FormationService , private fb : FormBuilder ) { }



  ngOnInit() {

    this.serchFormGroup = this.fb.group({
      keyword : this.fb.control(null)
    })


    this.handlGetFormations();






  }





  handlGetFormations(){
    this.formationService.getAllPagesFormations(this.currentPage, this.pagesSize).subscribe({
      next: (data) => {
        console.log("Données reçues:", data);
        console.log("Modules de la première formation:", data.formations[0]?.modules);
        this.Formations = data.formations;
        this.totalPages=data.totalpages;
      },
      error: (error) => {
        this.errorMessage = error;
      }
    });

  }








  handleDeleteFormation(F:Formation) {
    let conf = confirm("Are you sure you want to delete this formation?");

    if(conf == false)return ;

    this.formationService.deleteFormation(F.formationId).subscribe({


      next : (data)=>{
        // this.handleAllProduct();  n est pas recommender de faire comme ca , n est pas claine code + la deuxieme methode , supprime dans le front , puis le back 3ela khatro yemsah

        let index = this.Formations.indexOf(F);
        this.Formations.splice(index,1);// je supprime un element apartir de index
      },
     error: (error) => {
      this.errorMessage = error;
      }

    })
  }


  handlsearchFormatio() {


    this.currentAcction="search";
    let keyword = this.serchFormGroup.value.keyword;
    this.formationService.searchFormation(keyword , this.currentPage , this.pagesSize).subscribe({
      next: (data) => {
        this.Formations = data.formations;
        this.totalPages = data.totalpages;
        },
      error: (error) => {
        this.errorMessage = "Une erreur s'est produite lors de la recherche.";
      }
    });
  }


  gotoPage(i : number) {

    this.currentPage = i;

    if(this.currentAcction == "all"){
      this.handlGetFormations();

    }else{
      this.handlsearchFormatio();
    }
  }



}




//
// handlsearchFormatio() {
//
//   let keyword = this.serchFormGroup.value.keyword;
//   this.formationService.searchFormation(keyword).subscribe({
//     next: (data) => {
//       this.Formations = data;
//     },
//     error: (error) => {
//       this.errorMessage = "Une erreur s'est produite lors de la recherche.";
//     }
//   });
// }




//
//
// handleAllProduct(){
//   this.formationService.getAllFormations().subscribe({
//     next: (data) => {
//       this.Formations = data;
//     },
//     error: (error) => {
//       this.errorMessage = error;
//     }
//   });
//
// }
