import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedServiceService, SidebarState } from '../service/shared-service.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  // Propriétés pour l'état du sidebar
  sidebarState: SidebarState;

  // Subject pour gérer la désinscription des observables
  private destroy$ = new Subject<void>();

  studentInfo = {
    name: 'Amal Taibi Immrani',
    level: 'Étudiant 4ème année',
    status: 'En ligne'
  };

  // Statistiques de l'étudiant
  stats = {
    modulesCompleted: 6,
    totalModules: 8,
    averageGrade: 15.2,
    completionRate: 75
  };
  
  // Modules récents avec statut d'évaluation
  recentModules = [
    { 
      id: 1, 
      name: 'Programmation Web', 
      status: 'Terminé', 
      grade: 16.5, 
      evaluated: true,
      description: 'Développement d\'applications web avec HTML, CSS et JavaScript.'
    },
    { 
      id: 2, 
      name: 'Bases de Données', 
      status: 'En cours', 
      grade: null, 
      evaluated: false,
      description: 'Conception et implémentation de bases de données relationnelles.'
    },
    { 
      id: 3, 
      name: 'Intelligence Artificielle', 
      status: 'Terminé', 
      grade: 15.0, 
      evaluated: false,
      description: 'Introduction aux concepts et algorithmes d\'intelligence artificielle.'
    },
    { 
      id: 4, 
      name: 'Réseaux Informatiques', 
      status: 'Terminé', 
      grade: 14.5, 
      evaluated: true,
      description: 'Principes fondamentaux des réseaux et protocoles de communication.'
    }
  ];
  
  constructor(
    private router: Router,
    private sharedService: SharedServiceService
  ) {
    this.sidebarState = this.sharedService.getCurrentState();
  }

  ngOnInit(): void {
    // S'abonner aux changements d'état du sidebar
    this.sharedService.sidebarState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: SidebarState) => {
        this.sidebarState = state;
        // Ici vous pouvez ajouter une logique spécifique au dashboard
        // basée sur l'état du sidebar
        this.onSidebarStateChange(state);
      });

    // Charger les données de l'étudiant depuis un service
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Méthode appelée quand l'état du sidebar change
   */
  private onSidebarStateChange(state: SidebarState): void {
    // Logique spécifique au dashboard quand le sidebar change
    // Par exemple, ajuster la taille des graphiques, recalculer des layouts, etc.
    console.log('Dashboard: Sidebar state changed', state);
  }

  /**
   * Getter pour les classes CSS du conteneur
   */
  get containerClasses(): string[] {
    return this.sharedService.getContentClasses();
  }

  evaluateModule(moduleId: number): void {
    // Rediriger vers la page d'évaluation avec l'ID du module
    this.router.navigate(['/student-area/evaluation'], {
      queryParams: {
        moduleId: moduleId
      }
    });
  }
}

