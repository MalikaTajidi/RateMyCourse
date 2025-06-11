import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedServiceService, SidebarState } from '../../service/shared-service.service';
import { AiAssistantService } from '../../services/ai-assistant.service';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface SmartNotification {
  id: string;
  type: 'exam' | 'grade' | 'reminder' | 'achievement' | 'tip';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  actionText?: string;
  actionCallback?: () => void;
}

@Component({
  selector: 'app-smart-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="smart-notifications" [ngClass]="notificationClasses">
      <!-- Icône de notification -->
      <button 
        class="notification-icon"
        [class.has-unread]="hasUnreadNotifications"
        (click)="toggleNotifications()"
        [attr.aria-label]="isOpen ? 'Fermer notifications' : 'Ouvrir notifications'">
        <i class="fas fa-bell"></i>
        <span class="notification-badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
      </button>

      <!-- Panel des notifications -->
      <div 
        class="notifications-panel" 
        [class.open]="isOpen"
        [class.mobile]="sidebarState.isMobile">
        
        <div class="notifications-header">
          <h3>Notifications Intelligentes</h3>
          <div class="header-actions">
            <button class="mark-all-read" (click)="markAllAsRead()" *ngIf="hasUnreadNotifications">
              <i class="fas fa-check-double"></i>
            </button>
            <button class="close-btn" (click)="closeNotifications()">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div class="notifications-list" *ngIf="notifications.length > 0; else noNotifications">
          <div 
            *ngFor="let notification of notifications" 
            class="notification-item"
            [class.unread]="!notification.isRead"
            [class.priority-high]="notification.priority === 'high'"
            [class.priority-medium]="notification.priority === 'medium'"
            (click)="markAsRead(notification)">
            
            <div class="notification-icon-type">
              <i [class]="getNotificationIcon(notification.type)"></i>
            </div>
            
            <div class="notification-content">
              <h4>{{ notification.title }}</h4>
              <p>{{ notification.message }}</p>
              <span class="notification-time">{{ getTimeAgo(notification.timestamp) }}</span>
            </div>
            
            <button 
              *ngIf="notification.actionText && notification.actionCallback"
              class="notification-action"
              (click)="executeAction(notification, $event)">
              {{ notification.actionText }}
            </button>
          </div>
        </div>

        <ng-template #noNotifications>
          <div class="no-notifications">
            <i class="fas fa-bell-slash"></i>
            <p>Aucune notification pour le moment</p>
          </div>
        </ng-template>
      </div>

      <!-- Overlay pour mobile -->
      <div 
        class="notifications-overlay" 
        *ngIf="isOpen && sidebarState.isMobile"
        (click)="closeNotifications()">
      </div>
    </div>
  `,
  styleUrls: ['./smart-notifications.component.css']
})
export class SmartNotificationsComponent implements OnInit, OnDestroy {
  // État du composant
  isOpen = false;
  notifications: SmartNotification[] = [];
  
  // État du sidebar
  sidebarState: SidebarState;
  private destroy$ = new Subject<void>();

  constructor(
    private sharedService: SharedServiceService,
    private aiService: AiAssistantService
  ) {
    this.sidebarState = this.sharedService.getCurrentState();
  }

  ngOnInit(): void {
    // S'abonner aux changements d'état du sidebar
    this.sharedService.sidebarState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: SidebarState) => {
        this.sidebarState = state;
      });

    // Générer des notifications intelligentes
    this.generateSmartNotifications();

    // Mettre à jour les notifications périodiquement
    timer(0, 300000) // Toutes les 5 minutes
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateNotifications();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Bascule l'état ouvert/fermé des notifications
   */
  toggleNotifications(): void {
    this.isOpen = !this.isOpen;
  }

  /**
   * Ferme le panel des notifications
   */
  closeNotifications(): void {
    this.isOpen = false;
  }

  /**
   * Marque une notification comme lue
   */
  markAsRead(notification: SmartNotification): void {
    notification.isRead = true;
  }

  /**
   * Marque toutes les notifications comme lues
   */
  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
  }

  /**
   * Exécute l'action d'une notification
   */
  executeAction(notification: SmartNotification, event: Event): void {
    event.stopPropagation();
    if (notification.actionCallback) {
      notification.actionCallback();
    }
    this.markAsRead(notification);
  }

  /**
   * Obtient l'icône pour un type de notification
   */
  getNotificationIcon(type: string): string {
    const icons = {
      exam: 'fas fa-graduation-cap',
      grade: 'fas fa-star',
      reminder: 'fas fa-clock',
      achievement: 'fas fa-trophy',
      tip: 'fas fa-lightbulb'
    };
    return icons[type as keyof typeof icons] || 'fas fa-info-circle';
  }

  /**
   * Calcule le temps écoulé depuis une notification
   */
  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'À l\'instant';
  }

  /**
   * Génère des notifications intelligentes basées sur les données de l'étudiant
   */
  private generateSmartNotifications(): void {
    const studentData = this.aiService.getStudentData();
    
    // Notification d'examen proche
    const upcomingExams = studentData.exams.filter(exam => {
      const daysUntil = Math.ceil((exam.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil > 0 && daysUntil <= 7;
    });

    upcomingExams.forEach(exam => {
      const daysUntil = Math.ceil((exam.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      this.addNotification({
        type: 'exam',
        title: 'Examen Proche',
        message: `${exam.type} de ${exam.module} dans ${daysUntil} jour${daysUntil > 1 ? 's' : ''}`,
        priority: daysUntil <= 3 ? 'high' : 'medium',
        actionText: 'Réviser',
        actionCallback: () => this.openStudyPlan(exam.module)
      });
    });

    // Notification de performance
    if (studentData.averageGrade >= 16) {
      this.addNotification({
        type: 'achievement',
        title: 'Excellente Performance !',
        message: `Votre moyenne de ${studentData.averageGrade}/20 est remarquable. Continuez ainsi !`,
        priority: 'medium'
      });
    }

    // Conseil d'étude personnalisé
    const weakModule = studentData.modules
      .filter(m => m.grade && m.grade < 14)
      .sort((a, b) => (a.grade || 0) - (b.grade || 0))[0];

    if (weakModule) {
      this.addNotification({
        type: 'tip',
        title: 'Conseil d\'Étude',
        message: `Concentrez-vous sur "${weakModule.name}" pour améliorer votre moyenne`,
        priority: 'low',
        actionText: 'Voir conseils',
        actionCallback: () => this.showStudyTips(weakModule.name)
      });
    }

    // Rappel d'évaluation
    const modulesPendingEvaluation = studentData.modules.filter(m => m.status === 'terminé' && !m.grade);
    if (modulesPendingEvaluation.length > 0) {
      this.addNotification({
        type: 'reminder',
        title: 'Évaluation en Attente',
        message: `${modulesPendingEvaluation.length} module${modulesPendingEvaluation.length > 1 ? 's' : ''} à évaluer`,
        priority: 'medium',
        actionText: 'Évaluer',
        actionCallback: () => this.openEvaluation()
      });
    }
  }

  /**
   * Ajoute une nouvelle notification
   */
  private addNotification(notification: Omit<SmartNotification, 'id' | 'timestamp' | 'isRead'>): void {
    const newNotification: SmartNotification = {
      id: this.generateId(),
      timestamp: new Date(),
      isRead: false,
      ...notification
    };
    
    this.notifications.unshift(newNotification);
    
    // Limiter à 10 notifications maximum
    if (this.notifications.length > 10) {
      this.notifications = this.notifications.slice(0, 10);
    }
  }

  /**
   * Met à jour les notifications
   */
  private updateNotifications(): void {
    // Supprimer les anciennes notifications (plus de 7 jours)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    this.notifications = this.notifications.filter(n => n.timestamp > weekAgo);
  }

  /**
   * Actions des notifications
   */
  private openStudyPlan(module: string): void {
    console.log(`Ouvrir plan d'étude pour ${module}`);
    // Ici, vous pourriez naviguer vers une page de plan d'étude
  }

  private showStudyTips(module: string): void {
    console.log(`Afficher conseils pour ${module}`);
    // Ici, vous pourriez ouvrir l'AI Assistant avec des conseils spécifiques
  }

  private openEvaluation(): void {
    console.log('Ouvrir page d\'évaluation');
    // Ici, vous pourriez naviguer vers la page d'évaluation
  }

  /**
   * Génère un ID unique
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Getters pour le template
   */
  get hasUnreadNotifications(): boolean {
    return this.notifications.some(n => !n.isRead);
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  get notificationClasses(): string[] {
    const classes = ['smart-notifications'];
    
    if (this.sidebarState.isMobile) {
      classes.push('mobile-mode');
    } else {
      classes.push(this.sidebarState.isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded');
    }
    
    if (this.isOpen) {
      classes.push('notifications-open');
    }
    
    return classes;
  }
}
