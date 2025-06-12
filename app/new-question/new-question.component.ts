import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from '../service/question.service';
import { ActivatedRoute } from '@angular/router';
import { Formulaire } from '../model/formulaire';

@Component({
  selector: 'app-new-question',
  standalone: false,
  templateUrl: './new-question.component.html',
  styleUrl: './new-question.component.css'
})
export class NewQuestionComponent {
  formulaireFormGroup!: FormGroup;
  editMode: boolean = false;
  formulaire: Formulaire | undefined;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.formulaireFormGroup = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      sections: this.fb.array([]) // Changé de lSectionFormulaire à sections
    });

    this.route.queryParams.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        this.questionService.getFormulaireById(id).subscribe(
          formulaire => {
            this.formulaire = formulaire;
            if (formulaire) {
              this.populateForm(formulaire);
            }
          }
        );
      }
    });
  }

  populateForm(formulaire: Formulaire): void {
    this.editMode = true;
    this.formulaireFormGroup.patchValue({
      name: formulaire.name,
      type: formulaire.type
    });

    const sectionsArray = this.formulaireFormGroup.get('sections') as FormArray;
    sectionsArray.clear(); // Nettoyer avant de remplir

    formulaire.sections.forEach(section => {
      const questionsArray = this.fb.array(
        section.questions.map(q => this.fb.group({
          id: [q.questionId],
          content: [q.content, Validators.required]
        }))
      );

      const sectionGroup = this.fb.group({
        id: [section.secFormId],
        description: [section.description, Validators.required], // Changé Description à description
        questions: questionsArray // Changé lQuestionnaire à questions
      });

      sectionsArray.push(sectionGroup);
    });
  }

  get sections(): FormArray {
    return this.formulaireFormGroup.get('sections') as FormArray;
  }

  ajouterSection(): void {
    const sectionGroup = this.fb.group({
      id: [null],
      description: ['', Validators.required], // Changé Description à description
      questions: this.fb.array([]) // Changé lQuestionnaire à questions
    });
    this.sections.push(sectionGroup);
  }

  supprimerSection(index: number): void {
    this.sections.removeAt(index);
  }

  getQuestions(sectionIndex: number): FormArray {
    return this.sections.at(sectionIndex).get('questions') as FormArray;
  }

  ajouterQuestion(sectionIndex: number): void {
    const questionGroup = this.fb.group({
      id: [null],
      content: ['', Validators.required]
    });
    this.getQuestions(sectionIndex).push(questionGroup);
  }

  supprimerQuestion(sectionIndex: number, questionIndex: number): void {
    this.getQuestions(sectionIndex).removeAt(questionIndex);
  }

  onSaveForm() {
    if (this.formulaireFormGroup.valid) {
      const formValue = this.formulaireFormGroup.value;
      const newFormulaire: Formulaire = {
        formulaireId: 0,
        name: formValue.name,
        type: formValue.type,
        sections: formValue.sections.map((section: any) => ({
          description: section.description,
          questions: section.questions.map((question: any) => ({
            content: question.content
          }))
        }))
      };

      this.questionService.addFormulaire(newFormulaire).subscribe({
        next: (f) => {
          alert('Formulaire ajouté avec succès !');
          this.formulaireFormGroup.reset();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'ajout du formulaire');
        }
      });
    } else {
      alert('Formulaire invalide !');
    }
  }

  onUpdateForm() {
    if (this.formulaireFormGroup.valid && this.formulaire?.formulaireId != null) {
      const formValue = this.formulaireFormGroup.value;
      const updatedFormulaire: Formulaire = {
        formulaireId: this.formulaire.formulaireId,
        name: formValue.name,
        type: formValue.type,
        sections: formValue.sections.map((section: any) => ({
          secFormId: section.id,
          description: section.description,
          questions: section.questions.map((question: any) => ({
            questionId: question.id,
            content: question.content
          }))
        }))
      };

      this.questionService.updateFormulaire(updatedFormulaire).subscribe({
        next: (res) => {
          alert('Formulaire mis à jour avec succès !');
          this.formulaireFormGroup.reset();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la mise à jour du formulaire');
        }
      });
    } else {
      alert('Formulaire invalide ou ID manquant !');
    }
  }
}
