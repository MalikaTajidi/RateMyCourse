import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AbstractControl,  FormControl } from '@angular/forms';
import { ChangePasswordDto } from '../auth.service'

interface ChangePasswordResponse {
  message: string;
  success: boolean;
}

@Component({
  selector: 'app-first-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.css']
})
export class FirstLoginComponent implements OnInit {
 changePasswordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  userId: number = 0;
  userRole: string = '';
  firstLoginMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Récupérer les données de navigation
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.userId = navigation.extras.state['userId'];
      this.userRole = navigation.extras.state['role'];
      this.firstLoginMessage = navigation.extras.state['message'];
    }
  }

  ngOnInit(): void {
    // Si pas d'userId, rediriger vers login
    if (!this.userId) {
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const changePasswordData: ChangePasswordDto = {
        UserId: this.userId,
        NewPassword: this.changePasswordForm.get('newPassword')?.value
      };

      this.authService.changePassword(changePasswordData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Mot de passe modifié avec succès';
          
          // Attendre 2 secondes puis rediriger vers login
          setTimeout(() => {
            this.router.navigate(['/login'], {
              state: { message: 'Mot de passe modifié. Veuillez vous reconnecter.' }
            });
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          
          if (error.status === 404) {
            this.errorMessage = 'Utilisateur introuvable';
          } else {
            this.errorMessage = 'Une erreur est survenue lors du changement de mot de passe';
          }
          
          console.error('Erreur changement mot de passe:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  // Validateur personnalisé pour le mot de passe
  private passwordValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasNumber && hasUpper && hasLower && hasSpecial;
    
    if (!valid) {
      return {
        passwordStrength: {
          hasNumber,
          hasUpper,
          hasLower,
          hasSpecial
        }
      };
    }
    return null;
  }

  // Validateur pour vérifier que les mots de passe correspondent
  private passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  private markFormGroupTouched(): void {
    Object.keys(this.changePasswordForm.controls).forEach(key => {
      this.changePasswordForm.get(key)?.markAsTouched();
    });
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get newPassword() { return this.changePasswordForm.get('newPassword'); }
  get confirmPassword() { return this.changePasswordForm.get('confirmPassword'); }

  // Méthode pour vérifier la force du mot de passe
  getPasswordStrengthErrors(): string[] {
    const errors = this.newPassword?.errors?.['passwordStrength'];
    if (!errors) return [];

    const messages: string[] = [];
    if (!errors.hasNumber) messages.push('Au moins un chiffre');
    if (!errors.hasUpper) messages.push('Au moins une majuscule');
    if (!errors.hasLower) messages.push('Au moins une minuscule');
    if (!errors.hasSpecial) messages.push('Au moins un caractère spécial');

    return messages;
  }
}
