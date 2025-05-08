import {Component, OnInit} from '@angular/core';
import {SharedServiceService} from '../service/shared-service.service';

@Component({
  selector: 'app-dashbord',
  standalone: false,
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css'
})
export class DashbordComponent implements OnInit {



  hidden = false;  // important d'initialiser hidden

  constructor(private sharedService: SharedServiceService) { }

  ngOnInit(): void {
    // écouter les changements de la sidebar
    this.sharedService.currentValue.subscribe(value => {
      this.hidden = value;
    });
  }


}
