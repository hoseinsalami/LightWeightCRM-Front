import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {environment} from "../../../environments/environment";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {ShowAllQuestions, SurveyQuestions, SurveyType} from "../_types/survey.type";
import {Observable} from "rxjs";
import {OutType} from "../../_classes/base-list.manager";

@Injectable({
  providedIn: 'root'
})
export class SurveyService extends BaseCrudService {

  override baseUrl = environment.apiUrl + 'CRM/Survay';

  constructor(private http: FatapHttpClientService) {
    super(http , '')
  }

  postCreateSurvey(input:SurveyType){
    return this.http.post(this.baseUrl, input);
  }

  getQuestions(survayId:number, from?:number, rows?:number):Observable<OutType<{id:number, title}>>{
    const route = from && rows ? `/Questions/list/${survayId}?from=${from}&rows=${rows}` : `/Questions/list/${survayId}`
    return this.http.get(this.baseUrl + route)
  }

  getOneQuestion(questionId:number):Observable<SurveyQuestions>{
    return this.http.get(this.baseUrl + `/Questions/${questionId}`)
  }

  postQuestion(input: SurveyQuestions){
    return this.http.post(this.baseUrl + '/Questions', input);
  }

  putQuestion(input: SurveyQuestions){
    return this.http.put(this.baseUrl + '/Questions', input);
  }

  deleteQuestion(id:number){
    return this.http.delete(this.baseUrl + `/Questions/${id}`);
  }

  putChangeOrderQuestions(input:{ survayId:number, ids:number[] }){
    return this.http.put(this.baseUrl + '/Questions/ChangeOrder', input);
  }

  getPreviewQuestions(survayId:number):Observable<ShowAllQuestions>{
    return this.http.get(this.baseUrl+ `/show/${survayId}`)
  }

}
