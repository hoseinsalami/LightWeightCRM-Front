import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {LoadingService} from "../../../../_services/loading.service";
import {FailuresService} from "../../../_services/failures.service";


export class BaseFailuresDetailComponent<T>{

  constructor(protected manager: BaseSaveManager<T>,
              failureService: FailuresService,
              protected loading: LoadingService) {

  }

}
