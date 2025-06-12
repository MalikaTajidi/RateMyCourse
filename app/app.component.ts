import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SidbarComponent} from './sidbar/sidbar.component';
import {SharedServiceService} from './service/shared-service.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import { ThemeService, Theme } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'RateMyCourse';
  hidden !: boolean;
  isPublicPage = true; // Set to true for the landing page
  currentTheme: Theme;
  
  constructor(
    private sharedService: SharedServiceService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  ngOnInit() {
    this.sharedService.currentValue.subscribe(value => {
      this.hidden = value;
    });
    
    // Surveiller les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Définir les routes publiques (sans sidebar)
      const publicRoutes = ['/', '/login', '/forgot-password'];
      this.isPublicPage = publicRoutes.includes(event.url);
    });

    this.themeService.theme$.subscribe((theme: Theme) => {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
    });
  }
}
