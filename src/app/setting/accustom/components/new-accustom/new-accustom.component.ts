import {Component, OnInit} from '@angular/core';
import {BaseAccustomDetailComponent} from "../base-accustom-detail/base-accustom-detail.component";
import {AccustomType} from "../../../_types/accustom.type";
import {MessageService, SharedModule} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {AccustomService} from "../../../_services/accustom.service";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-new-accustom',
  templateUrl: '../base-accustom-detail/base-accustom-detail.component.html',
  styleUrl: './new-accustom.component.scss',
  standalone: true,
  imports: [
    SharedModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule
  ]
})
export class NewAccustomComponent extends BaseAccustomDetailComponent<AccustomType> implements OnInit{

  newManager:BaseNewManager<AccustomType>

  constructor(
        private accustomService: AccustomService,
        private messageService: MessageService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        loading: LoadingService) {

    let manager =
      new BaseNewManager<AccustomType>(AccustomType, accustomService, messageService, {} , router , activeRoute ,loading);

    super(manager, accustomService, loading);


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

  ngOnInit() {
  }

}
