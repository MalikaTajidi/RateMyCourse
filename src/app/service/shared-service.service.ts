import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SidebarState {
  isCollapsed: boolean;
  isMobile: boolean;
  isMobileOpen: boolean;
  width: number;
  collapsedWidth: number;
}

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  // État par défaut du sidebar
  private defaultSidebarState: SidebarState = {
    isCollapsed: false,
    isMobile: false,
    isMobileOpen: false,
    width: 288, // Largeur normale du sidebar
    collapsedWidth: 64 // Largeur réduite du sidebar
  };

  // BehaviorSubject pour l'état complet du sidebar
  private sidebarState = new BehaviorSubject<SidebarState>(this.defaultSidebarState);

  // BehaviorSubjects séparés pour des cas d'usage spécifiques
  private isCollapsed = new BehaviorSubject<boolean>(false);
  private isMobile = new BehaviorSubject<boolean>(false);
  private isMobileOpen = new BehaviorSubject<boolean>(false);
  private contentOffset = new BehaviorSubject<number>(0);

  // Observables publics
  public sidebarState$ = this.sidebarState.asObservable();
  public isCollapsed$ = this.isCollapsed.asObservable();
  public isMobile$ = this.isMobile.asObservable();
  public isMobileOpen$ = this.isMobileOpen.asObservable();
  public contentOffset$ = this.contentOffset.asObservable();

  constructor() {
    this.initializeFromStorage();
    this.setupResponsiveListener();
  }

  /**
   * Initialise l'état depuis localStorage
   */
  private initializeFromStorage(): void {
    try {
      const savedCollapsed = localStorage.getItem('student-sidebar-collapsed');
      if (savedCollapsed !== null) {
        const isCollapsed = savedCollapsed === 'true';
        this.updateSidebarState({ isCollapsed });
      }
    } catch (error) {
      console.warn('Erreur lors de la lecture du localStorage:', error);
    }
  }

  /**
   * Configure l'écoute des changements de taille d'écran
   */
  private setupResponsiveListener(): void {
    if (typeof window !== 'undefined') {
      const checkScreenSize = () => {
        const isMobile = window.innerWidth < 768;
        this.updateSidebarState({
          isMobile,
          isMobileOpen: isMobile ? false : this.getCurrentState().isMobileOpen
        });
      };

      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
    }
  }

  /**
   * Met à jour l'état du sidebar et calcule le décalage
   */
  private updateSidebarState(partialState: Partial<SidebarState>): void {
    const currentState = this.sidebarState.value;
    const newState = { ...currentState, ...partialState };

    this.sidebarState.next(newState);
    this.isCollapsed.next(newState.isCollapsed);
    this.isMobile.next(newState.isMobile);
    this.isMobileOpen.next(newState.isMobileOpen);
    this.updateContentOffset(newState);
  }

  /**
   * Calcule et met à jour le décalage du contenu
   */
  private updateContentOffset(state: SidebarState): void {
    let offset = 0;
    
    if (state.isMobile && state.isMobileOpen) {
      offset = state.width;
    } else if (!state.isMobile && !state.isCollapsed) {
      offset = state.width;
    } else if (!state.isMobile && state.isCollapsed) {
      offset = state.collapsedWidth;
    }

    this.contentOffset.next(offset);
  }

  /**
   * Obtient l'état actuel du sidebar
   */
  public getCurrentState(): SidebarState {
    return this.sidebarState.value;
  }

  /**
   * Bascule l'état collapsed du sidebar (desktop uniquement)
   */
  public toggleSidebar(): void {
    const currentState = this.getCurrentState();

    if (!currentState.isMobile) {
      const newCollapsedState = !currentState.isCollapsed;
      this.updateSidebarState({ isCollapsed: newCollapsedState });

      try {
        localStorage.setItem('student-sidebar-collapsed', newCollapsedState.toString());
      } catch (error) {
        console.warn('Erreur lors de la sauvegarde dans localStorage:', error);
      }
    }
  }

  /**
   * Bascule l'état mobile du sidebar
   */
  public toggleMobileSidebar(): void {
    const currentState = this.getCurrentState();

    if (currentState.isMobile) {
      this.updateSidebarState({ isMobileOpen: !currentState.isMobileOpen });
    }
  }

  /**
   * Ferme le sidebar mobile
   */
  public closeMobileSidebar(): void {
    const currentState = this.getCurrentState();

    if (currentState.isMobile && currentState.isMobileOpen) {
      this.updateSidebarState({ isMobileOpen: false });
    }
  }

  /**
   * Ouvre le sidebar mobile
   */
  public openMobileSidebar(): void {
    const currentState = this.getCurrentState();

    if (currentState.isMobile && !currentState.isMobileOpen) {
      this.updateSidebarState({ isMobileOpen: true });
    }
  }

  /**
   * Obtient le décalage actuel du contenu
   */
  public getCurrentOffset(): number {
    return this.contentOffset.value;
  }

  /**
   * Calcule la marge gauche pour le contenu principal
   */
  public getContentMarginLeft(): number {
    const state = this.getCurrentState();
    return state.isMobile ? 0 : (state.isCollapsed ? state.collapsedWidth : state.width);
  }

  /**
   * Réinitialise l'état du sidebar
   */
  public resetSidebarState(): void {
    this.updateSidebarState(this.defaultSidebarState);
    try {
      localStorage.removeItem('student-sidebar-collapsed');
    } catch (error) {
      console.warn('Erreur lors de la suppression du localStorage:', error);
    }
  }

  /**
   * Obtient les classes CSS pour le contenu principal
   */
  public getContentClasses(): string[] {
    const state = this.getCurrentState();
    const classes: string[] = [];

    if (state.isMobile) {
      classes.push('mobile-mode');
    } else {
      classes.push(state.isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded');
    }

    return classes;
  }

  /**
   * Obtient les classes CSS pour le sidebar
   */
  public getSidebarClasses(): string[] {
    const state = this.getCurrentState();
    const classes: string[] = ['sidebar'];

    if (state.isCollapsed && !state.isMobile) {
      classes.push('collapsed');
    }

    if (state.isMobile) {
      classes.push('mobile');
      if (state.isMobileOpen) {
        classes.push('mobile-open');
      }
    }

    return classes;
  }

  /**
   * Définit l'état collapsed du sidebar
   */
  public setSidebarCollapsed(collapsed: boolean): void {
    const currentState = this.getCurrentState();

    if (!currentState.isMobile) {
      this.updateSidebarState({ isCollapsed: collapsed });

      // Sauvegarder dans localStorage
      try {
        localStorage.setItem('student-sidebar-collapsed', collapsed.toString());
      } catch (error) {
        console.warn('Erreur lors de la sauvegarde dans localStorage:', error);
      }
    }
  }

  // Méthodes de compatibilité avec l'ancien service
  public changeValue(newValue: boolean): void {
    this.setSidebarCollapsed(newValue);
  }

  public get currentValue(): Observable<boolean> {
    return this.isCollapsed$;
  }
}