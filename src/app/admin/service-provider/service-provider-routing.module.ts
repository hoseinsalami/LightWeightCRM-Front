import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ServiceProviderComponent} from "./service-provider.component";
import {NewServicesComponent} from "./components/new-services/new-services.component";
import {EditServicesComponent} from "./components/edit-services/edit-services.component";
import {NotfoundComponent} from "../../pages/notfound/notfound.component";
import {AuthGuard} from "../../_guard/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: ServiceProviderComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'new',
    component: NewServicesComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'edit/:id',
    component: EditServicesComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceProviderRoutingModule { }
