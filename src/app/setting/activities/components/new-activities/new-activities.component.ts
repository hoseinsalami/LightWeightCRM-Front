import { Component } from '@angular/core';
import {BaseActivitiesDetailComponent} from "../base-activities-detail/base-activities-detail.component";
import {ActivityType} from "../../../_types/activity.type";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {MessageService, SharedModule} from "primeng/api";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {CommonModule, NgClass, NgIf, NgStyle} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {ActivitiesService} from "../../../_services/activities.service";
import {InputNumberModule} from "primeng/inputnumber";

@Component({
  selector: 'app-new-activities',
  templateUrl: '../base-activities-detail/base-activities-detail.component.html',
  styleUrl: './new-activities.component.scss',
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
export class NewActivitiesComponent extends BaseActivitiesDetailComponent<ActivityType>{

  newManager: BaseNewManager<ActivityType>
  constructor(
    private activityService: ActivitiesService,
    private messageService: MessageService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              loading: LoadingService) {
    let manager =
      new BaseNewManager<ActivityType>(ActivityType, activityService, messageService, {}, router, activeRoute, loading)

    manager.validation = () =>{
      if (!this.manager.oneObject.title) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'عنوان اجباری می باشد.',
        });
        return false;
      }

      if (!this.manager.oneObject.iconClass) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'آیکون اجباری می باشد.',
        });
        return false;
      }

      if (!this.manager.oneObject.defaultDuration) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'زمان تقریبی اجباری می باشد.',
        });
        return false;
      }
      return true
    }

    manager.BeforeSave.subscribe((res) =>{
      this.manager.oneObject.iconClass = this.icons[this.selectedIndex].icon
    })

    manager
      .OnSuccessfulSave
      .subscribe((i) =>{
        router.navigate(['./'], {relativeTo:activeRoute.parent});
      });

    super(manager,activityService,loading);

    // this.mode = 'New';

  }


}
