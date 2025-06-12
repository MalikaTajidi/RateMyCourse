import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService2Service {

  private myVariable = new BehaviorSubject<boolean>(false); // ou le type que tu veux (string, number, etc.)
  currentValue = this.myVariable.asObservable();

  constructor() { }


  changeValue(newValue: boolean) {
    this.myVariable.next(newValue);
  }

}
