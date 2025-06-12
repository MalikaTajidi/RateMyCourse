// student-sidebar.component.ts - Version mise à jour avec SharedServiceService
import { Component, Output, EventEmitter, OnInit, HostListener, Input, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SharedServiceService, SidebarState } from '../service/shared-service.service';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  badge?: string;
  route?: string;
}

@Component({
  selector: 'app-student-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-sidebar.component.html',
  styleUrl: './student-sidebar.component.css'
})
export class StudentSidebarComponent implements OnInit, OnDestroy {
  // Propriétés pour l'état du sidebar (synchronisées avec le service)
  isCollapsed = false;
  activeItem = 'dashboard';
  isMobile = false;
  isMobileOpen = false;

  // Subject pour gérer la désinscription des observables
  private destroy$ = new Subject<void>();

  @Input() set mobileOpen(value: boolean) {
    this.isMobileOpen = value;
  }

  @Output() sidebarToggled = new EventEmitter<boolean>();
  @Output() mobileClose = new EventEmitter<void>();

  studentInfo = {
    name: 'Amal Taibi Immrani',
    level: 'Étudiant 4ème année',
    status: 'En ligne'
  };

  progressData = {
    modulesEvalues: 6,
    totalModules: 8,
    noteMoyenne: 15.2,
    progressPercentage: 75
  };

  menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: 'fas fa-home',
      color: 'text-blue-600',
      route: '/student-area/dashboard'
    },
    {
      id: 'modules',
      label: 'Mes Modules',
      icon: 'fas fa-book-open',
      color: 'text-green-600',
      badge: '8',
      route: '/student-area/modules'
    },
    {
      id: 'evaluations',
      label: 'Historique Évaluations',
      icon: 'fas fa-clipboard-list',
      color: 'text-purple-600',
      route: '/student-area/evaluation'
    },
    {
      id: 'statistics',
      label: 'Statistiques',
      icon: 'fas fa-chart-bar',
      color: 'text-orange-600',
      route: '/student-area/statistics'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedServiceService
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements d'état du sidebar
    this.sharedService.sidebarState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: SidebarState) => {
        this.isCollapsed = state.isCollapsed;
        this.isMobile = state.isMobile;
        this.isMobileOpen = state.isMobileOpen;

        // Émettre les changements pour les composants parents
        this.sidebarToggled.emit(state.isCollapsed);
      });

    // Mettre à jour l'élément actif en fonction de l'URL actuelle
    this.updateActiveItemFromUrl(this.router.url);

    // S'abonner aux changements de route pour mettre à jour l'élément actif
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveItemFromUrl(event.url);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    // Le service gère automatiquement les changements de taille d'écran
    // Pas besoin de logique supplémentaire ici
  }
  
  updateActiveItemFromUrl(url: string): void {
    // Trouver l'élément de menu correspondant à l'URL actuelle
    const menuItem = this.menuItems.find(item => item.route && url.includes(item.route));
    if (menuItem) {
      this.activeItem = menuItem.id;
    }
  }

  toggleSidebar(): void {
    // Utiliser le service pour basculer l'état du sidebar
    this.sharedService.toggleSidebar();
  }

  selectMenuItem(itemId: string): void {
    this.activeItem = itemId;

    // Trouver l'élément de menu correspondant
    const menuItem = this.menuItems.find(item => item.id === itemId);

    // Sur mobile, fermer la sidebar après sélection
    if (this.isMobile) {
      this.sharedService.closeMobileSidebar();
      this.mobileClose.emit();
    }

    // Naviguer vers la route associée si elle existe
    if (menuItem && menuItem.route) {
      this.router.navigate([menuItem.route]);
    }
  }

  logout(): void {
    // Sur mobile, fermer la sidebar avant logout
    if (this.isMobile) {
      this.sharedService.closeMobileSidebar();
      this.mobileClose.emit();
    }

    // Utiliser le service d'authentification pour se déconnecter
    this.authService.logout();

    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
  }

  // Getter pour les classes CSS (utilise le service)
  get sidebarClasses(): string {
    return this.sharedService.getSidebarClasses().join(' ');
  }

  // Méthodes utilitaires pour les templates
  openMobileSidebar(): void {
    this.sharedService.openMobileSidebar();
  }

  closeMobileSidebar(): void {
    this.sharedService.closeMobileSidebar();
    this.mobileClose.emit();
  }

  // Getter pour obtenir l'état complet du sidebar
  get sidebarState(): SidebarState {
    return this.sharedService.getCurrentState();
  }
}