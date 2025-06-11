import {Component, OnInit} from '@angular/core';
import {Formation} from '../model/formation';
import {ActivatedRoute, Router} from '@angular/router';
import {FormationService} from '../service/formation.service';

@Component({
  selector: 'app-detail-formation',
  standalone: false,
  templateUrl: './detail-formation.component.html',
  styleUrl: './detail-formation.component.css'
})
export class DetailFormationComponent implements OnInit {


  Formations :Array<Formation> = [];


  formation!: Formation | null;
  formationId!: number;
  errorMessage: string = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formationService: FormationService
  ) {}



  ngOnInit(): void {

    this.handleAllFormation();

    this.route.queryParams.subscribe(params => {
      const id = params['id']; // pas snapshot.params
      if (id) {
        this.formationService.findFormationById(id).subscribe({
          next: (f) => {
            if (f) {
              this.formation = f;
            } else {
              this.errorMessage = 'Formation non trouvée.';
            }
          },
          error: () => {
            this.errorMessage = 'Erreur lors du chargement de la formation.';
          }
        });
      } else {
        this.errorMessage = 'ID de formation invalide.';
      }
    });
  }



  handleAllFormation() {
    this.formationService.getAllFormations().subscribe({
      next: (data) => {
        this.Formations = data;
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




















}
