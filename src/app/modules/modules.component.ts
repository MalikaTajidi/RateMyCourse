
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModulesService} from '../service/modules.service';

interface Module {
  id: number;
  name: string;
  status: string;
  description: string;
  filiere: string;
  credits: number;
  evaluated?: boolean;
}

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {
  
  modules: Module[] = [];
  filteredModules: Module[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'Tous les statuts';
  selectedFiliere: string = 'Toutes les filières';
  isLoading: boolean = false;
  error: string = '';
  

  // ID du niveau - vous pouvez le récupérer depuis la route ou le service d'authentification
  currentNiveauId: number = 1; // À adapter selon votre logique

  constructor(
    private router: Router,
    private modulesService: ModulesService
  ) { }

  ngOnInit(): void {
    this.loadModules();
  }

  loadModules(): void {
    this.isLoading = true;
    this.error = '';
    
    this.modulesService.getModulesByNiveau(this.currentNiveauId).subscribe({
      next: (apiModules) => {
        // Transformer les données de l'API en format du frontend
        this.modules = apiModules.map(apiModule => 
          this.modulesService.transformApiModule(apiModule)
        );
        this.filteredModules = [...this.modules];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des modules:', error);
        this.error = 'Erreur lors du chargement des modules. Veuillez réessayer.';
        this.isLoading = false;
        
        // Fallback vers des données de test en cas d'erreur
        this.loadFallbackData();
      }
    });
  }

  private loadFallbackData(): void {
    this.modules = [
      {
        id: 1,
        name: 'Algorithmique avancée',
        status: 'Terminé', // Assurez-vous que le statut est exactement "Terminé"
        description: 'Ce module couvre les concepts avancés des algorithmes et structures de données.',
        filiere: 'Informatique',
        credits: 4,
        evaluated: false
      },
      {
        id: 2,
        name: 'Systèmes d\'exploitation',
        status: 'Terminé', // Assurez-vous que le statut est exactement "Terminé"
        description: 'Étude des principes fondamentaux des systèmes d\'exploitation.',
        filiere: 'Informatique',
        credits: 3,
        evaluated: false
      }
    ];
    this.filteredModules = [...this.modules];
  }
  
  filterModules(): void {
    this.filteredModules = this.modules.filter(module => {
      // Filtrer par terme de recherche
      const matchesSearch = this.searchTerm === '' || 
        module.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtrer par statut
      const matchesStatus = this.selectedStatus === 'Tous les statuts' || 
        module.status === this.selectedStatus;
      
      // Filtrer par filière
      const matchesFiliere = this.selectedFiliere === 'Toutes les filières' || 
        module.filiere === this.selectedFiliere;
      
      return matchesSearch && matchesStatus && matchesFiliere;
    });
  }
  
  evaluateModule(moduleId: number): void {
    console.log('Évaluation du module:', moduleId);
    
    // Trouver le module dans la liste
    const moduleToEvaluate = this.modules.find(m => m.id === moduleId);
    
    if (moduleToEvaluate) {
      // Rediriger vers le composant evaluation avec l'ID du module en paramètre
      this.router.navigate(['/student-area/evaluation'], { 
        queryParams: { 
          moduleId: moduleId
        } 
      });
    } else {
      console.error(`Module avec l'ID ${moduleId} non trouvé`);
    }
  }
  
  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.filterModules();
  }
  
  onStatusChange(event: any): void {
    this.selectedStatus = event.target.value;
    this.filterModules();
  }
  
  onFiliereChange(event: any): void {
    this.selectedFiliere = event.target.value;
    this.filterModules();
  }

  // Méthode pour recharger les modules
  refreshModules(): void {
    this.loadModules();
  }
}

