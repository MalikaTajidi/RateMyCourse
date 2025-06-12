import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student, PageStudent } from '../model/student';
import {HttpClient} from '@angular/common/http';
import {Formation} from '../model/formation';
import {Module} from '../model/module';
import {FormationService} from './formation.service';
import {Niveau} from '../model/niveau';


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  students: Array<Student> = [];



  constructor(private http: HttpClient ,  private  formationService : FormationService) { }







  public chargerToutesLesStudent(): void {
    this.http.get<Student[]>("http://localhost:7000/api-gateway/users/getStudents").subscribe({
      next: (data) => {
        this.students = data;
        console.log("Formations chargées :", this.students);
      },
      error: (err) => {
        console.error("Erreur lors du chargement des formations", err);
      }
    });
  }





  public getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>("http://localhost:7000/api-gateway/users/getStudents");
  }

  public getAllPageStudent(page: number, size: number): Observable<PageStudent> {
    this.chargerToutesLesStudent();
    const index = page * size;
    let totalPage = ~~(this.students.length / size);
    if (this.students.length % size !== 0) {
      totalPage++;
    }
    const pageStudents = this.students.slice(index, index + size);

    return of({
      Profil: pageStudents,
      page,
      size,
      numberpages: totalPage
    });
  }

  public deleteStudent(id: number): Observable<boolean> {
    this.students = this.students.filter(s => s.Id !== id);
    return of(true);
  }

  public searchStudent(keyword: string, page: number, size: number): Observable<PageStudent> {
    const result = this.students.filter(s => s.firstName.includes(keyword));
    const index = page * size;
    let totalPage = ~~(result.length / size);
    if (result.length % size !== 0) {
      totalPage++;
    }

    const pageStudents = result.slice(index, index + size);
    return of({
      Profil: pageStudents,
      page,
      size,
      numberpages: totalPage
    });
  }

  // public addStudent(student: Student): Observable<Student> {
  //   this.students.push(student);
  //   return of(student);
  // }




  public addStudent(student: Student): Observable<Student> {

    console.log("hello")
   const studentz ={
      firstName : student.firstName,
      lastName : student.lastName,
      email : student.email,
      FormationId :student.formationId,
      niveauId : student.niveauId,

    }

    return this.http.post<Student>('http://localhost:7000/api-gateway/users/add-student', studentz );


  }





  public updateStudent(updatedStudent: Student): Observable<Student> {
    const index = this.students.findIndex(s => s.Id === updatedStudent.Id);
    if (index !== -1) {
      this.students[index] = updatedStudent;
      return of(updatedStudent);
    } else {
      throw new Error("Étudiant non trouvé");
    }
  }

  public loadStudentById(id: number): Observable<Student | undefined> {
    const student = this.students.find(s => s.Id === id);
    return of(student);
  }


  // Dans student.service.ts
  getAllModules(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:7000/api-gateway/formations/get-all-modules');
  }




}
