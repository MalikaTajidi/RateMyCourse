import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProfilService} from '../service/profil.service';
import {Profil} from '../model/profil';
import {ActivatedRoute, Router} from '@angular/router';

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



  constructor(private fb: FormBuilder, private profilService: ProfilService ,   private route: ActivatedRoute) {
  }

  ngOnInit() {

   this.ProfilFormGroup = this.fb.group({

     nom : this.fb.control('', [Validators.required]),
     prenom : this.fb.control('', [Validators.required]),
     email : this.fb.control('', [Validators.required]),
     photoUrl : this.fb.control(''),
     password : this.fb.control('', [Validators.required]),

   })



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




  loadProfilToEdit(profil: Profil) {
    this.editMode = true;

    this.ProfilFormGroup.patchValue({
      nom: profil.nom,
      prenom: profil.prenom,
      email: profil.email,
      password: profil.password,
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






  onSaveProfil() {
    if (this.ProfilFormGroup.valid) {
      let newProfil: Profil = this.ProfilFormGroup.value;
      newProfil.role = 'utilisateur'; // ou choisis dynamiquement selon ton besoin

      this.profilService.addProfil(newProfil).subscribe({
        next: (p) => {
          alert('Profil ajouté avec succès !');
          this.ProfilFormGroup.reset(); // reset du formulaire
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'ajout du profil');
        }
      });
    } else {
      alert('Formulaire invalide !');
    }
  }




}
