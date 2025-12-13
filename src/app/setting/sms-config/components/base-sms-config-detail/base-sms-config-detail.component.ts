import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {LoadingService} from "../../../../_services/loading.service";
import {SmsConfigService} from "../../../_services/sms-config.service";
import {ICommonType} from "../../../../path/_types/create-work-item.type";

export class BaseSmsConfigDetailComponent<T> {

  smsProvider:ICommonType[] = []

  constructor(protected manager: BaseSaveManager<T>,
              private smsConfigService: SmsConfigService,
              protected loading: LoadingService,) {
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
