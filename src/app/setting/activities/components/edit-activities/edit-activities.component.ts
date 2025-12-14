import { Component } from '@angular/core';
import {MessageService, SharedModule} from "primeng/api";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {CommonModule, NgClass, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {BaseActivitiesDetailComponent} from "../base-activities-detail/base-activities-detail.component";
import {ActivityType} from "../../../_types/activity.type";
import {BaseEditManager} from "../../../../_classes/base-edit.manager";
import {AccustomService} from "../../../_services/accustom.service";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {ActivitiesService} from "../../../_services/activities.service";

@Component({
  selector: 'app-edit-activities',
  templateUrl: '../base-activities-detail/base-activities-detail.component.html',
  styleUrl: './edit-activities.component.scss',
  standalone: true,
  imports: [
    SharedModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    NgClass,
    InputNumberModule,
    NgIf
  ]
})
export class EditActivitiesComponent extends BaseActivitiesDetailComponent<ActivityType>{
  newManager: BaseEditManager<ActivityType, ActivityType>;

  constructor(private activityService: ActivitiesService,
              private messageService: MessageService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              loading: LoadingService) {
    let manager =
      new BaseEditManager<ActivityType,ActivityType>(
        ActivityType,
        (input) =>{

          if(input.iconClass){
            let index = this.icons.findIndex(i =>i.icon == input.iconClass)
            this.selectedIndex = index
          }

          let res = new ActivityType(input);

          return res
        }, activityService, messageService, activeRoute , router,loading);


    manager.BeforeSave.subscribe(res =>{
      this.manager.oneObject.iconClass = this.icons[this.selectedIndex].icon
    })

    manager
      .OnSuccessfulSave
      .subscribe((i) =>{
        router.navigate(['./'], {relativeTo:this.activeRoute.parent});
      });

    super(manager, activityService, loading);

    this.newManager = manager
    // this.mode = 'Edit';
    // debugger
    // let index = this.icons.findIndex(i =>{ i.icon === this.manager.oneObject.iconClass})
    // this.selectedIndex = index
  }

}
