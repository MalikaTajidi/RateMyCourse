import {Component, OnInit} from '@angular/core';
import {SharedServiceService} from '../service/shared-service.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashbord',
  standalone: false,
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css'
})
export class DashbordComponent implements OnInit {

  hidden = false;  // important d'initialiser hidden

  // Données pour les statistiques
  totalFormations = 15;
  totalStudents = 342;
  totalTeachers = 28;
  totalEvaluations = 156;

  // Données pour l'activité récente
  recentActivities = [
    {
      type: 'formation',
      icon: 'bx bxs-graduation',
      title: 'Nouvelle Formation Ajoutée',
      description: 'Formation "Génie Logiciel Avancé" créée',
      time: 'Il y a 2 heures'
    },
    {
      type: 'student',
      icon: 'bx bxs-user-plus',
      title: 'Nouvel Étudiant Inscrit',
      description: 'Ahmed Benali s\'est inscrit en Génie Informatique',
      time: 'Il y a 4 heures'
    },
    {
      type: 'evaluation',
      icon: 'bx bxs-file',
      title: 'Évaluation Complétée',
      description: '25 étudiants ont complété l\'évaluation du module "Algorithmes"',
      time: 'Il y a 6 heures'
    },
    {
      type: 'teacher',
      icon: 'bx bxs-user',
      title: 'Nouveau Professeur',
      description: 'Dr. Sarah Martin a rejoint l\'équipe pédagogique',
      time: 'Il y a 1 jour'
    }
  ];

  constructor(private sharedService: SharedServiceService) { }

  ngOnInit(): void {
    // écouter les changements de la sidebar
    this.sharedService.currentValue.subscribe(value => {
      this.hidden = value;
    });
  }

}
