import {Component, OnInit} from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MessageService, SharedModule} from "primeng/api";
import {DropdownModule} from "primeng/dropdown";
import {InputTextareaModule} from "primeng/inputtextarea";
import {FieldsetModule} from "primeng/fieldset";
import {RadioButtonModule} from "primeng/radiobutton";
import { DividerModule } from 'primeng/divider';
import {BaseFilterDetailComponent} from "../base-filter-detail/base-filter-detail.component";
import {CreateFilterDTO} from "../../../_types/filter.type";
import {FiltersService} from "../../../_services/filters.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {DialogModule} from "primeng/dialog";

@Component({
  selector: 'app-new-filter',
  templateUrl: '../base-filter-detail/base-filter-detail.component.html',
  styleUrl: './new-filter.component.scss',
  standalone: true,
  imports: [
    SharedModule,
    FormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputTextareaModule,
    FieldsetModule,
    RadioButtonModule,
    DividerModule,
    DialogModule,
  ]
})
export class NewFilterComponent extends BaseFilterDetailComponent<CreateFilterDTO>{
  // test:any;


  constructor(
    private filterService: FiltersService,
    private messageService: MessageService,
    router: Router,
    activeRoute: ActivatedRoute,
    loading: LoadingService
    ){
    let manager =
      new BaseNewManager<CreateFilterDTO>(CreateFilterDTO, filterService, messageService, {}, router, activeRoute, loading)

    super(manager, filterService, loading,router,activeRoute);

    manager.OnSuccessfulSave.subscribe((i)=>{
      router.navigate(['./'], {relativeTo: activeRoute.parent})
    });

  }

  showDpdonw(){}
}
