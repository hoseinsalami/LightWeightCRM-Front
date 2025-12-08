import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TicketDetailComponent} from "./ticket-detail/ticket-detail.component";
import {TicketsComponent} from "./tickets.component";
import {AuthGuard} from "../_guard/auth.guard";

const routes: Routes = [
  {
    path: ':id',
    component: TicketsComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: ':id/:ticketDetailId',
    component: TicketDetailComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule { }
