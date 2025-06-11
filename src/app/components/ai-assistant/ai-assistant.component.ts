import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedServiceService, SidebarState } from '../../service/shared-service.service';
import { AiAssistantService, ChatMessage } from '../../services/ai-assistant.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-assistant" [ngClass]="assistantClasses">
      <!-- Icône flottante du mساعد -->
      <button 
        class="ai-assistant-icon"
        [class.mobile]="sidebarState.isMobile"
        [class.sidebar-collapsed]="sidebarState.isCollapsed"
        (click)="toggleChat()"
        [attr.aria-label]="isOpen ? 'Fermer assistant' : 'Ouvrir assistant'">
        <i class="fas fa-robot"></i>
        <span class="pulse-ring" *ngIf="hasNewSuggestions"></span>
      </button>

      <!-- Fenêtre de chat -->
      <div 
        class="chat-window" 
        [class.open]="isOpen"
        [class.mobile]="sidebarState.isMobile">
        
        <div class="chat-header">
          <h3>Assistant Académique</h3>
          <button class="close-btn" (click)="closeChat()">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="chat-messages" #messagesContainer>
          <div 
            *ngFor="let message of messages" 
            class="message"
            [class.user]="message.type === 'user'"
            [class.assistant]="message.type === 'assistant'">
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ message.timestamp | date:'HH:mm' }}</div>
          </div>
        </div>

        <div class="chat-input">
          <input 
            type="text" 
            [(ngModel)]="currentMessage"
            (keyup.enter)="sendMessage()"
            placeholder="Posez votre question..."
            #messageInput>
          <button (click)="sendMessage()" [disabled]="!currentMessage.trim()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>

        <!-- Suggestions rapides -->
        <div class="quick-suggestions" *ngIf="quickSuggestions.length > 0">
          <button 
            *ngFor="let suggestion of quickSuggestions"
            class="suggestion-btn"
            (click)="selectSuggestion(suggestion)">
            {{ suggestion }}
          </button>
        </div>
      </div>

      <!-- Overlay pour mobile -->
      <div 
        class="chat-overlay" 
        *ngIf="isOpen && sidebarState.isMobile"
        (click)="closeChat()">
      </div>
    </div>
  `,
  styleUrls: ['./ai-assistant.component.css']
})
export class AiAssistantComponent implements OnInit, OnDestroy, AfterViewInit {
  // ViewChild pour accéder aux éléments du DOM
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  // État du composant
  isOpen = false;
  hasNewSuggestions = false;
  currentMessage = '';

  // État du sidebar
  sidebarState: SidebarState;
  private destroy$ = new Subject<void>();

  // Messages de chat (depuis le service)
  messages: ChatMessage[] = [];

  // Suggestions rapides (depuis le service)
  quickSuggestions: string[] = [];

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
        this.adjustPositionForSidebar(state);
      });

    // S'abonner aux messages du service AI
    this.aiService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe((messages: ChatMessage[]) => {
        this.messages = messages;
        this.scrollToBottom();
      });

    // S'abonner aux suggestions du service AI
    this.aiService.suggestions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((suggestions: string[]) => {
        this.quickSuggestions = suggestions;
      });

    // Simuler des nouvelles suggestions après 5 secondes
    setTimeout(() => {
      this.hasNewSuggestions = true;
    }, 5000);
  }

  ngAfterViewInit(): void {
    // Initialisation après que la vue soit prête
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Ajuste la position de l'assistant selon l'état du sidebar
   */
  private adjustPositionForSidebar(state: SidebarState): void {
    // La logique d'ajustement sera gérée par CSS avec les classes
    console.log('AI Assistant: Adjusting for sidebar state', state);
  }

  /**
   * Bascule l'état ouvert/fermé du chat
   */
  toggleChat(): void {
    this.isOpen = !this.isOpen;
    this.hasNewSuggestions = false;

    if (this.isOpen) {
      // Focus sur l'input quand on ouvre
      setTimeout(() => {
        if (this.messageInput) {
          this.messageInput.nativeElement.focus();
        }
      }, 100);
    }
  }

  /**
   * Ferme le chat
   */
  closeChat(): void {
    this.isOpen = false;
  }

  /**
   * Envoie un message
   */
  sendMessage(): void {
    if (!this.currentMessage.trim()) return;

    // Utiliser le service AI pour traiter le message
    this.aiService.processUserMessage(this.currentMessage);

    this.currentMessage = '';
  }

  /**
   * Sélectionne une suggestion rapide
   */
  selectSuggestion(suggestion: string): void {
    this.currentMessage = suggestion;
    this.sendMessage();
  }





  /**
   * Fait défiler vers le bas des messages
   */
  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  /**
   * Getter pour les classes CSS de l'assistant
   */
  get assistantClasses(): string[] {
    const classes = ['ai-assistant'];
    
    if (this.sidebarState.isMobile) {
      classes.push('mobile-mode');
    } else {
      classes.push(this.sidebarState.isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded');
    }
    
    if (this.isOpen) {
      classes.push('chat-open');
    }
    
    return classes;
  }
}
