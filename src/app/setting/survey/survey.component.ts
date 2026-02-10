import { Component } from '@angular/core';
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import {BaseListComponent} from "../../shared/base-list/base-list.component";
import {LoadingService} from "../../_services/loading.service";
import {SurveyService} from "../_services/survey.service";
import {ShowAllQuestions, SurveyQuestions, SurveyType} from "../_types/survey.type";
import {TooltipModule} from "primeng/tooltip";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    SharedModule,
    ButtonModule,
    TableModule,
    RouterLink,
    DialogModule,
    FormsModule,
    InputTextModule,
    JalaliDatePipe,
    TooltipModule
  ]
})
export class SurveyComponent extends BaseListComponent<SurveyType>{

  showDialog:boolean = false;
  oneObject:ShowAllQuestions = new ShowAllQuestions({})

  constructor(
    private surveyService: SurveyService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingService
  ) {
    super(surveyService, confirmationService, messageService);
  }

  construct(input:SurveyType){
    return new SurveyType(input)
  }


  showPreviewQuestions(id:number){
    this.loading.show();
    this.surveyService.getPreviewQuestions(id).subscribe({
      next:(out) => {
        this.loading.hide();
        this.showDialog = true;
        this.oneObject = out
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }


}
