import { Component } from '@angular/core';
import {BaseSaveManager} from "../../../_classes/base-save.manager";
import {ServiceProviderService} from "../../service-provider.service";
import {LoadingService} from "../../../_services/loading.service";

@Component({
  template: '',
})
export class BaseServicesDetailComponent<T> {

  constructor(protected manager: BaseSaveManager<T>,
              private serviceProviderService: ServiceProviderService,
              protected loading: LoadingService) {
  }

}
