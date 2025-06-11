import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiAssistantComponent } from './ai-assistant.component';

@NgModule({
  declarations: [
    AiAssistantComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    AiAssistantComponent
  ]
})
export class AiAssistantModule { }
