import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginDto } from '../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.redirectUserBasedOnRole();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData: LoginDto = {
        email: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.firstLogin) {
            this.router.navigate(['/first-login'], {
              state: { 
                userId: response.userId,
                role: response.role,
                message: response.message
              }
            });
          } else {
            this.redirectUserBasedOnRole();
          }
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 400) {
            this.errorMessage = error.error?.message || 'Email ou mot de passe incorrect';
          } else if (error.status === 404) {
            this.errorMessage = error.error?.message || 'Utilisateur introuvable';
          } else {
            this.errorMessage = 'Une erreur est survenue lors de la connexion';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private redirectUserBasedOnRole(): void {
    const userRole = this.authService.getUserRole();

    switch (userRole) {
      case 'Admin':
        this.router.navigate(['/navbar/dashbordAdmin']);
        break;
      case 'Prof':
        this.router.navigate(['/student-area/dashboard']);
        break;
      case 'Etudiant':
        this.router.navigate(['/student-area/dashboard']);
        break;
      default:
        this.router.navigate(['/student-area/dashboard']);
        break;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  resetForm(): void {
    this.loginForm.reset();
    this.errorMessage = '';
  }

  onRememberMeChange(event: any): void {
    console.log('Remember me:', event.target.checked);
  }
}
