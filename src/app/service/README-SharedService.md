# SharedServiceService - Service de Gestion du Sidebar Étudiant

## Vue d'ensemble

Le `SharedServiceService` est un service Angular centralisé qui gère l'état du sidebar étudiant et permet aux composants de s'adapter automatiquement aux changements d'ouverture/fermeture du sidebar.

## Fonctionnalités

### 🎯 **Gestion d'État Centralisée**
- État complet du sidebar (collapsed, mobile, mobile-open)
- Synchronisation automatique entre tous les composants
- Persistance de l'état dans localStorage

### 📱 **Support Responsive**
- Détection automatique des changements de taille d'écran
- Gestion séparée des modes desktop et mobile
- Adaptation automatique des marges et layouts

### 🔄 **Observables Réactifs**
- BehaviorSubjects pour un état toujours à jour
- Observables séparés pour différents cas d'usage
- Gestion automatique de la désinscription

## Interface SidebarState

```typescript
interface SidebarState {
  isCollapsed: boolean;    // Sidebar réduit (desktop)
  isMobile: boolean;       // Mode mobile détecté
  isMobileOpen: boolean;   // Sidebar mobile ouvert
  width: number;           // Largeur normale (288px)
  collapsedWidth: number;  // Largeur réduite (64px)
}
```

## Utilisation dans les Composants

### 1. **Import et Injection**

```typescript
import { SharedServiceService, SidebarState } from '../service/shared-service.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class MonComposant implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  sidebarState: SidebarState;

  constructor(private sharedService: SharedServiceService) {
    this.sidebarState = this.sharedService.getCurrentState();
  }
}
```

### 2. **Écoute des Changements d'État**

```typescript
ngOnInit(): void {
  // S'abonner aux changements d'état du sidebar
  this.sharedService.sidebarState$
    .pipe(takeUntil(this.destroy$))
    .subscribe((state: SidebarState) => {
      this.sidebarState = state;
      this.onSidebarStateChange(state);
    });
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

private onSidebarStateChange(state: SidebarState): void {
  // Logique spécifique au composant
  console.log('Sidebar state changed:', state);
}
```

### 3. **Utilisation dans les Templates**

```html
<!-- Appliquer les classes CSS automatiquement -->
<div class="container" [ngClass]="sharedService.getContentClasses()">
  <!-- Contenu qui s'adapte au sidebar -->
</div>

<!-- Affichage conditionnel basé sur l'état -->
<div *ngIf="!sidebarState.isMobile" class="desktop-only">
  Contenu desktop uniquement
</div>

<div *ngIf="sidebarState.isMobile" class="mobile-only">
  Contenu mobile uniquement
</div>
```

## Méthodes Principales

### **Contrôle du Sidebar**

```typescript
// Basculer l'état collapsed (desktop uniquement)
sharedService.toggleSidebar();

// Définir l'état collapsed
sharedService.setSidebarCollapsed(true);

// Contrôle mobile
sharedService.toggleMobileSidebar();
sharedService.openMobileSidebar();
sharedService.closeMobileSidebar();
```

### **Obtenir des Informations**

```typescript
// État actuel complet
const state = sharedService.getCurrentState();

// Marge gauche pour le contenu principal
const marginLeft = sharedService.getContentMarginLeft();

// Classes CSS pour le contenu
const contentClasses = sharedService.getContentClasses();

// Classes CSS pour le sidebar
const sidebarClasses = sharedService.getSidebarClasses();
```

## Adaptation CSS Automatique

Le service fournit des classes CSS qui s'appliquent automatiquement :

### **Classes pour le Contenu Principal**
- `sidebar-expanded` : Sidebar ouvert (desktop)
- `sidebar-collapsed` : Sidebar fermé (desktop)  
- `mobile-mode` : Mode mobile

### **Classes pour le Sidebar**
- `sidebar` : Classe de base
- `collapsed` : Sidebar réduit (desktop)
- `mobile` : Mode mobile
- `mobile-open` : Sidebar mobile ouvert

## Exemple Complet d'Utilisation

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedServiceService, SidebarState } from '../service/shared-service.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mon-composant',
  template: `
    <div class="container" [ngClass]="containerClasses">
      <h1>Mon Composant</h1>
      <p>Sidebar état: {{ sidebarState.isCollapsed ? 'Fermé' : 'Ouvert' }}</p>
      <p>Mode: {{ sidebarState.isMobile ? 'Mobile' : 'Desktop' }}</p>
    </div>
  `
})
export class MonComposant implements OnInit, OnDestroy {
  sidebarState: SidebarState;
  private destroy$ = new Subject<void>();

  constructor(private sharedService: SharedServiceService) {
    this.sidebarState = this.sharedService.getCurrentState();
  }

  ngOnInit(): void {
    this.sharedService.sidebarState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: SidebarState) => {
        this.sidebarState = state;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get containerClasses(): string[] {
    return this.sharedService.getContentClasses();
  }
}
```

## Avantages

✅ **Centralisation** : Un seul point de vérité pour l'état du sidebar
✅ **Réactivité** : Mise à jour automatique de tous les composants
✅ **Performance** : Gestion optimisée des observables
✅ **Persistance** : Sauvegarde automatique dans localStorage
✅ **Responsive** : Adaptation automatique mobile/desktop
✅ **Type Safety** : Interface TypeScript complète
✅ **Facilité d'usage** : API simple et intuitive

## Migration depuis l'Ancien Service

L'ancien service reste compatible :

```typescript
// Ancienne méthode (toujours supportée)
sharedService.changeValue(true);
sharedService.currentValue.subscribe(collapsed => {
  // ...
});

// Nouvelle méthode (recommandée)
sharedService.setSidebarCollapsed(true);
sharedService.sidebarState$.subscribe(state => {
  // ...
});
```
