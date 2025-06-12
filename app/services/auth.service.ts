import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  message?: string;
  firstLogin?: boolean;
  userId?: number;
  role?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api-gateway'; // استخدام الـ proxy
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const storedUser = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getStoredUser(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Méthode pour tester la connexion au backend
  testBackendConnection(): Observable<boolean> {
    console.log('Test de connexion au backend:', `${this.apiUrl}/users/login`);

    // Essayer une requête OPTIONS pour tester CORS
    return this.http.options(`${this.apiUrl}/users/login`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response'
    }).pipe(
      map(() => {
        console.log('Backend accessible via OPTIONS');
        return true;
      }),
      catchError((error) => {
        console.log('Backend non accessible:', error);
        return of(false);
      })
    );
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    console.log('Tentative de connexion avec:', credentials.email);
    console.log('URL utilisée:', `${this.apiUrl}/users/login`);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/users/login`, credentials, { headers })
      .pipe(
        map(response => {
          console.log('Réponse du backend:', response);

          // Adapter la réponse du backend au format attendu
          const loginResponse: LoginResponse = {
            success: !response.firstLogin, // Si c'est la première connexion, on considère que ce n'est pas un succès complet
            firstLogin: response.firstLogin,
            userId: response.userId,
            role: response.role,
            message: response.message
          };

          // Si ce n'est pas la première connexion, on peut considérer que l'utilisateur est connecté
          if (!response.firstLogin && response.token) {
            loginResponse.success = true;
            loginResponse.token = response.token;
            loginResponse.user = {
              id: response.userId,
              email: credentials.email,
              name: response.name || 'Utilisateur',
              role: response.role
            };

            // Stocker le token et les informations utilisateur
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('user', JSON.stringify(loginResponse.user));
            }
            this.currentUserSubject.next(loginResponse.user);
          }

          return loginResponse;
        }),
        catchError(error => {
          console.error('Erreur détaillée:', error);
          let errorMessage = 'Erreur de connexion';

          if (error.status === 0) {
            errorMessage = 'Impossible de se connecter au serveur. Le backend n\'est pas accessible.';
          } else if (error.status === 401) {
            errorMessage = 'Email ou mot de passe incorrect';
          } else if (error.status === 404) {
            errorMessage = 'Service de connexion non trouvé';
          } else if (error.status === 500) {
            errorMessage = 'Erreur serveur interne';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          return throwError(() => ({ ...error, message: errorMessage }));
        })
      );
  }

  logout(): void {
    // Supprimer les données du localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Méthode pour simuler une connexion (à supprimer quand le backend est prêt)
  simulateLogin(credentials: LoginCredentials): Observable<LoginResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        // Accepter plusieurs comptes de test
        const validAccounts = [
          { email: 'admin@engineeval.com', password: 'password123', name: 'Administrateur EngineEval', role: 'admin' },
          { email: 'immraniamal@gmail.com', password: 'PSeR2LvUrf', name: 'Imrane Amal', role: 'Etudiant' }
        ];

        const account = validAccounts.find(acc =>
          acc.email === credentials.email && acc.password === credentials.password
        );

        if (account) {
          // Simuler une première connexion pour l'étudiant
          if (account.role === 'Etudiant') {
            const response: LoginResponse = {
              success: false,
              firstLogin: true,
              userId: 5,
              role: account.role,
              message: 'Première connexion. Veuillez changer votre mot de passe.'
            };
            observer.next(response);
          } else {
            // Connexion normale pour l'admin
            const response: LoginResponse = {
              success: true,
              token: 'fake-jwt-token-' + Date.now(),
              user: {
                id: account.role === 'admin' ? 1 : 5,
                email: credentials.email,
                name: account.name,
                role: account.role
              }
            };

            // Stocker les données
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('token', response.token!);
              localStorage.setItem('user', JSON.stringify(response.user));
            }
            this.currentUserSubject.next(response.user!);

            observer.next(response);
          }
        } else {
          observer.error({
            error: {
              success: false,
              message: 'Email ou mot de passe incorrect'
            }
          });
        }
        observer.complete();
      }, 1000);
    });
  }

  // Méthode pour vérifier si le token est valide
  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{valid: boolean}>(`${this.apiUrl}/auth/validate`, { headers })
      .pipe(
        map(response => response.valid),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  // Méthode pour changer le mot de passe lors de la première connexion
  changePassword(userId: number, newPassword: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post(`${this.apiUrl}/auth/change-password`, {
      userId,
      newPassword
    }, { headers });
  }
}
