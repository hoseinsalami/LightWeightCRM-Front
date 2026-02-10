import { Component } from '@angular/core';
import {BaseSurveyDetailComponent} from "../base-survey-detail/base-survey-detail.component";
import {SurveyService} from "../../../_services/survey.service";
import {MessageService, SharedModule} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {BaseEditManager} from "../../../../_classes/base-edit.manager";
import {SurveyQuestions, SurveyType} from "../../../_types/survey.type";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DividerModule} from "primeng/divider";
import {KeyFilterModule} from "primeng/keyfilter";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-edit-survey',
  templateUrl: '../base-survey-detail/base-survey-detail.component.html',
  styleUrl: './edit-survey.component.scss',
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
export class EditSurveyComponent extends BaseSurveyDetailComponent {

  constructor(
    private surveyService: SurveyService,
    private messageService: MessageService,
    private router: Router,
    activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {
    let manager =
      new BaseEditManager<SurveyType,SurveyType>(SurveyType,
        (input) => {

          let res = new SurveyType(input)

          return res

        },surveyService, messageService ,activeRoute, router , loading);


    manager.OnSuccessfulSave.subscribe((i) =>{
      router.navigate(['./'], {relativeTo:this.activeRoute.parent});
    });

    super(manager, surveyService, loading, activeRoute);
  }

  override get isEditMode(): boolean {
    const id = this.activeRoute.snapshot.params['id'];
    return !!id;
  }

}
