import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TicketReportComponent} from "./ticket-report/ticket-report.component";
import {CariesReportComponent} from "./caries-report/caries-report.component";
import {ActivitesReportComponent} from "./activites-report/activites-report.component";
import {AuthGuard} from "../_guard/auth.guard";

const routes: Routes = [
  { path: 'tickets',
    component: TicketReportComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'caries',
    component: CariesReportComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'activities',
    component: ActivitesReportComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
