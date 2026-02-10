import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DocumentComponent} from "./document.component";
import {AuthGuard} from "../../_guard/auth.guard";
import {NewDocumentComponent} from "./components/new-document/new-document.component";
import {EditDocumentComponent} from "./components/edit-document/edit-document.component";
import {NotfoundComponent} from "../../pages/notfound/notfound.component";

const routes: Routes = [
  {
    path: '',
    component: DocumentComponent,
    canActivate: [AuthGuard],
    data: { permission: "everyOne" }
  },
  {
    path: 'new',
    component: NewDocumentComponent,
    canActivate: [AuthGuard],
    data: { permission: "everyOne"}
  },
  {
    path:'edit/:id',
    component: EditDocumentComponent,
    canActivate: [AuthGuard],
    data: { permission: "everyOne" }
  },
  { path: 'notfound' , component: NotfoundComponent},
  { path: '**', redirectTo: '/notfound'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentRoutingModule { }
