import { Component } from '@angular/core';
import {MessageService, SharedModule} from "primeng/api";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DividerModule} from "primeng/divider";
import {BaseSurveyDetailComponent} from "../base-survey-detail/base-survey-detail.component";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {SurveyService} from "../../../_services/survey.service";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {SurveyQuestions, SurveyType} from "../../../_types/survey.type";
import {KeyFilterModule} from "primeng/keyfilter";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-new-survey',
  templateUrl: '../base-survey-detail/base-survey-detail.component.html',
  styleUrl: './new-survey.component.scss',
  standalone: true,
  imports: [
    SharedModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    DividerModule,
    KeyFilterModule,
    TooltipModule
  ]
})
export class NewSurveyComponent extends BaseSurveyDetailComponent{

  newManager:BaseNewManager<SurveyType>
  constructor(
    private surveyService: SurveyService,
    private messageService: MessageService,
    private router: Router,
    activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {
    let manager =
      new BaseNewManager<SurveyType>(SurveyType, surveyService, messageService, {} , router , activeRoute ,loading)
    super(manager, surveyService, loading, activeRoute);

    manager.OnSuccessfulSave.subscribe((i)=>{
      router.navigate([`../questions/${i.id}` ],{ relativeTo: activeRoute })
      // router.navigate(['./'], {relativeTo: activeRoute.parent})
    });

    this.newManager = manager
  }

}
