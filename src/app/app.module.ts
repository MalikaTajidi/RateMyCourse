import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Composants
import { QuestComponent } from './quest/quest.component';
import { SidbarComponent } from './sidbar/sidbar.component';
import { FormationComponent } from './formation/formation.component';
import { ProfilComponent } from './profil/profil.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { NewFormationComponent } from './new-formation/new-formation.component';
import { DetailProfilComponent } from './detail-profil/detail-profil.component';
import { NewProfileComponent } from './new-profile/new-profile.component';
import { StudentComponent } from './student/student.component';
import { NewStudentComponent } from './new-student/new-student.component';
import { NewQuestionComponent } from './new-question/new-question.component';
import { FormulaireDetailComponent } from './formulaire-detail/formulaire-detail.component';
import { DetailFormationComponent } from './detail-formation/detail-formation.component';
import { StudentSidebarComponent } from './student-sidebar/student-sidebar.component';
import { EvaluationComponent } from './evaluation/evaluation.component';

// Services et Interceptors
import { AuthService } from './auth.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { StudentAreaComponent } from './student-area/student-area.component';
import { AiAssistantComponent } from './components/ai-assistant/ai-assistant.component';
import { SmartNotificationsComponent } from './components/smart-notifications/smart-notifications.component';

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
    DetailFormationComponent,
    StudentAreaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    StudentSidebarComponent,
    EvaluationComponent,
    AiAssistantComponent,
    SmartNotificationsComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
