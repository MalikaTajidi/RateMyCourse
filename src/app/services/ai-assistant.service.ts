import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface StudentData {
  name: string;
  level: string;
  modules: Array<{
    id: string;
    name: string;
    status: 'terminé' | 'en-cours' | 'non-commencé';
    grade?: number;
    credits: number;
  }>;
  exams: Array<{
    id: string;
    module: string;
    date: Date;
    type: string;
  }>;
  averageGrade: number;
  totalCredits: number;
  completedCredits: number;
}

@Injectable({
  providedIn: 'root'
})
export class AiAssistantService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private suggestionsSubject = new BehaviorSubject<string[]>([
    'Quels sont mes prochains examens ?',
    'Comment améliorer ma moyenne ?',
    'Aide pour le module en cours',
    'Résumé de mes performances'
  ]);
  public suggestions$ = this.suggestionsSubject.asObservable();

  // Données simulées de l'étudiant
  private studentData: StudentData = {
    name: 'Amal Taibi Immrani',
    level: 'Étudiant 4ème année',
    modules: [
      { id: '1', name: 'Programmation Web', status: 'en-cours', grade: 17.5, credits: 6 },
      { id: '2', name: 'Base de Données', status: 'en-cours', grade: 14.2, credits: 5 },
      { id: '3', name: 'Développement Mobile', status: 'terminé', grade: 16.8, credits: 6 },
      { id: '4', name: 'Mathématiques', status: 'terminé', grade: 12.8, credits: 4 },
      { id: '5', name: 'Réseaux', status: 'terminé', grade: 15.5, credits: 5 },
      { id: '6', name: 'Sécurité Informatique', status: 'terminé', grade: 16.2, credits: 4 },
      { id: '7', name: 'Intelligence Artificielle', status: 'non-commencé', credits: 6 },
      { id: '8', name: 'Projet de Fin d\'Études', status: 'non-commencé', credits: 8 }
    ],
    exams: [
      { id: '1', module: 'Programmation Web', date: new Date('2024-12-15'), type: 'Examen final' },
      { id: '2', module: 'Base de Données', date: new Date('2024-12-20'), type: 'Contrôle continu' },
      { id: '3', module: 'Intelligence Artificielle', date: new Date('2025-01-10'), type: 'Examen de rattrapage' }
    ],
    averageGrade: 15.2,
    totalCredits: 44,
    completedCredits: 30
  };

  constructor() {
    // Message de bienvenue initial
    this.addMessage({
      id: this.generateId(),
      type: 'assistant',
      content: 'Bonjour ! Je suis votre assistant académique intelligent. Je peux vous aider avec vos modules, vos notes, votre planning et vous donner des conseils personnalisés. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    });
  }

  /**
   * Ajoute un message à la conversation
   */
  addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  /**
   * Traite un message de l'utilisateur et génère une réponse
   */
  processUserMessage(content: string): void {
    // Ajouter le message de l'utilisateur
    const userMessage: ChatMessage = {
      id: this.generateId(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    this.addMessage(userMessage);

    // Simuler un délai de traitement
    setTimeout(() => {
      const response = this.generateResponse(content);
      const assistantMessage: ChatMessage = {
        id: this.generateId(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };
      this.addMessage(assistantMessage);

      // Mettre à jour les suggestions
      this.updateSuggestions(content);
    }, 1500);
  }

  /**
   * Génère une réponse intelligente basée sur le message de l'utilisateur
   */
  private generateResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();

    // Analyse des examens
    if (message.includes('examen') || message.includes('test') || message.includes('contrôle')) {
      const upcomingExams = this.studentData.exams
        .filter(exam => exam.date > new Date())
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      if (upcomingExams.length > 0) {
        const nextExam = upcomingExams[0];
        const daysUntil = Math.ceil((nextExam.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return `Votre prochain examen est "${nextExam.type}" pour le module "${nextExam.module}" le ${nextExam.date.toLocaleDateString('fr-FR')} (dans ${daysUntil} jours). ${upcomingExams.length > 1 ? `Vous avez ${upcomingExams.length} examens à venir.` : ''} Voulez-vous que je vous aide à planifier vos révisions ?`;
      } else {
        return 'Vous n\'avez aucun examen programmé pour le moment. C\'est le moment idéal pour vous avancer sur vos projets !';
      }
    }

    // Analyse des moyennes et notes
    if (message.includes('moyenne') || message.includes('note') || message.includes('résultat')) {
      const completedModules = this.studentData.modules.filter(m => m.status === 'terminé' && m.grade);
      const bestModule = completedModules.reduce((best, current) => 
        (current.grade || 0) > (best.grade || 0) ? current : best
      );
      const worstModule = completedModules.reduce((worst, current) => 
        (current.grade || 0) < (worst.grade || 0) ? current : worst
      );

      return `Votre moyenne générale actuelle est de ${this.studentData.averageGrade}/20 (très bien !). 
      📈 Votre meilleur résultat : "${bestModule.name}" (${bestModule.grade}/20)
      📉 Module à améliorer : "${worstModule.name}" (${worstModule.grade}/20)
      
      Vous avez validé ${this.studentData.completedCredits}/${this.studentData.totalCredits} crédits. Souhaitez-vous des conseils pour améliorer vos résultats ?`;
    }

    // Analyse des modules
    if (message.includes('module') || message.includes('cours') || message.includes('matière')) {
      const inProgress = this.studentData.modules.filter(m => m.status === 'en-cours');
      const completed = this.studentData.modules.filter(m => m.status === 'terminé');
      const notStarted = this.studentData.modules.filter(m => m.status === 'non-commencé');

      return `📚 État de vos modules :
      ✅ Terminés : ${completed.length} modules (${completed.reduce((sum, m) => sum + m.credits, 0)} crédits)
      🔄 En cours : ${inProgress.length} modules (${inProgress.map(m => m.name).join(', ')})
      ⏳ À venir : ${notStarted.length} modules
      
      Voulez-vous voir le détail d'un module spécifique ?`;
    }

    // Conseils et aide
    if (message.includes('aide') || message.includes('conseil') || message.includes('comment')) {
      return `🎯 Je peux vous aider de plusieurs façons :
      
      📊 **Suivi académique** : Notes, moyennes, progression
      📅 **Planning** : Examens, emploi du temps, deadlines
      💡 **Conseils personnalisés** : Méthodes d'étude, organisation
      🎓 **Orientation** : Choix de modules, parcours
      
      Que souhaitez-vous approfondir ?`;
    }

    // Planning et emploi du temps
    if (message.includes('planning') || message.includes('emploi') || message.includes('horaire')) {
      return `📅 Votre emploi du temps cette semaine :
      
      **Lundi** : Programmation Web (9h-12h) - Amphi A
      **Mercredi** : Base de Données (14h-17h) - Salle Info 2
      **Vendredi** : Projet tutoré (9h-12h) - Lab Projet
      
      💡 Conseil : Préparez vos TP à l'avance pour optimiser votre temps en cours !`;
    }

    // Salutations
    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
      const timeOfDay = new Date().getHours();
      const greeting = timeOfDay < 12 ? 'Bonjour' : timeOfDay < 18 ? 'Bon après-midi' : 'Bonsoir';
      return `${greeting} ${this.studentData.name.split(' ')[0]} ! 😊 Ravi de vous revoir. Comment puis-je vous accompagner dans vos études aujourd'hui ?`;
    }

    // Remerciements
    if (message.includes('merci') || message.includes('thanks')) {
      return 'De rien ! 😊 Je suis toujours là pour vous accompagner dans votre réussite académique. N\'hésitez pas si vous avez d\'autres questions !';
    }

    // Réponse par défaut avec suggestions contextuelles
    return `C'est une question intéressante ! 🤔 
    
    Pour mieux vous aider, pouvez-vous préciser ce que vous cherchez ? Je peux vous renseigner sur :
    • Vos modules et notes
    • Votre planning et examens
    • Des conseils d'étude personnalisés
    • Votre progression académique`;
  }

  /**
   * Met à jour les suggestions rapides basées sur la conversation
   */
  private updateSuggestions(userMessage: string): void {
    const message = userMessage.toLowerCase();
    let newSuggestions: string[] = [];

    if (message.includes('examen')) {
      newSuggestions = [
        'Planning de révision pour mes examens',
        'Conseils pour bien réviser',
        'Mes notes des années précédentes',
        'Ressources d\'étude recommandées'
      ];
    } else if (message.includes('moyenne')) {
      newSuggestions = [
        'Comment améliorer ma moyenne ?',
        'Détail de mes notes par module',
        'Comparaison avec la promotion',
        'Objectifs pour le prochain semestre'
      ];
    } else if (message.includes('module')) {
      newSuggestions = [
        'Progression dans mes modules',
        'Modules à rattraper',
        'Évaluations en attente',
        'Ressources pour mes modules'
      ];
    } else {
      newSuggestions = [
        'Quels sont mes prochains examens ?',
        'Comment améliorer ma moyenne ?',
        'Aide pour le module en cours',
        'Résumé de mes performances'
      ];
    }

    this.suggestionsSubject.next(newSuggestions);
  }

  /**
   * Obtient les données de l'étudiant
   */
  getStudentData(): StudentData {
    return this.studentData;
  }

  /**
   * Efface l'historique des messages
   */
  clearMessages(): void {
    this.messagesSubject.next([]);
  }

  /**
   * Génère un ID unique pour les messages
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
