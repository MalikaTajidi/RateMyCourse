import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../service/student.service';
import { Student } from '../model/student';

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

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.StudentFormGroup = this.fb.group({
      nom: this.fb.control('', [Validators.required]),
      prenom: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required]),
      photoUrl: this.fb.control('')
    });

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

  loadStudentToEdit(student: Student) {
    this.editMode = true;
    this.StudentFormGroup.patchValue({
      nom: student.nom,
      prenom: student.prenom,
      email: student.email,
      password: student.password,
      photoUrl: student.photoUrl
    });
  }

  onSaveStudent() {
    if (this.StudentFormGroup.valid) {
      let newStudent: Student = this.StudentFormGroup.value;
      newStudent.role = 'student';

      this.studentService.addStudent(newStudent).subscribe({
        next: (s) => {
          alert('Étudiant ajouté avec succès !');
          this.StudentFormGroup.reset();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'ajout de l\'étudiant');
        }
      });
    } else {
      alert('Formulaire invalide !');
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
