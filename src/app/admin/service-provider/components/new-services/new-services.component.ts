import { Component } from '@angular/core';
import {BaseServicesDetailComponent} from "../base-services-detail/base-services-detail.component";
import {CreateSmsProviderDTO} from "../../_types/service-provider.type";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {ServiceProviderService} from "../../service-provider.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-new-services',
  templateUrl: '../base-services-detail/base-services-detail.component.html',
  styleUrl: './new-services.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ]
})
export class NewServicesComponent extends BaseServicesDetailComponent<CreateSmsProviderDTO>{
  newManager: BaseNewManager<CreateSmsProviderDTO>;
  constructor(
    private sPService:ServiceProviderService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {
    let manager = new BaseNewManager<CreateSmsProviderDTO>(CreateSmsProviderDTO, sPService,messageService,{}, router, activeRoute,  loading);

    super(manager, sPService, loading);

    manager.OnSuccessfulSave.subscribe((i) =>{
      router.navigate(['./'], {relativeTo: activeRoute.parent});
    })

    this.newManager = manager
  }

}
