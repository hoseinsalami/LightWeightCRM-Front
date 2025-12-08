import { Component } from '@angular/core';
import {BaseTagDetailComponent} from "../base-tag-detail/base-tag-detail.component";
import {TagService} from "../../../_services/tag.service";
import {MessageService} from "primeng/api";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {TagTypeBase} from "../../../_types/tag.type";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-new-tag',
  templateUrl: '../base-tag-detail/base-tag-detail.component.html',
  styleUrl: './new-tag.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
  ]
})
export class NewTagComponent extends BaseTagDetailComponent<TagTypeBase> {

  newManager: BaseTagDetailComponent<TagTypeBase>
  constructor(
    private tagService: TagService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {
    let manager =
      new BaseNewManager<TagTypeBase>(TagTypeBase, tagService, messageService, {}, router, activeRoute, loading);

    manager.OnSuccessfulSave.subscribe((i) =>{
        router.navigate(['./'], {relativeTo:activeRoute.parent});
      });

    super(manager,tagService,loading);

  }


}
