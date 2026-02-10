import { Component } from '@angular/core';
import {BaseTagDetailComponent} from "../base-tag-detail/base-tag-detail.component";
import {TagTypeBase} from "../../../_types/tag.type";
import {BaseEditManager} from "../../../../_classes/base-edit.manager";
import {TagService} from "../../../_services/tag.service";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {MessageService} from "primeng/api";
import {DividerModule} from "primeng/divider";

@Component({
  selector: 'app-edit-tag',
  templateUrl: '../base-tag-detail/base-tag-detail.component.html',
  styleUrl: './edit-tag.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DividerModule
  ]
})
export class EditTagComponent extends BaseTagDetailComponent<TagTypeBase>{
  newManager: BaseEditManager<TagTypeBase, TagTypeBase>;

  constructor(
    private tagService: TagService,
    private messageService: MessageService,
    private router: Router,
    activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {
    let manager =
      new BaseEditManager<TagTypeBase,TagTypeBase>(
        TagTypeBase,
        (input) =>{
          let res = new TagTypeBase(input);
          return res
        }, tagService, messageService, activeRoute, router, loading)

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

    super(manager, tagService, loading, activeRoute);
  }

}
