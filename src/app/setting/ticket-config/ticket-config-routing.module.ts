import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TicketConfigComponent} from "./ticket-config.component";
import {AuthGuard} from "../../_guard/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: TicketConfigComponent,
    canActivate: [AuthGuard],
    data: {permission: 'Ticket'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketConfigRoutingModule { }
