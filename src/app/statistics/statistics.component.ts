import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  
  semesterGrades = [
    { semester: 'S1', grade: 13.2 },
    { semester: 'S2', grade: 14.1 },
    { semester: 'S3', grade: 14.8 },
    { semester: 'S4', grade: 15.2 },
    { semester: 'S5', grade: 15.2 }
  ];
  
  gradeDistribution = [
    { category: 'Excellent (≥16)', count: 3, color: '#10b981' },
    { category: 'Bien (12-16)', count: 3, color: '#3b82f6' },
    { category: 'Passable (10-12)', count: 0, color: '#f97316' }
  ];
  
  moduleEvaluations = [
    { 
      id: 1,
      name: 'Programmation Web',
      professorRating: 4.5,
      contentRating: 4.8,
      difficultyRating: 3.2,
      comment: "Excellent module avec des projets pratiques très formateurs."
    },
    { 
      id: 2,
      name: 'Intelligence Artificielle',
      professorRating: 4.2,
      contentRating: 4.5,
      difficultyRating: 4.0,
      comment: "Contenu intéressant mais parfois difficile à suivre."
    },
    { 
      id: 3,
      name: 'Réseaux Informatiques',
      professorRating: 3.8,
      contentRating: 4.0,
      difficultyRating: 3.5,
      comment: "Bonne introduction aux concepts de réseaux."
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getProgressWidth(grade: number): string {
    // Calculer la largeur de la barre de progression (max 20/20)
    return (grade / 20 * 100) + '%';
  }
  
  getRatingStars(rating: number): number[] {
    // Retourne un tableau pour afficher les étoiles
    return Array(Math.round(rating)).fill(0);
  }
}