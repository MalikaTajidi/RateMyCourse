import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestComponent } from './quest/quest.component';
import { SidbarComponent } from './sidbar/sidbar.component';
import { FormationComponent } from './formation/formation.component';
import { ProfilComponent } from './profil/profil.component';

import { DashbordComponent } from './dashbord/dashbord.component';
import {ReactiveFormsModule} from '@angular/forms';
import { NewFormationComponent } from './new-formation/new-formation.component';
import { DetailProfilComponent } from './detail-profil/detail-profil.component';
import { NewProfileComponent } from './new-profile/new-profile.component';
import { StudentComponent } from './student/student.component';
import { NewStudentComponent } from './new-student/new-student.component';
import { NewQuestionComponent } from './new-question/new-question.component';
import { FormulaireDetailComponent } from './formulaire-detail/formulaire-detail.component';
import { DetailFormationComponent } from './detail-formation/detail-formation.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestComponent,
    SidbarComponent,
    FormationComponent,
    ProfilComponent,

    DashbordComponent,
    NewFormationComponent,
    DetailProfilComponent,
    NewProfileComponent,
    StudentComponent,
    NewStudentComponent,
    NewQuestionComponent,
    FormulaireDetailComponent,
    DetailFormationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
