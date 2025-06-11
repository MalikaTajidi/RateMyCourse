import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuestComponent } from './quest/quest.component';
import { ProfilComponent } from './profil/profil.component';
import { FormationComponent } from './formation/formation.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { NewFormationComponent } from './new-formation/new-formation.component';
import { DetailProfilComponent } from './detail-profil/detail-profil.component';
import { NewProfileComponent } from './new-profile/new-profile.component';
import { StudentComponent } from './student/student.component';
import { NewStudentComponent } from './new-student/new-student.component';
import { NewQuestionComponent } from './new-question/new-question.component';
import { FormulaireDetailComponent } from './formulaire-detail/formulaire-detail.component';
import { DetailFormationComponent } from './detail-formation/detail-formation.component';
import { LoginComponent } from './login/login.component';
import { FirstLoginComponent } from './first-login/first-login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { StudentSidebarComponent } from './student-sidebar/student-sidebar.component';
import { ModulesComponent } from './modules/modules.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { SidbarComponent } from './sidbar/sidbar.component';
import { switchScan } from 'rxjs';
const routes: Routes = [
  {path:"navbar" , component: SidbarComponent},
  {path:"question" , component: QuestComponent},
  {path:"profil" , component: ProfilComponent},
  {path:"formation" , component: FormationComponent},
  {path:"dashbord" , component: DashbordComponent},
  {path:"student" , component: StudentComponent},
  {path:"DetailProfil" , component: DetailProfilComponent},
  {path:"newFormation" , component: NewFormationComponent},
  {path:"newProfil" , component: NewProfileComponent},
  {path:"newStudent" , component: NewStudentComponent},
  {path:"newQuestion" , component: NewQuestionComponent},
  {path:"detailFormulaire" , component: FormulaireDetailComponent},
  {path:"detailFormation" , component: DetailFormationComponent},
  {path:"login" , component: LoginComponent},
  {path:"first-login" , component: FirstLoginComponent},
  {path:"" , component: LandingPageComponent},
  { path: "", component: LandingPageComponent },

  
  // Routes pour l'espace étudiant avec préfixe student-area
  {path:"student-area", children: [
    { path: 'dashboard', component: StudentDashboardComponent },
    { path: 'modules', component: ModulesComponent },
    { path: 'statistics', component: StatisticsComponent },
    { path: 'evaluation', component: EvaluationComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]},
    {path:"navbar", children: [
    { path: 'dashbordAdmin', component: DashbordComponent },
    { path: 'formations', component: FormationComponent },
    { path: 'students', component: StudentComponent },
    { path: 'evaluation', component: EvaluationComponent },
    { path: '', redirectTo: 'dashbordAdmin', pathMatch: 'full' }
  ]},

  {path:"**" , redirectTo: "", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

