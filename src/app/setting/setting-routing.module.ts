import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "../_guard/auth.guard";
import {TenantTicketComponent} from "./tenant-ticket/tenant-ticket.component";

const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(u => u.UsersModule),
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.module').then(c => c.CustomersModule),
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'caries',
    loadChildren: () => import('./caries/caries.module').then(c => c.CariesModule),
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'activities',
    loadChildren: () => import('./activities/activities.module').then(a => a.ActivitiesModule),
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'accustom',
    loadChildren: () => import('./accustom/accustom.module').then(ac => ac.AccustomModule),
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'failures',
    loadChildren: () => import('./failures/failures.module').then(f => f.FailuresModule),
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'ticket-config',
    loadChildren: () => import('./ticket-config/ticket-config.module').then(t => t.TicketConfigModule),
    canActivate: [AuthGuard],
    data: {permission: 'Ticket'}
  },

  {
    path: 'sms-config',
    loadChildren: () => import('./sms-config/sms-config.module').then(s => s.SmsConfigModule),
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },

  {
    path: 'tag',
    loadChildren: () => import('./tag/tag.module').then(t => t.TagModule),
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'filter',
    loadChildren: () => import('./filters/filters.module').then(f => f.FiltersModule),
    canActivate: [AuthGuard],
    data: {permission: 'Filter'}
  },
  {
    path: 'process-automation',
    loadChildren: () => import('./process-automation/process-automation.module').then(p => p.ProcessAutomationModule),
    canActivate: [AuthGuard],
    data: {permission: 'Process'}
  },
  {
    path: 'agent',
    loadChildren: () => import('./agent/agent.module').then(a => a.AgentModule),
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'tenantTicket',
    loadChildren: () => import('./tenant-ticket/tenant-ticket.module').then(t => t.TenantTicketModule),
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'document',
    loadChildren: () => import('./document/document.module').then(d => d.DocumentModule),
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'survey',
    loadChildren: () => import('./survey/survey.module').then(s => s.SurveyModule),
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
