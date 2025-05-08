import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student, PageStudent } from '../model/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  students: Array<Student> = [];

  constructor() {
    this.students = [
      {
        id: 1,
        nom: 'Benali',
        prenom: 'Sara',
        email: 'sara.benali@example.com',
        password: 'azerty123',
        role: 'student',
        photoUrl: ''
      },
      {
        id: 2,
        nom: 'El Fassi',
        prenom: 'Youssef',
        email: 'youssef.elfassi@example.com',
        password: 'password456',
        role: 'student',
        photoUrl: ''
      },
      {
        id: 3,
        nom: 'Amrani',
        prenom: 'Leila',
        email: 'leila.amrani@example.com',
        password: 'leila2025',
        role: 'student',
        photoUrl: ''
      }
    ];

    for (let i = 0; i < 15; i++) {
      this.students.push(
        {
          id: i + 4,
          nom: 'Mehdi',
          prenom: 'Omar',
          email: `omar.mehdi${i}@example.com`,
          password: 'omarpass',
          role: 'student',
          photoUrl: ''
        }
      );
    }
  }

  public getStudents(): Observable<Student[]> {
    return of(this.students);
  }

  public getAllPageStudent(page: number, size: number): Observable<PageStudent> {
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
    this.students = this.students.filter(s => s.id !== id);
    return of(true);
  }

  public searchStudent(keyword: string, page: number, size: number): Observable<PageStudent> {
    const result = this.students.filter(s => s.nom.includes(keyword));
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

  public addStudent(student: Student): Observable<Student> {
    const newId = Math.max(...this.students.map(s => s.id), 0) + 1;
    student.id = newId;
    this.students.push(student);
    return of(student);
  }

  public updateStudent(updatedStudent: Student): Observable<Student> {
    const index = this.students.findIndex(s => s.id === updatedStudent.id);
    if (index !== -1) {
      this.students[index] = updatedStudent;
      return of(updatedStudent);
    } else {
      throw new Error("Étudiant non trouvé");
    }
  }

  public loadStudentById(id: number): Observable<Student | undefined> {
    const student = this.students.find(s => s.id === id);
    return of(student);
  }
}
