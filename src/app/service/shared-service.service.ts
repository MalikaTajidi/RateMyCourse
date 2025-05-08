import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root' // cette service sera declarer dans la racine du projet , je nesuis pas besoin de declarer dans le app.module.ts
})

export class SharedServiceService {


  private myVariable = new BehaviorSubject<boolean>(false); // ou le type que tu veux (string, number, etc.)
  currentValue = this.myVariable.asObservable();

  constructor() { }


  changeValue(newValue: boolean) {
    this.myVariable.next(newValue);
  }




}
