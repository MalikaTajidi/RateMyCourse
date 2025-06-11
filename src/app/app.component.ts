import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SidbarComponent} from './sidbar/sidbar.component';
import {SharedServiceService} from './service/shared-service.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import { ThemeService, Theme } from './services/theme.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'RateMyCourse';
  hidden = false;
  isPublicPage = true;
  isStudentRole = false;
  
  constructor(
    private sharedService: SharedServiceService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.sharedService.currentValue.subscribe(value => {
      this.hidden = value;
    });
    
    // Surveiller les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updatePageState(event.url);
    });
    
    // Vérifier l'état initial au chargement
    this.updatePageState(this.router.url);
  }
  
  private updatePageState(url: string): void {
    // Définir les routes publiques (sans sidebar)
    const publicRoutes = ['/', '/login', '/forgot-password', '/first-login'];
    this.isPublicPage = publicRoutes.includes(url) || url === '';
    
    // Réinitialiser isStudentRole pour les pages publiques
    if (this.isPublicPage) {
      this.isStudentRole = false;
      return;
    }
    
    // Pour les pages privées, vérifier le rôle de l'utilisateur
    const userRole = this.authService.getUserRole();
    console.log('Rôle utilisateur détecté:', userRole);
    
    // Vérifier si c'est un étudiant
    this.isStudentRole = userRole === 'Student' || userRole === 'student' || userRole === 'Etudiant' || userRole === 'etudiant';
    
    // Alternative : vérifier aussi par l'URL comme fallback
    if (!this.isStudentRole && url.includes('/student-area')) {
      this.isStudentRole = true;
      console.log('Rôle étudiant détecté par URL');
    }
    
    console.log('État actuel - URL:', url, 'isPublicPage:', this.isPublicPage, 'isStudentRole:', this.isStudentRole);
  }
  
  onSidebarToggled(isCollapsed: boolean): void {
    this.hidden = isCollapsed;
    this.sharedService.changeValue(isCollapsed);
  }

}
