import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SurveyComponent} from "./survey.component";
import {AuthGuard} from "../../_guard/auth.guard";
import {EditSurveyComponent} from "./components/edit-survey/edit-survey.component";
import {NewSurveyComponent} from "./components/new-survey/new-survey.component";
import {NotfoundComponent} from "../../pages/notfound/notfound.component";
import {QuestionsComponent} from "./components/questions/questions.component";

const routes: Routes = [
  {
    path: '',
    component: SurveyComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'new',
    component: NewSurveyComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'edit/:id',
    component: EditSurveyComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'questions/:id',
    component: QuestionsComponent,
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
export class SurveyRoutingModule { }
