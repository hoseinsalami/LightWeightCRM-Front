import { Component } from '@angular/core';
import {BaseFailuresDetailComponent} from "../base-failures-detail/base-failures-detail.component";
import {FailureTypeList} from "../../../_types/failure.type";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {MessageService, SharedModule} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {FailuresService} from "../../../_services/failures.service";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DividerModule} from "primeng/divider";

@Component({
  selector: 'app-new-failures',
  templateUrl: '../base-failures-detail/base-failures-detail.component.html',
  styleUrl: './new-failures.component.scss',
  standalone: true,
  imports: [
    SharedModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    DividerModule
  ]
})
export class NewFailuresComponent extends BaseFailuresDetailComponent<FailureTypeList>{
  newManager: BaseNewManager<FailureTypeList>

  constructor(
    private failureService: FailuresService,
    private messageService: MessageService,
    private router: Router,
    activeRoute: ActivatedRoute,
    loading: LoadingService) {
    let manager =
      new BaseNewManager<FailureTypeList>(FailureTypeList, failureService , messageService, {} ,router ,activeRoute, loading)

    super(manager, failureService ,loading, activeRoute);

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

    manager.OnSuccessfulSave.subscribe((i)=>{
      router.navigate(['./'], {relativeTo: activeRoute.parent})
    });

    this.newManager = manager
  }

}
