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
      nom: this.fb.control(null),
      description: this.fb.control(null),
      ecole: this.fb.control(null),
      listeModule: this.fb.array([])
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



  // initFormulaire(formation: Formation) {
  //   this.editMode = true;
  //   this.formationFormGroup = this.fb.group({
  //     formationId : this.fb.control(formation.formationId),
  //     nom: this.fb.control(formation.formationName, [Validators.required, Validators.minLength(5)]),
  //     description: this.fb.control(formation.description, [Validators.required, Validators.minLength(10)]),
  //     ecole: this.fb.control(formation.schoolName, [Validators.required, Validators.minLength(5)]),
  //     listeModule: this.fb.array([])
  //   });
  //
  //   // Ajouter chaque module existant dans le FormArray
  //   formation.modules.forEach(module => {
  //     const moduleGroup = this.fb.group({
  //       moduleId : this.fb.control(module.moduleId , [Validators.required]),
  //       name: this.fb.control(module.name, [Validators.required])
  //     });
  //     this.modules.push(moduleGroup);
  //   });
  // }


  initFormulaire(formation: Formation) {
    this.editMode = true;
    this.formationFormGroup = this.fb.group({
      formationId: this.fb.control(formation.formationId),
      nom: this.fb.control(formation.formationName, [Validators.required, Validators.minLength(5)]),
      description: this.fb.control(formation.description, [Validators.required, Validators.minLength(10)]),
      ecole: this.fb.control(formation.schoolName, [Validators.required, Validators.minLength(5)]),
      listeModule: this.fb.array([])
    });

    formation.modules.forEach(module => {
      const moduleGroup = this.fb.group({
        moduleId: this.fb.control(module.moduleId, [Validators.required]),
        nom: this.fb.control(module.name, [Validators.required]) // Notez que c'est 'nom' pour correspondre au template
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
      moduleId : this.fb.control(null),
      nom: this.fb.control(null, [Validators.required])
    });

    this.modules.push(moduleFormGroup);
  }

  onUpdateForm() {
    if (this.formation?.formationId != null) {
      const updatedFormation: Formation = {
        formationId: this.formationFormGroup.value.formationId,
        formationName: this.formationFormGroup.value.nom,
        schoolName: this.formationFormGroup.value.ecole,
        description: this.formationFormGroup.value.description,
        modules: this.formationFormGroup.value.listeModule.map((module: any) => ({
          moduleId: module.moduleId || 0, // Conserve l'ID existant ou 0 pour nouveau
          name: module.nom
        }))
      };

      this.formation = updatedFormation;
        this.formationService.UpdateFormation(updatedFormation).subscribe({
        next: (res) => {
          alert('Formation mise à jour avec succès !');
          this.router.navigate(['/formation']);
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la mise à jour de la formation');
        }
      });
    } else {
      alert('Formation invalide ou ID manquant !');
    }
  }




  onSaveFormation() {
    if (this.formationFormGroup.valid) {
      // Transformez les données pour correspondre à l'API
      let formationData : Formation = {
        formationId : 0,
        formationName: this.formationFormGroup.value.nom,
        schoolName: this.formationFormGroup.value.ecole,
        description: this.formationFormGroup.value.description,
        modules: this.formationFormGroup.value.listeModule.map((module: any) => ({
          name: module.nom
        }))
      };


      console.log('Données envoyées:', formationData); // Pour débogage

      this.formationService.AjouterFormation(formationData).subscribe({
        next: () => {
          alert('Formation ajoutée avec succès !');
          this.router.navigate(['/formation']);
        },
        error: (err) => {
          console.error('Erreur complète:', err);
          alert(`Erreur: ${err.message}`);
        }
      });
    } else {
      alert('Veuillez remplir tous les champs requis');
    }
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
      formationId: 0,
      formationName: this.formationFormGroup.value.nom,
      description: this.formationFormGroup.value.description,
      schoolName: this.formationFormGroup.value.ecole,
      modules: this.formationFormGroup.value.listeModule.map((m: any, index: number) => ({
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











  }



