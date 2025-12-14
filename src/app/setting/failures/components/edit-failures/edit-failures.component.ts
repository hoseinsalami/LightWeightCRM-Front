import { Component } from '@angular/core';
import {MessageService, SharedModule} from "primeng/api";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BaseFailuresDetailComponent} from "../base-failures-detail/base-failures-detail.component";
import {FailureTypeList} from "../../../_types/failure.type";
import {BaseEditManager} from "../../../../_classes/base-edit.manager";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {FailuresService} from "../../../_services/failures.service";

@Component({
  selector: 'app-edit-failures',
  templateUrl: '../base-failures-detail/base-failures-detail.component.html',
  styleUrl: './edit-failures.component.scss',
  standalone: true,
  imports: [
    SharedModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule
  ]
})
export class EditFailuresComponent extends BaseFailuresDetailComponent<FailureTypeList>{
  newManager: BaseEditManager<FailureTypeList, FailureTypeList>

  constructor(
    private failureService: FailuresService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {

    let manager =
      new BaseEditManager<FailureTypeList,FailureTypeList>(
        FailureTypeList,
        (input)=>{
          let res = new FailureTypeList(input);
          return res
        }, failureService, messageService, activeRoute , router ,loading);

    manager.validation = () =>{
      if (!this.manager.oneObject.title) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'عنوان اجباری می باشد.',
        });
        return false;
      }
      return true;
    }

    manager
      .OnSuccessfulSave
      .subscribe((i) =>{
        router.navigate(['./'], {relativeTo:this.activeRoute.parent});
      });

    super(manager, failureService ,loading);
  }

}
