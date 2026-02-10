import { Component } from '@angular/core';
import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {LoadingService} from "../../../../_services/loading.service";
import {ActivatedRoute} from "@angular/router";
import {SurveyQuestions, SurveyType} from "../../../_types/survey.type";
import {SurveyService} from "../../../_services/survey.service";

@Component({
  template: '',
})
export class BaseSurveyDetailComponent {

  constructor(protected manager: BaseSaveManager<SurveyType>,
              surveyService: SurveyService,
              protected loading: LoadingService,
              protected activeRoute: ActivatedRoute) {

  }


  get isEditMode(): boolean {
    return false;
  }

}
