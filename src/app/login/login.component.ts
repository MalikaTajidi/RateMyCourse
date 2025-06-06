import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est déjà connecté
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.router.navigate(['/dashbord']);
      }
    }


  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = {
        email: this.loginForm.value.username,
        password: this.loginForm.value.password
      };



      // D'abord tester la connexion au backend
      this.authService.testBackendConnection().subscribe({
        next: (isBackendAvailable) => {
          if (isBackendAvailable) {
            console.log('Backend disponible, tentative de connexion...');
            this.tryRealLogin(credentials);
          } else {
            console.log('Backend non disponible, utilisation de la simulation...');
            this.trySimulatedLogin(credentials);
          }
        },
        error: () => {
          console.log('Erreur lors du test de connexion, utilisation de la simulation...');
          this.trySimulatedLogin(credentials);
        }
      });
      
    } else {
      this.markFormGroupTouched();
    }
  }

  private tryRealLogin(credentials: any): void {
    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response.firstLogin) {
          // Première connexion - afficher un message et rediriger
          alert(`${response.message}\nVous devez changer votre mot de passe.`);
          console.log('Première connexion détectée:', response);
        } else if (response.success) {
          // Connexion réussie - rediriger vers le dashboard
          this.router.navigate(['/dashbord']);
        } else {
          this.errorMessage = response.message || 'Erreur de connexion';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur de connexion réelle:', error);
        // Fallback vers la simulation
        console.log('Fallback vers la simulation...');
        this.trySimulatedLogin(credentials);
      }
    });
  }

  private trySimulatedLogin(credentials: any): void {
    this.authService.simulateLogin(credentials).subscribe({
      next: (response) => {
        if (response.firstLogin) {
          // Première connexion - afficher un message
          alert(`${response.message}\nSimulation: Vous devez changer votre mot de passe.`);
          console.log('Première connexion simulée détectée:', response);
          // Pour la simulation, on peut rediriger vers le dashboard quand même
          this.router.navigate(['/dashbord']);
        } else if (response.success) {
          this.router.navigate(['/dashbord']);
        } else {
          this.errorMessage = response.message || 'Erreur de connexion';
        }
        this.isLoading = false;
      },
      error: (simError) => {
        this.errorMessage = simError.error?.message || 'Email ou mot de passe incorrect';
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }



  goToForgotPassword(): void {
    // Redirection vers la page de récupération de mot de passe
    console.log('Redirection vers la page de récupération de mot de passe');
  }
}
