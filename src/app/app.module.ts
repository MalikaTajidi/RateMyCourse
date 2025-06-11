import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ModulesComponent } from './modules/modules.component';

// Services et Interceptors
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { FirstLoginComponent } from './first-login/first-login.component';


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
    FirstLoginComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    LandingPageComponent,
    ModulesComponent
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
