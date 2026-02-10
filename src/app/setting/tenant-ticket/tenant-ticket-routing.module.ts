import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TenantTicketComponent} from "./tenant-ticket.component";
import {AuthGuard} from "../../_guard/auth.guard";
import {NotfoundComponent} from "../../pages/notfound/notfound.component";
import {AddTenantTicketComponent} from "./add-tenant-ticket/add-tenant-ticket.component";
import {TenantConversationComponent} from "./tenant-conversation/tenant-conversation.component";

const routes: Routes = [
  {
    path: '',
    component: TenantTicketComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'new',
    component: AddTenantTicketComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'conversation/:id',
    component: TenantConversationComponent,
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
export class TenantTicketRoutingModule { }
