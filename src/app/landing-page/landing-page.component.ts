import { Component, OnInit, HostListener, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule], // Ajout des imports nécessaires
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('statsSection', { static: false }) statsSection!: ElementRef;
  
  contactForm: FormGroup;
  isSubmitting = false;
  isSubmitted = false;
  
  stats = [
    { value: 150, suffix: '+', label: 'Écoles Partenaires', currentValue: 0 },
    { value: 50, suffix: 'K+', label: 'Étudiants Évalués', currentValue: 0 },
    { value: 95, suffix: '%', label: 'Taux de Satisfaction', currentValue: 0 },
    { value: 25, suffix: '+', label: 'Pays Couverts', currentValue: 0 }
  ];

  features = [
    {
      icon: '📊',
      title: 'Analyse Statistique',
      description: 'Évaluez la performance de vos programmes avec des outils d\'analyse statistique avancés et des tableaux de bord interactifs.'
    },
    {
      icon: '🎯',
      title: 'Objectifs Pédagogiques',
      description: 'Mesurez l\'atteinte des objectifs d\'apprentissage et identifiez les axes d\'amélioration pour vos cursus d\'ingénierie.'
    },
    {
      icon: '👥',
      title: 'Feedback Étudiant',
      description: 'Collectez et analysez les retours des étudiants pour améliorer continuellement la qualité de l\'enseignement.'
    },
    {
      icon: '📈',
      title: 'Rapports Détaillés',
      description: 'Générez des rapports complets avec des recommandations personnalisées pour l\'amélioration de vos programmes.'
    },
    {
      icon: '🔄',
      title: 'Suivi Continu',
      description: 'Monitorer l\'évolution de vos programmes dans le temps avec des indicateurs de performance clés.'
    },
    {
      icon: '🌐',
      title: 'Benchmarking',
      description: 'Comparez vos performances avec les standards internationaux et les meilleures pratiques du secteur.'
    }
  ];

  navLinks = [
    { href: '#accueil', label: 'Accueil' },
    { href: '#fonctionnalites', label: 'Fonctionnalités' },
    { href: '#apropos', label: 'À propos' },
    { href: '#contact', label: 'Contact' }
  ];

  isHeaderScrolled = false;
  private observer!: IntersectionObserver;
  private statsObserver!: IntersectionObserver;
  private countersAnimated = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.contactForm = this.fb.group({
      nom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      programme: [''],
      message: ['']
    });
  }

  ngOnInit(): void {
    this.setupScrollAnimations();
  }

  ngAfterViewInit(): void {
    this.setupStatsObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.statsObserver) {
      this.statsObserver.disconnect();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.isHeaderScrolled = window.scrollY > 100;
  }

  private setupScrollAnimations(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    setTimeout(() => {
      document.querySelectorAll('.fade-in').forEach(el => {
        this.observer.observe(el);
      });
    }, 100);
  }

  private setupStatsObserver(): void {
    if (this.statsSection) {
      this.statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.countersAnimated) {
            this.animateCounters();
            this.countersAnimated = true;
          }
        });
      });
      this.statsObserver.observe(this.statsSection.nativeElement);
    }
  }

  private animateCounters(): void {
    this.stats.forEach((stat, index) => {
      this.animateCounter(index, stat.value);
    });
  }

  private animateCounter(index: number, target: number): void {
    let count = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        this.stats[index].currentValue = target;
        clearInterval(timer);
      } else {
        this.stats[index].currentValue = Math.floor(count);
      }
    }, 20);
  }

  scrollToSection(href: string, event: Event): void {
    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Fonction pour rediriger vers la page de connexion
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      // Simulation d'envoi d'email
      setTimeout(() => {
        this.isSubmitting = false;
        this.isSubmitted = true;
        
        setTimeout(() => {
          this.isSubmitted = false;
          this.contactForm.reset();
        }, 3000);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  getSubmitButtonText(): string {
    if (this.isSubmitting) return 'Envoi en cours...';
    if (this.isSubmitted) return 'Message Envoyé !';
    return 'Demander une Démonstration';
  }

  getSubmitButtonClass(): string {
    if (this.isSubmitted) return 'submit-btn success';
    return 'submit-btn';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.touched && field.errors);
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field && field.touched && field.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} est requis`;
      }
      if (field.errors['email']) {
        return 'Format d\'email invalide';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nom: 'Le nom de l\'école',
      email: 'L\'email',
      telephone: 'Le téléphone',
      programme: 'Le programme',
      message: 'Le message'
    };
    return labels[fieldName] || fieldName;
  }
}