import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Formulaire} from '../model/formulaire';
import {QuestionService} from '../service/question.service';

@Component({
  selector: 'app-quest',
  standalone: false,
  templateUrl: './quest.component.html',
  styleUrl: './quest.component.css'
})
export class QuestComponent implements OnInit {
  errorMessage!: string;
  formulaires: Formulaire[] = [];
  currentPage: number = 0;
  pageSize: number = 5;
  numberPage: number = 0;
  currentAction: string = 'all';
  searchFormGroup!: FormGroup;

  selectedFormulaire: Formulaire | null = null;

  constructor(private questionService: QuestionService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    });

    this.handleGetFormulaires();
  }

  handleGetFormulaires(): void {
    this.questionService.getAllFormulaires().subscribe({
      next: (data) => {
        this.formulaires = data.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
        this.numberPage = Math.ceil(data.length / this.pageSize);
      },
      error: (err) => {
        this.errorMessage = "Erreur lors du chargement des formulaires.";
      }
    });
  }

  handleDeleteFormulaire(formulaire: Formulaire): void {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer ce formulaire ?");
    if (!confirmDelete) return;

    this.questionService.deleteFormulaire(formulaire.formulaireId).subscribe({
      next: () => {
        this.formulaires = this.formulaires.filter(f => f.formulaireId !== formulaire.formulaireId);
        this.handleGetFormulaires();
      },
      error: () => {
        this.errorMessage = "Erreur lors de la suppression du formulaire.";
      }
    });
  }

  handleSearchFormulaire(): void {
    this.currentAction = 'search';
    const keyword = this.searchFormGroup.value.keyword;

    this.questionService.searchFormulaire(keyword).subscribe({
      next: (data) => {
        this.formulaires = data.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
        this.numberPage = Math.ceil(data.length / this.pageSize);
      },
      error: () => {
        this.errorMessage = "Erreur lors de la recherche.";
      }
    });
  }

  gotoPage(i: number): void {
    this.currentPage = i;
    if (this.currentAction === 'all') {
      this.handleGetFormulaires();
    } else {
      this.handleSearchFormulaire();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.numberPage - 1) {
      this.gotoPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.gotoPage(this.currentPage - 1);
    }
  }

  viewFormulaire(formulaire: Formulaire): void {
    this.selectedFormulaire = formulaire;
  }
}
