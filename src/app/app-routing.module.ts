import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SidbarComponent} from './sidbar/sidbar.component';
import {QuestComponent} from './quest/quest.component';
import {ProfilComponent} from './profil/profil.component';
import {FormationComponent} from './formation/formation.component';
import {DashbordComponent} from './dashbord/dashbord.component';

import {NewFormationComponent} from './new-formation/new-formation.component';
import {DetailProfilComponent} from './detail-profil/detail-profil.component';
import {NewProfileComponent} from './new-profile/new-profile.component';
import {StudentComponent} from './student/student.component';
import {NewStudentComponent} from './new-student/new-student.component';
import {NewQuestionComponent} from './new-question/new-question.component';
import {FormulaireDetailComponent} from './formulaire-detail/formulaire-detail.component';
import {DetailFormationComponent} from './detail-formation/detail-formation.component';

const routes: Routes = [
  {path:"navbar" , component: SidbarComponent},
  {path:"question" , component: QuestComponent},
  {path:"profil" , component: ProfilComponent},
  {path:"formation" , component: FormationComponent},
  {path:"dashbord" , component: DashbordComponent},
  {path:"student" , component: StudentComponent},
  {path:"DetailProfil" , component: DetailProfilComponent},
  {path:"newFormation" , component :NewFormationComponent },
  {path:"newProfil" , component :NewProfileComponent} ,
  {path:"newStudent" , component : NewStudentComponent } ,
  {path:"newQuestion" , component : NewQuestionComponent } ,
  {path:"detailFormulaire" , component : FormulaireDetailComponent },
  {path:"detailFormation" , component : DetailFormationComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }














