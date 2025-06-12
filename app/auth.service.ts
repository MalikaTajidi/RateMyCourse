import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, tap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
export interface LoginDto {
  email: string;
  password: string;
}

export interface ChangePasswordDto {
  UserId: number;
  NewPassword: string;
}

export interface LoginResponse {
  message: string;
  firstLogin: boolean;
  token?: string;
  userId?: number;
  role?: string;
  user?: {
    Id: number;
    Email: string;
    firstName: string;
    lastName: string;
    Role: string;
    FormationId: number;
    NiveauId?: number;
  };
}

export interface User {
  Id: number;
  Email: string;
  firstName: string;
  lastName: string;
  Role: string;
  FormationId: number;
  NiveauId?: number;
}



@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:7000/api-gateway/users'; // URL corrigée selon votre test Postman
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Charger le token et l'utilisateur depuis le localStorage au démarrage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');

    if (token) {
      this.tokenSubject.next(token);
    }

    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(loginData: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          if (response.token) {
            // Stocker le token
            localStorage.setItem('token', response.token);
            this.tokenSubject.next(response.token);

            // Stocker les informations utilisateur
            if (response.user) {
              localStorage.setItem('currentUser', JSON.stringify(response.user));
              this.currentUserSubject.next(response.user);
            }
          }
        }),
        catchError(error => {
          // Assurez-vous que les erreurs sont correctement propagées
          console.error('Erreur de connexion:', error);
          return throwError(() => error);
        })
      );
  }

  changePassword(changePasswordData: ChangePasswordDto): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/change-password`, changePasswordData, { headers });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Méthode pour vérifier si c'est la première connexion
  isFirstLogin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.Role !== undefined : false; // Vous pouvez ajuster cette logique selon votre besoin
  }

  // Méthode pour obtenir le rôle de l'utilisateur
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.Role : null;
  }
  isStudent(): boolean {
    const role = this.getUserRole();
    return role === 'Student' || role === 'student' || role === 'Etudiant' || role === 'etudiant';
  }

  /**
   * Vérifie si l'utilisateur est un admin
   */
  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'Admin' || role === 'admin' || role === 'Administrateur' || role === 'administrateur';
  }

  /**
   * Vérifise si l'utilisateur est un enseignant
   */
  isTeacher(): boolean {
    const role = this.getUserRole();
    return role === 'Teacher' || role === 'teacher' || role === 'Enseignant' || role === 'enseignant';
  }
}
