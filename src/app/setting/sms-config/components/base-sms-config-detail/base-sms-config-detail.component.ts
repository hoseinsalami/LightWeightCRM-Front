import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {LoadingService} from "../../../../_services/loading.service";
import {SmsConfigService} from "../../../_services/sms-config.service";
import {ICommonType} from "../../../../path/_types/create-work-item.type";
import {ActivatedRoute} from "@angular/router";

export class BaseSmsConfigDetailComponent<T> {

  smsProvider:ICommonType[] = []
  isId?: string;
  constructor(protected manager: BaseSaveManager<T>,
              private smsConfigService: SmsConfigService,
              protected loading: LoadingService,
              protected activeRoute: ActivatedRoute) {
    this.isId = this.activeRoute.snapshot.params['id'];
    this.getListOfSmsProvider()
  }


  getListOfSmsProvider(){
    this.loading.show();
    this.smsConfigService.getSmsProviders().subscribe({
      next: (out) =>{
        this.loading.hide();
        this.smsProvider = out
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  get isEditMode(): boolean {
    return false;
  }

}
