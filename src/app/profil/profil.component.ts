import {Component, OnInit} from '@angular/core';
import {Profil} from '../model/profil';
import {ProfilService} from '../service/profil.service';
import {FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-profil',
  standalone: false,
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent  implements OnInit{

  errorMessage !: string;
  Profils : Array<Profil> = [];

  currentPage: number = 0 ;
  pagesize : number = 10 ;
  numberPage : number = 0 ;


  currentAcction : string = "all";


  serchFormGroup ! : FormGroup;



  selectedProfil: any = null;


  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }









  constructor(private profilService : ProfilService , private fb : FormBuilder) { }


  ngOnInit(){

    this.serchFormGroup = this.fb.group({
      keyword : this.fb.control("hello"),

    })


    this.handleGetPageProfil();
  }














  handleProfil(){

    this.profilService.getProfils().subscribe(
      {
        next : (data) =>{
          this.Profils = data
        },
        error : (error) =>{
          this.errorMessage = error
        }
      }


    )
  }

  handleGetPageProfil(){

    this.profilService.getAllPageProfil(this.currentPage , this.pagesize ).subscribe(
      {
        next : (data) =>{
          this.Profils = data.Profil;
          this.numberPage = data.numberpages;},
        error: (error) => {
          this.errorMessage = error;
        }


      }
      )

  }




  handleDeleteProfil(P : Profil) {

    let conf = confirm("Are you sure you want to delete this formation?");
    if(conf == false)return ;

    this.profilService.deletProfil(P.Id).subscribe({

      next: (data) =>{
        let index = this.Profils.indexOf(P);
        this.Profils.splice(index,1);
      },
      error: (error) => {
        this.errorMessage = error;
      }
    }
    )
  }


  handlsearchProfil(){

    this.currentAcction = "search";

    let keyword = this.serchFormGroup.value.keyword;

    this.profilService.serchProfil(keyword , this.currentPage , this.pagesize).subscribe(
      {
        next :(data)=>{

          this.Profils = data.Profil;
          this.numberPage = data.numberpages;

        },
        error: (error) => {
          this.errorMessage = "Une erreur s'est produite lors de la recherche.";
        }
      }
    )
  }



  gotoPage(i:number){
    this.currentPage = i;

    if(this.currentAcction == "all"){
      this.handleGetPageProfil();

    }else{
      this.handlsearchProfil();
    }
  }



  nextPage() {
    if (this.currentPage < this.numberPage - 1) {
      this.gotoPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.gotoPage(this.currentPage - 1);
    }
  }






  selectedProfile: any = null;

  viewProfile(profile: any) {
    this.selectedProfile = profile;
  }







}
