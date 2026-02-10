import { Component } from '@angular/core';
import {BaseServicesDetailComponent} from "../base-services-detail/base-services-detail.component";
import {CreateSmsProviderDTO} from "../../_types/service-provider.type";
import {BaseEditManager} from "../../../../_classes/base-edit.manager";
import {ServiceProviderService} from "../../service-provider.service";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-edit-services',
  templateUrl: '../base-services-detail/base-services-detail.component.html',
  styleUrl: './edit-services.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ],
  standalone: true
})
export class EditServicesComponent extends BaseServicesDetailComponent<CreateSmsProviderDTO>{
  newManager: BaseEditManager<CreateSmsProviderDTO, CreateSmsProviderDTO>

  constructor(
    private sPService: ServiceProviderService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {
    let manager = new BaseEditManager<CreateSmsProviderDTO,CreateSmsProviderDTO>(
      CreateSmsProviderDTO,
      (input) =>{
        let res = new CreateSmsProviderDTO(input);
        return res;
      }, sPService, messageService, activeRoute, router, loading);

    manager.OnSuccessfulSave.subscribe((i)=>{
      router.navigate(['./'], {relativeTo: this.activeRoute.parent})
    })

    super(manager, sPService, loading);
  }

}
