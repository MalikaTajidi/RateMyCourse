import {Component, HostListener, Output, EventEmitter, OnInit} from '@angular/core';
import {SharedServiceService} from '../service/shared-service.service';
import {Router, NavigationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-sidbar',
  standalone: false,
  templateUrl: './sidbar.component.html',
  styleUrl: './sidbar.component.css'
})
export class SidbarComponent implements OnInit {
  activeRoute = 'dashbordAdmin'; // valeur par défaut
  isSidebarHidden = false;
  isMobile = false;

  @Output() sidebarToggled = new EventEmitter<boolean>();

  constructor(
    private sharedService: SharedServiceService,
    private router: Router,
    private authService: AuthService
  ) {}

  // Pour vérifier au premier chargement aussi
  ngOnInit() {
    this.checkScreenSize();
    
    // Récupérer l'état de la sidebar depuis le localStorage (seulement pour desktop)
    if (!this.isMobile) {
      const savedState = localStorage.getItem('adminSidebarHidden');
      if (savedState !== null) {
        this.isSidebarHidden = savedState === 'true';
        this.sharedService.changeValue(this.isSidebarHidden);
        this.sidebarToggled.emit(this.isSidebarHidden);
      }
    }
    
    // Mettre à jour l'élément actif en fonction de l'URL actuelle
    this.updateActiveRouteFromUrl(this.router.url);
    
    // S'abonner aux changements de route pour mettre à jour l'élément actif
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveRouteFromUrl(event.url);
    });
  }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
    this.sharedService.changeValue(this.isSidebarHidden);
    this.sidebarToggled.emit(this.isSidebarHidden);
    
    // Stocker l'état dans le localStorage pour le conserver entre les rechargements
    if (!this.isMobile) {
      localStorage.setItem('adminSidebarHidden', this.isSidebarHidden.toString());
    }
  }

  setActive(route: string) {
    this.activeRoute = route;
  }

  // Écouter les changements de taille d'écran
  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }
  
  private checkScreenSize(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;
    
    // Ajuster la sidebar en fonction de la taille de l'écran
    if (this.isMobile) {
      this.isSidebarHidden = true;
      this.sharedService.changeValue(this.isSidebarHidden);
      this.sidebarToggled.emit(this.isSidebarHidden);
    } else if (wasMobile && !this.isMobile) {
      // Si on passe de mobile à desktop, restaurer l'état de la sidebar
      const savedState = localStorage.getItem('adminSidebarHidden');
      if (savedState !== null) {
        this.isSidebarHidden = savedState === 'true';
        this.sharedService.changeValue(this.isSidebarHidden);
        this.sidebarToggled.emit(this.isSidebarHidden);
      } else {
        this.isSidebarHidden = false;
        this.sharedService.changeValue(this.isSidebarHidden);
        this.sidebarToggled.emit(this.isSidebarHidden);
      }
    }
  }
  
  private updateActiveRouteFromUrl(url: string): void {
    // Extraire la partie de l'URL qui correspond à la route admin
    const urlParts = url.split('/');
    if (urlParts.length > 2 && urlParts[1] === 'navbar') {
      // Pour les routes admin (/navbar/dashbordAdmin, /navbar/formations, etc.)
      this.activeRoute = urlParts[2];
    } else if (urlParts.length > 1) {
      // Pour les autres routes
      this.activeRoute = urlParts[1];
    }
  }
  
  logout(): void {
    // Déconnexion via le service d'authentification
    this.authService.logout();
    // Nettoyer le localStorage de la sidebar
    localStorage.removeItem('adminSidebarHidden');
    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
  }
}
