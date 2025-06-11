// evaluation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfGeneratorService, EvaluationData } from '../services/pdf-generator.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ModulesService } from '../service/modules.service';

interface Question {
  id: number;
  content: string;
  options: string[];
  type?: string; // Ajout de la propriété type
}

interface Section {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

interface Module {
  id: number;
  name: string;
  status: string;
  description: string;
  filiere: string;
  credits: number;
  code?: string; // Ajout de la propriété code
  evaluated?: boolean;
}

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {
  evaluationForm: FormGroup;
  sections: Section[] = [];
  currentSection = 0;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  showValidationErrors = false;
  moduleId: number = 0;
  moduleName: string = '';
  moduleInfo: Module | null = null;
  isLoading: boolean = true;
  isGeneratingPDF: boolean = false;

  // Options d'évaluation
  ratingOptions = ['1 - Très insatisfait', '2 - Insatisfait', '3 - Neutre', '4 - Satisfait', '5 - Très satisfait'];

  // Données pour le PDF
  evaluationSubmitted: boolean = false;
  submissionData: EvaluationData | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private modulesService: ModulesService,
    private pdfGenerator: PdfGeneratorService
  ) {
    this.evaluationForm = this.fb.group({});
  }

  ngOnInit(): void {
    // Récupérer l'ID du module depuis les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      if (params['moduleId']) {
        this.moduleId = +params['moduleId'];
        console.log('Module ID reçu:', this.moduleId);
        // Charger les informations du module
        this.loadModuleInfo();
      } else {
        console.error('Aucun ID de module fourni');
        this.errorMessage = 'Aucun module spécifié pour l\'évaluation.';
        this.isLoading = false;
      }
    });
  }

  loadModuleInfo(): void {
    this.isLoading = true;
    
    // Récupérer les informations du module depuis le service
    this.modulesService.getModulesByNiveau(1).subscribe({
      next: (modules) => {
        // Transformer les données de l'API en format du frontend
        const allModules = modules.map(apiModule => 
          this.modulesService.transformApiModule(apiModule)
        );
        
        // Trouver le module correspondant à l'ID
        const foundModule = allModules.find(module => module.id === this.moduleId);
        
        if (foundModule) {
          this.moduleInfo = foundModule;
          this.moduleName = foundModule.name;
          console.log('Module trouvé:', this.moduleInfo);
          // Charger les données d'évaluation
          this.loadEvaluationData();
        } else {
          // Si le module n'est pas trouvé dans l'API, essayer avec les données de test
          this.tryWithTestData();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des informations du module:', error);
        this.errorMessage = 'Erreur lors du chargement des informations du module.';
        // En cas d'erreur, essayer avec les données de test
        this.tryWithTestData();
      }
    });
  }

  tryWithTestData(): void {
    // Essayer de trouver le module dans les données de test
    const testModules = [
      {
        id: 1,
        name: 'Algorithmique avancée',
        status: 'Terminé',
        description: 'Ce module couvre les concepts avancés des algorithmes et structures de données.',
        filiere: 'Informatique',
        credits: 4
      },
      {
        id: 2,
        name: 'Systèmes d\'exploitation',
        status: 'Terminé',
        description: 'Étude des principes fondamentaux des systèmes d\'exploitation.',
        filiere: 'Informatique',
        credits: 3
      },
      {
        id: 3,
        name: 'Programmation Web',
        status: 'En cours',
        description: 'Développement d\'applications web avec HTML, CSS et JavaScript.',
        filiere: 'Informatique',
        credits: 3
      },
      {
        id: 4,
        name: 'Bases de Données',
        status: 'En cours',
        description: 'Conception et implémentation de bases de données relationnelles.',
        filiere: 'Informatique',
        credits: 3
      },
      {
        id: 5,
        name: 'Intelligence Artificielle',
        status: 'Terminé',
        description: 'Introduction aux concepts et algorithmes d\'intelligence artificielle.',
        filiere: 'Data Science',
        credits: 4
      }
    ];
    
    const foundModule = testModules.find(module => module.id === this.moduleId);
    
    if (foundModule) {
      this.moduleInfo = foundModule;
      this.moduleName = foundModule.name;
      console.log('Module trouvé dans les données de test:', this.moduleInfo);
      // Charger les données d'évaluation
      this.loadEvaluationData();
    } else {
      // Si le module n'est pas trouvé dans les données de test non plus, utiliser des données génériques
      this.useFallbackModuleData();
    }
  }

  useFallbackModuleData(): void {
    // Données génériques pour la démo
    this.moduleInfo = {
      id: this.moduleId,
      name: 'Module ' + this.moduleId,
      status: 'Terminé',
      description: 'Description du module ' + this.moduleId,
      filiere: 'Informatique',
      credits: 3
    };
    this.moduleName = this.moduleInfo.name;
    console.log('Utilisation de données génériques pour le module:', this.moduleInfo);
    
    // Charger les données d'évaluation
    this.loadEvaluationData();
  }

  loadEvaluationData(): void {
    // Créer les sections d'évaluation
    this.sections = [
      {
        id: 1,
        title: 'Pédagogie',
        description: 'Évaluez la qualité pédagogique du module',
        questions: [
          { id: 1, content: 'Clarté des explications du professeur', options: this.ratingOptions },
          { id: 2, content: 'Qualité des supports de cours', options: this.ratingOptions },
          { id: 3, content: 'Pertinence des exemples utilisés', options: this.ratingOptions },
          { id: 4, content: 'Disponibilité du professeur pour répondre aux questions', options: this.ratingOptions }
        ]
      },
      {
        id: 2,
        title: 'Contenu du cours',
        description: 'Évaluez la qualité et la pertinence du contenu',
        questions: [
          { id: 5, content: 'Pertinence des sujets abordés', options: this.ratingOptions },
          { id: 6, content: 'Actualité des connaissances transmises', options: this.ratingOptions },
          { id: 7, content: 'Équilibre entre théorie et pratique', options: this.ratingOptions },
          { id: 8, content: 'Cohérence du contenu avec les objectifs annoncés', options: this.ratingOptions }
        ]
      },
      {
        id: 3,
        title: 'Organisation et moyens',
        description: 'Évaluez l\'organisation et les ressources du module',
        questions: [
          { id: 9, content: 'Qualité des salles et équipements', options: this.ratingOptions },
          { id: 10, content: 'Accessibilité des ressources en ligne', options: this.ratingOptions },
          { id: 11, content: 'Respect du planning annoncé', options: this.ratingOptions },
          { id: 12, content: 'Disponibilité des ressources bibliographiques', options: this.ratingOptions }
        ]
      },
      {
        id: 4,
        title: 'Évaluation globale',
        description: 'Donnez votre appréciation générale du module',
        questions: [
          { id: 13, content: 'Satisfaction générale concernant ce module', options: this.ratingOptions },
          { id: 14, content: 'Recommanderiez-vous ce module à d\'autres étudiants?', options: this.ratingOptions },
          { id: 15, content: 'Ce module a-t-il répondu à vos attentes?', options: this.ratingOptions }
        ]
      }
    ];
    
    // Initialiser le formulaire
    this.initForm();
    this.isLoading = false;
  }

  initForm(): void {
    const formControls: { [key: string]: any } = {};

    this.sections.forEach(section => {
      section.questions.forEach(question => {
        formControls[`question_${question.id}`] = ['', Validators.required];
      });
    });

    // Ajouter le champ de commentaires (optionnel)
    formControls['comments'] = [''];

    this.evaluationForm = this.fb.group(formControls);
  }

  getProgressPercentage(): number {
    return ((this.currentSection + 1) / this.sections.length) * 100;
  }

  nextSection() {
    if (this.currentSection < this.sections.length - 1) {
      // Vérifier que toutes les questions de la section actuelle sont remplies
      const currentSectionValid = this.isSectionValid(this.currentSection);
      if (currentSectionValid) {
        this.currentSection++;
        window.scrollTo(0, 0); // Remonter en haut de la page
      } else {
        this.showValidationErrors = true;
      }
    }
  }

  previousSection() {
    if (this.currentSection > 0) {
      this.currentSection--;
      window.scrollTo(0, 0); // Remonter en haut de la page
    }
  }

  isSectionValid(sectionIndex: number): boolean {
    const section = this.sections[sectionIndex];
    return section.questions.every(question => {
      const control = this.evaluationForm.get(`question_${question.id}`);
      return control && control.value;
    });
  }

isQuestionAnswered(questionId: number): boolean {
  const control = this.evaluationForm.get(`question_${questionId}`);
  return !!control && control.value !== '';
}

  getAnsweredQuestionsCount(): number {
    let count = 0;
    this.sections.forEach(section => {
      section.questions.forEach(question => {
        if (this.isQuestionAnswered(question.id)) {
          count++;
        }
      });
    });
    return count;
  }

  getTotalQuestionsCount(): number {
    let count = 0;
    this.sections.forEach(section => {
      count += section.questions.length;
    });
    return count;
  }

  getOverallProgress(): number {
    const answered = this.getAnsweredQuestionsCount();
    const total = this.getTotalQuestionsCount();
    return total > 0 ? (answered / total) * 100 : 0;
  }

  getSectionValidationMessage(): string {
    const currentSectionValid = this.isSectionValid(this.currentSection);
    
    if (currentSectionValid) {
      return "Toutes les questions de cette section sont complétées.";
    } else {
      const section = this.sections[this.currentSection];
      const unansweredCount = section.questions.filter(q => !this.isQuestionAnswered(q.id)).length;
      
      return `Il reste ${unansweredCount} question${unansweredCount > 1 ? 's' : ''} à compléter dans cette section.`;
    }
  }

  generatePDF() {
    // Créer un nouveau document PDF
    const doc = new jsPDF();
    
    // Ajouter un titre
    doc.setFontSize(20);
    doc.text(`Évaluation du module: ${this.moduleName}`, 14, 22);
    
    // Ajouter des informations sur le module
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 32);
    
    if (this.moduleInfo) {
      doc.text(`Filière: ${this.moduleInfo.filiere}`, 14, 38);
      doc.text(`Crédits: ${this.moduleInfo.credits}`, 14, 44);
      doc.text(`Description: ${this.moduleInfo.description}`, 14, 50);
      let yPosition = 60;
      
      // Parcourir chaque section
      this.sections.forEach(section => {
        // Ajouter le titre de la section
        doc.setFontSize(16);
        doc.text(`Section: ${section.title}`, 14, yPosition);
        yPosition += 10;
        
        // Tableau pour stocker les données des questions
        const tableData: Array<[string, string]> = [];
        
        // Parcourir chaque question de la section
        section.questions.forEach(question => {
          const value = this.evaluationForm.get(`question_${question.id}`)?.value || '';
          tableData.push([question.content, value]);
        });
        
        // Ajouter le tableau au PDF
        (doc as any).autoTable({
          startY: yPosition,
          head: [['Question', 'Évaluation']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] },
          margin: { top: 10 }
        });
        
        // Mettre à jour la position Y pour la prochaine section
        yPosition = (doc as any).lastAutoTable.finalY + 15;
      });
    }
    
    // Ajouter un pied de page
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} sur ${pageCount}`, 14, doc.internal.pageSize.height - 10);
      doc.text(`Évaluation générée le ${new Date().toLocaleString()}`, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, { align: 'right' });
    }
    
    // Télécharger le PDF
    doc.save(`evaluation_${this.moduleName.replace(/\s+/g, '_')}.pdf`);
  }

  async onSubmit() {
    if (this.evaluationForm.valid) {
      this.isSubmitting = true;
      this.isGeneratingPDF = true;

      try {
        // Préparer les données d'évaluation
        const evaluationData = this.prepareEvaluationData();

        // Simuler un délai de traitement
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Générer et télécharger le PDF
        await this.pdfGenerator.generateEvaluationPDF(evaluationData);

        // Marquer l'évaluation comme soumise
        this.evaluationSubmitted = true;
        this.submissionData = evaluationData;

        // Afficher un message de succès
        this.successMessage = 'Votre évaluation a été enregistrée avec succès et téléchargée au format PDF.';
        this.isSubmitting = false;
        this.isGeneratingPDF = false;

        // Rediriger vers la page des modules après 3 secondes
        setTimeout(() => {
          this.router.navigate(['/student-area/modules']);
        }, 3000);

      } catch (error) {
        console.error('Erreur lors de la soumission:', error);
        this.errorMessage = 'Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.';
        this.isSubmitting = false;
        this.isGeneratingPDF = false;
      }
    } else {
      this.showValidationErrors = true;
      this.errorMessage = 'Veuillez répondre à toutes les questions obligatoires.';
    }
  }

  /**
   * Prépare les données d'évaluation pour la génération du PDF
   */
  private prepareEvaluationData(): EvaluationData {
    const formValues = this.evaluationForm.value;
    const responses: any[] = [];

    // Collecter toutes les réponses
    this.sections.forEach((section) => {
      section.questions.forEach((question) => {
        const fieldName = `question_${question.id}`; // Utiliser l'ID de la question
        const response = formValues[fieldName];

        if (response !== undefined && response !== null && response !== '') {
          // Déterminer le type de question basé sur les options
          const questionType = question.options === this.ratingOptions ? 'rating' : 'text';

          responses.push({
            questionId: `${question.id}`,
            question: question.content, // Utiliser 'content' au lieu de 'text'
            response: questionType === 'rating' ? parseInt(response.charAt(0)) : response, // Extraire le chiffre du rating
            type: questionType
          });
        }
      });
    });

    // Calculer la note globale (moyenne des ratings)
    const ratingResponses = responses.filter(r => r.type === 'rating');
    const overallRating = ratingResponses.length > 0
      ? ratingResponses.reduce((sum, r) => sum + r.response, 0) / ratingResponses.length
      : 0;

    // Récupérer les commentaires
    const comments = formValues['comments'] || '';

    return {
      studentName: 'Amal Taibi Immrani', // À récupérer depuis le service d'authentification
      studentId: 'ETU2024001', // À récupérer depuis le service d'authentification
      moduleInfo: {
        name: this.moduleInfo?.name || this.moduleName,
        code: this.moduleInfo?.code || `MOD${this.moduleId}`,
        filiere: this.moduleInfo?.filiere || 'Informatique',
        credits: this.moduleInfo?.credits || 6,
        description: this.moduleInfo?.description || 'Module d\'enseignement'
      },
      evaluationDate: new Date(),
      responses: responses,
      overallRating: Math.round(overallRating * 10) / 10,
      comments: comments,
      submissionTimestamp: new Date()
    };
  }

  /**
   * Télécharge à nouveau le PDF (si l'évaluation a déjà été soumise)
   */
  async downloadPDFAgain(): Promise<void> {
    if (this.submissionData) {
      this.isGeneratingPDF = true;
      try {
        await this.pdfGenerator.generateEvaluationPDF(this.submissionData);
      } catch (error) {
        console.error('Erreur lors du téléchargement du PDF:', error);
        this.errorMessage = 'Erreur lors du téléchargement du PDF.';
      } finally {
        this.isGeneratingPDF = false;
      }
    }
  }
}




