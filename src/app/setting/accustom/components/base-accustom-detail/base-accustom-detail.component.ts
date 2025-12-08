import {AccustomService} from "../../../_services/accustom.service";
import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {LoadingService} from "../../../../_services/loading.service";
import {ActivatedRoute} from "@angular/router";


export class BaseAccustomDetailComponent<T> {

  constructor(protected manager: BaseSaveManager<T>,
              accustomService: AccustomService,
              protected loading: LoadingService) {

  }

}
