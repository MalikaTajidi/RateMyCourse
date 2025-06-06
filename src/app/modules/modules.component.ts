
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Module {
  id: number;
  title: string;
  description: string;
  filiere: string;
  credits: number;
  status: 'Terminé' | 'Non commencé' | 'En cours';
}

@Component({
  selector: 'app-modules',
  imports: [CommonModule],
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {
  modules: Module[] = [
    {
      id: 1,
      title: 'Algorithmique avancée',
      description: 'Ce module couvre les concepts avancés...',
      filiere: 'Informatique',
      credits: 4,
      status: 'Terminé'
    },
    {
      id: 2,
      title: 'Systèmes d\'exploitation',
      description: 'Étude des principes fondamentaux des systèmes...',
      filiere: 'Informatique',
      credits: 3,
      status: 'Terminé'
    },
    {
      id: 3,
      title: 'Réseaux informatiques',
      description: 'Introduction aux concepts de base des réseaux...',
      filiere: 'Télécommunications',
      credits: 4,
      status: 'En cours'
    },
    {
      id: 4,
      title: 'Intelligence artificielle',
      description: 'Introduction aux principes et techniques de l\'intelligence...',
      filiere: 'Data Science',
      credits: 5,
      status: 'Non commencé'
    },
    {
      id: 5,
      title: 'Mathématiques pour l\'ingénieur',
      description: 'Cours avancé de mathématiques appliquées...',
      filiere: 'Tronc commun',
      credits: 6,
      status: 'Terminé'
    },
    {
      id: 6,
      title: 'Développement web',
      description: 'Introduction aux technologies du web et aux principes de...',
      filiere: 'Informatique',
      credits: 4,
      status: 'En cours'
    }
  ];

  searchText: string = '';
  selectedFiliereFilter: string = 'Toutes les filières';
  selectedStatusFilter: string = 'Tous les statuts';

  filieres: string[] = ['Toutes les filières', 'Informatique', 'Télécommunications', 'Data Science', 'Tronc commun'];
  statuts: string[] = ['Tous les statuts', 'Terminé', 'En cours', 'Non commencé'];

  filteredModules: Module[] = [];
/*méthode qui s'éxécute au démarage*/ 
  ngOnInit(): void {
    this.filteredModules = [...this.modules];
  }

  filterModules(): void {
    this.filteredModules = this.modules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
                           module.description.toLowerCase().includes(this.searchText.toLowerCase());
      
      const matchesFiliere = this.selectedFiliereFilter === 'Toutes les filières' || 
                             module.filiere === this.selectedFiliereFilter;
      
      const matchesStatus = this.selectedStatusFilter === 'Tous les statuts' || 
                           module.status === this.selectedStatusFilter;
      
      return matchesSearch && matchesFiliere && matchesStatus;
    });
  }
/*execute lorsque on tape dans la bare de recherche*/
  onSearch(event: any): void {
    this.searchText = event.target.value;
    this.filterModules();
  }

  onFiliereChange(event: any): void {
    this.selectedFiliereFilter = event.target.value;
    this.filterModules();
  }

  onStatusChange(event: any): void {
    this.selectedStatusFilter = event.target.value;
    this.filterModules();
  }
  evaluerModule(module: Module) {
    console.log("Évaluation du module :", module);
  }



  displayh(){

    console.log("hello")
  }


  handl(){
    console.log("hello")
  }


}
