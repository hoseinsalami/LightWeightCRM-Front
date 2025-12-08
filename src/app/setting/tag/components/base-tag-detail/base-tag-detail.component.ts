import { Component } from '@angular/core';
import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {TagService} from "../../../_services/tag.service";
import {LoadingService} from "../../../../_services/loading.service";

export class BaseTagDetailComponent<T> {

  constructor(
    protected manager: BaseSaveManager<T>,
    tagService: TagService,
    protected loading: LoadingService
  ) {
  }

}
