
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentSidebarComponent } from '../student-sidebar/student-sidebar.component';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SharedServiceService, SidebarState } from '../service/shared-service.service';
@Component({
  selector: 'app-student-area',
  standalone: false,
  templateUrl: './student-area.component.html',
  styleUrl: './student-area.component.css'
})
export class StudentAreaComponent implements OnInit, OnDestroy {
  // Propriétés synchronisées avec le service
  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;
  isMobile = false;
  currentPageTitle = 'Tableau de Bord';

  // Subject pour gérer la désinscription des observables
  private destroy$ = new Subject<void>();

  // Titres des pages selon les routes
  private pageTitles: { [key: string]: string } = {
    'dashboard': 'Tableau de Bord',
    'modules': 'Mes Modules',
    'evaluation': 'Évaluation',
    'statistics': 'Statistiques'
  };

  constructor(
    private router: Router,
    private sharedService: SharedServiceService
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements d'état du sidebar
    this.sharedService.sidebarState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: SidebarState) => {
        this.isSidebarCollapsed = state.isCollapsed;
        this.isMobile = state.isMobile;
        this.isMobileSidebarOpen = state.isMobileOpen;
      });

    this.updatePageTitle(this.router.url);

    // Écouter les changements de route pour mettre à jour le titre
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.updatePageTitle(event.url);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    // Le service gère automatiquement les changements de taille d'écran
  }

  private updatePageTitle(url: string): void {
    // Extraire la partie de l'URL qui correspond à la page
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];

    this.currentPageTitle = this.pageTitles[lastPart] || 'EvalProg';
  }

  onSidebarToggled(collapsed: boolean): void {
    // Cette méthode est maintenant gérée automatiquement par le service
    // Mais on la garde pour la compatibilité avec le template
    this.isSidebarCollapsed = collapsed;
  }

  toggleMobileSidebar(): void {
    this.sharedService.toggleMobileSidebar();
  }

  closeMobileSidebar(): void {
    this.sharedService.closeMobileSidebar();
  }

  // Getters utiles pour le template
  get contentClasses(): string[] {
    return this.sharedService.getContentClasses();
  }

  get sidebarState(): SidebarState {
    return this.sharedService.getCurrentState();
  }
}