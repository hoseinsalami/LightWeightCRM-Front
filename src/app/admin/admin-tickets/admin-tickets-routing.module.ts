import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminTicketsComponent} from "./admin-tickets.component";
import {AuthGuard} from "../../_guard/auth.guard";
import {TicketConversationComponent} from "./ticket-conversation/ticket-conversation.component";

const routes: Routes = [
  {
    path: '',
    component: AdminTicketsComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'conversation/:id',
    component: TicketConversationComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTicketsRoutingModule { }
