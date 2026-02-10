import { Component } from '@angular/core';
import {BaseAccustomDetailComponent} from "../base-accustom-detail/base-accustom-detail.component";
import {AccustomType} from "../../../_types/accustom.type";
import {AccustomService} from "../../../_services/accustom.service";
import {MessageService, SharedModule} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {BaseEditManager} from "../../../../_classes/base-edit.manager";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {DividerModule} from "primeng/divider";


@Component({
  selector: 'app-edit-accustom',
  templateUrl: '../base-accustom-detail/base-accustom-detail.component.html',
  styleUrl: './edit-accustom.component.scss',
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
export class EditAccustomComponent extends BaseAccustomDetailComponent<AccustomType>{
  newManager: BaseEditManager<AccustomType,AccustomType>

  constructor(
    private accustomService: AccustomService,
    private messageService: MessageService,
    private router: Router,
    activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {
    let manager =
      new BaseEditManager<AccustomType,AccustomType>(
        AccustomType,
        (input) => {

          let res = new AccustomType(input)

          return res

        },accustomService, messageService ,activeRoute, router , loading)

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

  manager.OnSuccessfulSave.subscribe((i) =>{
      router.navigate(['./'], {relativeTo:this.activeRoute.parent});
    });
  super(manager, accustomService, loading, activeRoute);

  this.newManager = manager;

  }

}
