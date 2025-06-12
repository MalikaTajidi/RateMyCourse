import { Component } from '@angular/core';
import {QuestionService} from '../service/question.service';
import {ActivatedRoute} from '@angular/router';
import {Formulaire} from '../model/formulaire';

@Component({
  selector: 'app-formulaire-detail',
  standalone: false,
  templateUrl: './formulaire-detail.component.html',
  styleUrl: './formulaire-detail.component.css'
})
export class FormulaireDetailComponent {

  formulaire: Formulaire | undefined;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = Number(params['id']);
      this.questionService.getFormulaireById(id).subscribe(formulaire => {
        this.formulaire = formulaire;
      });
    });
  }

}
