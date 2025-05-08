import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Student } from '../model/student';
import { StudentService } from '../service/student.service';

@Component({
  selector: 'app-student',
  standalone: false,
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'] // corrige "styleUrl" en "styleUrls"
})
export class StudentComponent implements OnInit {

  errorMessage!: string;
  students: Student[] = [];

  currentPage: number = 0;
  pageSize: number = 10;
  numberPage: number = 0;

  currentAction: string = 'all';
  searchFormGroup!: FormGroup;

  selectedStudent: Student | null = null;
  showPassword: boolean = false;

  constructor(private studentService: StudentService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    });

    this.loadStudentsPage();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  loadStudentsPage(): void {
    this.studentService.getAllPageStudent(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.students = data.Profil;
        this.numberPage = data.numberpages;
      },
      error: (error) => {
        this.errorMessage = error;
      }
    });
  }

  deleteStudent(student: Student): void {
    const confirmed = confirm('Are you sure you want to delete this student?');
    if (!confirmed) return;

    this.studentService.deleteStudent(student.id).subscribe({
      next: () => {
        const index = this.students.indexOf(student);
        this.students.splice(index, 1);
      },
      error: (error) => {
        this.errorMessage = error;
      }
    });
  }

  searchStudents(): void {
    this.currentAction = 'search';
    const keyword = this.searchFormGroup.value.keyword;

    this.studentService.searchStudent(keyword, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.students = data.Profil;
        this.numberPage = data.numberpages;
      },
      error: (error) => {
        this.errorMessage = "Une erreur s'est produite lors de la recherche.";
      }
    });
  }

  goToPage(index: number): void {
    this.currentPage = index;
    if (this.currentAction === 'all') {
      this.loadStudentsPage();
    } else {
      this.searchStudents();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.numberPage - 1) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    }
  }

  viewStudent(student: Student): void {
    this.selectedStudent = student;
  }
}
