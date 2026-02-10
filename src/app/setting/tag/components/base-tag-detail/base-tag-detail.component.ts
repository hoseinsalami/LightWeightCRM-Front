import { Component } from '@angular/core';
import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {TagService} from "../../../_services/tag.service";
import {LoadingService} from "../../../../_services/loading.service";
import {ActivatedRoute} from "@angular/router";

export class BaseTagDetailComponent<T> {

  isId?: string;
  constructor(
    protected manager: BaseSaveManager<T>,
    tagService: TagService,
    protected loading: LoadingService,
    protected activeRoute: ActivatedRoute) {
    this.isId = this.activeRoute.snapshot.params['id'];
  }

}
