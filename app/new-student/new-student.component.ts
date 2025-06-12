import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../service/student.service';
import { Student } from '../model/student';
import {Module} from '../model/module';
import {Formation} from '../model/formation';
import {Niveau} from '../model/niveau';
import {HttpClient} from '@angular/common/http';
import {StudentDAO} from '../model/student-dao';
import {FormationDAO} from '../models/formation-dao.model';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-new-student',
  standalone: false,
  templateUrl: './new-student.component.html',
  styleUrls: ['./new-student.component.css']
})
export class NewStudentComponent implements OnInit {

  StudentFormGroup!: FormGroup;
  editMode: boolean = false;
  editedStudentId?: number;
  formations: FormationDAO[] = [];
  niveaux: Niveau[] = [];


  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadFormations();
    this.loadNiveaux();


    const idParam = this.route.snapshot.queryParamMap.get('id');
    this.editedStudentId = idParam ? +idParam : undefined;

    if (this.editedStudentId) {
      this.studentService.loadStudentById(this.editedStudentId).subscribe(s => {
        if (s) {
          this.loadStudentToEdit(s);
        } else {
          console.error("Étudiant non trouvé");
        }
      });
    }
  }


  initForm(): void {
    this.StudentFormGroup = this.fb.group({
      nom: [''],
      prenom: [''],
      email: ['', ],
      photoUrl: [''],
      FormationId: [''],
      NiveauId: ['']
    });
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

  loadNiveaux(): void {
    this.http.get<Niveau[]>("http://localhost:7000/api-gateway/formations/get-all-niveaux").subscribe({


      next:(data)=>{
        this.niveaux = data;
         console.log("les niveau filtrées :", JSON.stringify(this.niveaux, null, 2));
      },
      error:(err)=>{
        console.error("Erreur lors du chargement des Modules", err);
      }

    })
  }






  loadStudentToEdit(student: Student) {
    this.editMode = true;
    this.StudentFormGroup.patchValue({
      nom: student.firstName,
      prenom: student.lastName,
      email: student.email,

      photoUrl: student.photoUrl
    });
  }





  onSaveStudent() {
    if (this.StudentFormGroup.valid) {

      const formValue = this.StudentFormGroup.value;
      console.log("le niveau est "+formValue.NiveauId);

      const newStudent: Student = {
        Id:0,
        Role:'student',
        firstName: formValue.nom,
        lastName: formValue.prenom,
        email: formValue.email,
        formationId: formValue.FormationId,
        niveauId: formValue.NiveauId,
        photoUrl:'gfd',

      };
      console.log("filtrées :", JSON.stringify(newStudent, null, 2));

     this.studentService.addStudent(newStudent).subscribe({
        next: (s) => {
          alert('Étudiant ajouté avec succès !');
          this.StudentFormGroup.reset();
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

  onUpdateStudent() {
    if (this.StudentFormGroup.valid && this.editedStudentId != null) {
      const updatedStudent: Student = {
        ...this.StudentFormGroup.value,
        id: this.editedStudentId,
        role: 'student'
      };

      this.studentService.updateStudent(updatedStudent).subscribe({
        next: (res) => {
          alert('Étudiant mis à jour avec succès !');
          this.StudentFormGroup.reset();
          this.editMode = false;
          this.editedStudentId = undefined;
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la mise à jour !');
        }
      });
    } else {
      alert('Formulaire invalide !');
    }
  }
}



// onSaveStudent() {
//   if (this.StudentFormGroup.valid) {
//     let newStudent: Student = this.StudentFormGroup.value;
//     newStudent.Role = 'student';
//
//     this.studentService.addStudent(newStudent).subscribe({
//       next: (s) => {
//         alert('Étudiant ajouté avec succès !');
//         this.StudentFormGroup.reset();
//       },
//       error: (err) => {
//         console.error(err);
//         alert('Erreur lors de l\'ajout de l\'étudiant');
//       }
//     });
//   } else {
//     alert('Formulaire invalide !');
//   }
// }
