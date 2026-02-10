import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AgentComponent} from "./agent.component";
import {AuthGuard} from "../../_guard/auth.guard";
import {NotfoundComponent} from "../../pages/notfound/notfound.component";
import {NewAgentComponent} from "./components/new-agent/new-agent.component";
import {EditAgentComponent} from "./components/edit-agent/edit-agent.component";

const routes: Routes = [
  {
    path: '', component: AgentComponent,
    canActivate:[AuthGuard],
    data:{ permission: 'everyOne' }
  },
  {
    path: 'new', component: NewAgentComponent,
    canActivate:[AuthGuard],
    data:{ permission: 'everyOne' }
  },
  {
    path: 'edit/:id', component: EditAgentComponent,
    canActivate:[AuthGuard],
    data:{ permission: 'everyOne' }
  },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentRoutingModule { }
