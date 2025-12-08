import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotfoundComponent} from "../../pages/notfound/notfound.component";
import {ProcessAutomationComponent} from "./process-automation.component";
import {NewProcessAutomationComponent} from "./components/new-process-automation/new-process-automation.component";
import {EditProcessAutomationComponent} from "./components/edit-process-automation/edit-process-automation.component";
import {AuthGuard} from "../../_guard/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: ProcessAutomationComponent,
    canActivate: [AuthGuard],
    data: {permission: 'process'}
  },
  {
    path: 'new',
    component: NewProcessAutomationComponent,
    canActivate: [AuthGuard],
    data: {permission: 'process'}
  },
  {
    path: 'edit/:id',
    component: EditProcessAutomationComponent ,
    canActivate: [AuthGuard],
    data: {permission: 'process'}
  },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessAutomationRoutingModule { }
