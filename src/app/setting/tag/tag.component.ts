import { Component } from '@angular/core';
import {BaseListComponent} from "../../shared/base-list/base-list.component";
import {TagTypeBase} from "../_types/tag.type";
import {TagService} from "../_services/tag.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LoadingService} from "../../_services/loading.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {ToolbarModule} from "primeng/toolbar";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TableModule,
    ButtonModule,
    ToolbarModule,
    TooltipModule
  ]
})
export class TagComponent extends BaseListComponent<TagTypeBase> {

  constructor(
    private tagService: TagService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingService
  ) {
    super(tagService, confirmationService, messageService);
  }

  construct(input:TagTypeBase){
    return new TagTypeBase(input);
  }

}
