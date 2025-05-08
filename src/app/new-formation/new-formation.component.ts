import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Module} from '../model/module';
import {Formation} from '../model/formation';
import {FormationService} from '../service/formation.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Formulaire} from '../model/formulaire';

@Component({
  selector: 'app-new-formation',
  standalone: false,
  templateUrl: './new-formation.component.html',
  styleUrl: './new-formation.component.css'
})
export class NewFormationComponent implements OnInit {

  formationFormGroup !: FormGroup;
  editMode: boolean = false;
  formation : Formation| undefined;


  constructor(private fb: FormBuilder , private formationService: FormationService ,  private router: Router , private route: ActivatedRoute) { }

  ngOnInit() {
    this.formationFormGroup = this.fb.group({
      nom: this.fb.control(null, [Validators.required, Validators.minLength(5)]),
      description: this.fb.control(null, [Validators.required, Validators.minLength(10)]),
      ecole: this.fb.control(null, [Validators.required, Validators.minLength(5)]),
      listeModule: this.fb.array([], [Validators.required])
    });


    this.route.queryParams.subscribe(params => {
      const id = params['id']; // pas snapshot.params
      if (id) {
        this.formationService.findFormationById(id).subscribe(
          formation => {
            this.formation = formation;
            if (formation) {
              this.initFormulaire(formation);
            }
          }
        );
      }
    });



  }



  initFormulaire(formation: Formation) {
    this.editMode = true;
    this.formationFormGroup = this.fb.group({
      nom: this.fb.control(formation.nom, [Validators.required, Validators.minLength(5)]),
      description: this.fb.control(formation.description, [Validators.required, Validators.minLength(10)]),
      ecole: this.fb.control(formation.ecole, [Validators.required, Validators.minLength(5)]),
      listeModule: this.fb.array([])
    });

    // Ajouter chaque module existant dans le FormArray
    formation.listeModule.forEach(module => {
      const moduleGroup = this.fb.group({
        nom: this.fb.control(module.nom, [Validators.required])
      });
      this.modules.push(moduleGroup);
    });
  }



  // Getter pour accéder facilement au FormArray des modules
  get modules(): FormArray {
    return this.formationFormGroup.get('listeModule') as FormArray;
  }

  // Méthode pour ajouter un nouveau module
  ajouterModule() {
    const moduleFormGroup = this.fb.group({
      nom: this.fb.control(null, [Validators.required])
    });

    this.modules.push(moduleFormGroup);
  }

  // Méthode pour supprimer un module
  supprimerModule(index: number) {
    this.modules.removeAt(index);
  }



  enregistrerFormation(){

    if(this.formationFormGroup.invalid){
      return ;
    }


    const formation: Formation = {
      id: '', // l'ID sera généré dans le service
      nom: this.formationFormGroup.value.nom,
      description: this.formationFormGroup.value.description,
      ecole: this.formationFormGroup.value.ecole,
      listeModule: this.formationFormGroup.value.listeModule.map((m: any, index: number) => ({
        id: index + 1, // ou utilise un UUID si besoin
        nom: m.nom
      }))
    };

    this.formationService.AjouterFormation(formation).subscribe(
      () => {
        this.router.navigate(['/formation']); // redirige vers la liste après ajout
      }
    )


  }





  onSaveFormation(){
    if (this.formationFormGroup.valid) {
      let newFormulaire:Formation= this.formationFormGroup.value;

      // Envoi du formulaire via le service
      this.formationService.AjouterFormation(newFormulaire).subscribe({
        next: (f) => {
          alert('Formation ajouté avec succès !');
          this.formationFormGroup.reset();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'ajout du formation');
        }
      });
    } else {
      alert('Formation invalide !');
    }


  }



  onUpdateForm() {
    if (this.formationFormGroup.valid && this.formation?.id != null) {
      const updatedFormulaire: Formation = {
        ...this.formationFormGroup.value,
        id: this.formation.id
      };

      this.formationService.UpdateFormation(updatedFormulaire).subscribe({
        next: (res) => {
          alert('Formation mis à jour avec succès !');
          this.formationFormGroup.reset();
          // Optionnel : Rediriger ou changer d'état si nécessaire, comme le mettre en mode lecture
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la mise à jour du formation');
        }
      });
    } else {
      alert('Formation invalide ou ID manquant !');
    }
  }






  }



