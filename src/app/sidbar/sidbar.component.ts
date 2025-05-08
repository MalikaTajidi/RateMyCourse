import {Component, HostListener} from '@angular/core';
import {SharedServiceService} from '../service/shared-service.service';

@Component({
  selector: 'app-sidbar',
  standalone: false,
  templateUrl: './sidbar.component.html',
  styleUrl: './sidbar.component.css'
})
export class SidbarComponent {



  activeRoute = '/dashboard'; // valeur par défaut
  isSidebarHidden = false;


  constructor(private sharedService: SharedServiceService ) {
  }


  // Pour vérifier au premier chargement aussi
  ngOnInit() {
    this.onResize();
  }



  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
    this.sharedService.changeValue(this.isSidebarHidden);
  }


  setActive(route: string) {
    this.activeRoute = route;
  }


  // Écouter les changements de taille d'écran
  @HostListener('window:resize', [])
  onResize() {
    if (window.innerWidth < 600) { // par exemple moins de 768px
      this.isSidebarHidden = true;
      this.sharedService.changeValue(this.isSidebarHidden);
    } else {
      this.isSidebarHidden = false;
      this.sharedService.changeValue(this.isSidebarHidden);
    }
  }






}
