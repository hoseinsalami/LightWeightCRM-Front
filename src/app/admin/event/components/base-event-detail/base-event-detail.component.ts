import { Component } from '@angular/core';
import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {LoadingService} from "../../../../_services/loading.service";
import {EventService} from "../../event.service";

@Component({
  template: '',
})
export class BaseEventDetailComponent<T> {
  isEnglishError: { [field: string]: boolean } = {};
  constructor(protected manager: BaseSaveManager<T>,
              eventService: EventService,
              protected loading: LoadingService){}


  allowOnlyEnglish(event: KeyboardEvent, fieldName: string){
    const char = event.key;
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (!regex.test(char)) {
      event.preventDefault();
      this.isEnglishError[fieldName] = true;
    } else {
      this.isEnglishError[fieldName] = false;
    }
  }

}
