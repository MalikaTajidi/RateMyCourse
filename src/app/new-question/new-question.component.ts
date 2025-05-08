import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {QuestionService} from '../service/question.service';
import {ActivatedRoute} from '@angular/router';
import {Formulaire} from '../model/formulaire';
import {Student} from '../model/student';

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




  constructor(private fb: FormBuilder ,  private route: ActivatedRoute, private questionService: QuestionService ) { }

  ngOnInit(): void {
    this.formulaireFormGroup = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      lSectionFormulaire: this.fb.array([])
    });

    this.route.queryParams.subscribe(params => {

      const id = Number(params['id']);
      this.questionService.getFormulaireById(id).subscribe(
        formulaire => {
          this.formulaire = formulaire;
          if (formulaire) {
            this.populateForm(formulaire); // 👈 Remplir le formulaire
          }
        }
      )
    })

  }


  populateForm(formulaire: Formulaire): void {
    this.editMode = true;
    this.formulaireFormGroup.patchValue({
      name: formulaire.name,
      type: formulaire.type
    });

    const sectionsArray = this.formulaireFormGroup.get('lSectionFormulaire') as FormArray;
    formulaire.lSectionFormulaire.forEach(section => {
      const questionsArray = this.fb.array(
        section.lQuestionnaire.map(q => this.fb.group({
          id: [q.id],
          content: [q.content, Validators.required]
        }))
      );

      const sectionGroup = this.fb.group({
        id: [section.id],
        Description: [section.Description, Validators.required],
        lQuestionnaire: questionsArray
      });

      sectionsArray.push(sectionGroup);
    });
  }















  get sections(): FormArray {
    return this.formulaireFormGroup.get('lSectionFormulaire') as FormArray;
  }

  ajouterSection(): void {
    const sectionGroup = this.fb.group({
      id: [null],
      Description: ['', Validators.required],
      lQuestionnaire: this.fb.array([])
    });
    this.sections.push(sectionGroup);
  }

  supprimerSection(index: number): void {
    this.sections.removeAt(index);
  }

  getQuestions(sectionIndex: number): FormArray {
    return this.sections.at(sectionIndex).get('lQuestionnaire') as FormArray;
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
      let newFormulaire: Formulaire = this.formulaireFormGroup.value;

      // Envoi du formulaire via le service
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
    if (this.formulaireFormGroup.valid && this.formulaire?.id != null) {
      const updatedFormulaire: Formulaire = {
        ...this.formulaireFormGroup.value,
        id: this.formulaire.id
      };

      this.questionService.updateFormulaire(updatedFormulaire).subscribe({
        next: (res) => {
          alert('Formulaire mis à jour avec succès !');
          this.formulaireFormGroup.reset();
          // Optionnel : Rediriger ou changer d'état si nécessaire, comme le mettre en mode lecture
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
