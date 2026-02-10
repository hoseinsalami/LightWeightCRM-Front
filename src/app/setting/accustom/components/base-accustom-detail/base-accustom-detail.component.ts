import {AccustomService} from "../../../_services/accustom.service";
import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {LoadingService} from "../../../../_services/loading.service";
import {ActivatedRoute} from "@angular/router";


export class BaseAccustomDetailComponent<T> {

  isId?: string;
  constructor(protected manager: BaseSaveManager<T>,
              accustomService: AccustomService,
              protected loading: LoadingService,
              protected activeRoute: ActivatedRoute) {
    this.isId = this.activeRoute.snapshot.params['id'];

  }

}
