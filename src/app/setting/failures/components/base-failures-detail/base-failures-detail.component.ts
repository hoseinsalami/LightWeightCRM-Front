import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {LoadingService} from "../../../../_services/loading.service";
import {FailuresService} from "../../../_services/failures.service";
import {ActivatedRoute} from "@angular/router";


export class BaseFailuresDetailComponent<T>{

  isId?: string;
  constructor(protected manager: BaseSaveManager<T>,
              failureService: FailuresService,
              protected loading: LoadingService,
              protected activeRoute: ActivatedRoute) {
    this.isId = this.activeRoute.snapshot.params['id'];
  }

}
