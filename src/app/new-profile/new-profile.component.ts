import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProfilService} from '../service/profil.service';
import {Profil} from '../model/profil';
import {ActivatedRoute, Router} from '@angular/router';
import {FormationDAO} from '../models/formation-dao.model';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Student} from '../model/student';

@Component({
  selector: 'app-new-profile',
  standalone: false,
  templateUrl: './new-profile.component.html',
  styleUrl: './new-profile.component.css'
})
export class NewProfileComponent implements OnInit {


  ProfilFormGroup !: FormGroup;
  editMode: boolean = false;
  editedProfilId?: number;
  formations: FormationDAO[] = [];



  constructor(private fb: FormBuilder, private profilService: ProfilService ,   private route: ActivatedRoute ,  private http: HttpClient) {
  }

  ngOnInit() {
    this.initForm();
    this.loadFormations();



    this.editedProfilId = +this.route.snapshot.queryParamMap.get('id')!;
    if (this.editedProfilId) {
      this.profilService.loadProfilById(this.editedProfilId).subscribe(p => {
        if (p) {
          console.log(p);
          this.loadProfilToEdit(p);
        } else {
          console.error("Profil non trouvé");
        }
      });
    }


  }



  initForm(): void {
    this.ProfilFormGroup = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', ],
      photoUrl: [''],
      FormationId: [''],

    });
  }


  onSaveProfil() {
    if (this.ProfilFormGroup.valid) {

      let newProfil: Profil = this.ProfilFormGroup.value;

      const newStudent: Profil = {

        Id:0,
        firstName: newProfil.firstName,
        lastName: newProfil.lastName,
        email: newProfil.email,
        FormationId: newProfil.FormationId,
        photoUrl:'gfd',
        role : 'prof'

      };
      console.log("filtrées :", JSON.stringify(newStudent, null, 2));

      this.profilService.addProfil(newStudent).subscribe({
        next: (s) => {
          alert('Prof est ajouté avec succès !');
          this.ProfilFormGroup.reset();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'ajout de l\'étudiant: ' + err.message);
        }
      });
    } else {
      alert('Formulaire invalide ! Veuillez remplir tous les champs obligatoires.');
    }
  }



  loadFormations(): void {
    this.http.get<any[]>("http://localhost:7000/api-gateway/formations").pipe(
      map((apiResponse) =>
        apiResponse.map(item => ({
          formationId: item.formationId,
          formationName: item.formationName
        } as FormationDAO))
      )
    ).subscribe({
      next: (filteredData: FormationDAO[]) => {
        this.formations = filteredData; // Stocke uniquement les 2 champs
        //  console.log("Formations filtrées :", JSON.stringify(this.formations, null, 2));
      },
      error: (err) => {
        console.error("Erreur lors du chargement", err);
      }
    });
  }



  loadProfilToEdit(profil: Profil) {
    this.editMode = true;

    this.ProfilFormGroup.patchValue({
      nom: profil.firstName,
      prenom: profil.lastName,
      email: profil.email,
      photoUrl: profil.photoUrl
    });
  }


  onUpdateProfil() {
    if (this.ProfilFormGroup.valid && this.editedProfilId != null) {
      const updatedProfil: Profil = {
        ...this.ProfilFormGroup.value,
        id: this.editedProfilId,

      };

      this.profilService.updateProfil(updatedProfil).subscribe({
        next: (res) => {
          alert('Profil mis à jour avec succès !');
          this.ProfilFormGroup.reset();
          this.editMode = false;
          this.editedProfilId = undefined;
        },
        error: (err) => {
          console.error(err);
          alert("Erreur lors de la mise à jour !");
        }
      });
    } else {
      alert('Formulaire invalide !');
    }
  }






  // onSaveProfil() {
  //   if (this.ProfilFormGroup.valid) {
  //     let newProfil: Profil = this.ProfilFormGroup.value;
  //     newProfil.role = 'utilisateur'; // ou choisis dynamiquement selon ton besoin
  //
  //     this.profilService.addProfil(newProfil).subscribe({
  //       next: (p) => {
  //         alert('Profil ajouté avec succès !');
  //         this.ProfilFormGroup.reset(); // reset du formulaire
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         alert('Erreur lors de l\'ajout du profil');
  //       }
  //     });
  //   } else {
  //     alert('Formulaire invalide !');
  //   }
  // }






}
