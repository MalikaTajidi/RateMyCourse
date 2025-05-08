import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SidbarComponent} from './sidbar/sidbar.component';
import {SharedServiceService} from './service/shared-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements  OnInit {



  title = 'oo';
  hidden !: boolean ;

  constructor(private sharedService: SharedServiceService) { }








  ngOnInit() {
    this.sharedService.currentValue.subscribe(value => {
      this.hidden = value;
    });
  }






}
