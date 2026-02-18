import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {environment} from "../../../environments/environment";
import {
  CreateStepEventDTO,
  IGenericTitle,
  IPlaceHolders,
  IStepEvent,
  IStepEventUI,
  ISteps,
  IStepUI
} from "../_types/step-event.type";
import {Observable} from "rxjs";
import {EntityListType} from "../../_types/entityList.type";

@Injectable({
  providedIn: 'root'
})
export class StepEventService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'Management/StepEvent';

  constructor(private http: FatapHttpClientService) {
    super(http,'')
  }

  createStepEvent(input: CreateStepEventDTO){
    return this.http.post(this.baseUrl , input);
  }

  updateStepEvent(input: CreateStepEventDTO){
    return this.http.put(this.baseUrl , input);
  }

  deleteAction(id){
    return this.http.delete(this.baseUrl + `/${id}`);
  }

  getPaths():Observable<IGenericTitle[]>{
    return this.http.get(this.baseUrl + '/paths')
  }

  getSteps(pathId:string):Observable<IStepUI[]>{
    return this.http.get(this.baseUrl + `/Steps/${pathId}`)
  }

  getEvents(type:'path'|'step'):Observable<IStepEventUI[]>{
    const url = type === 'path' ? '/events/path' : '/events/step'
    return this.http.get(this.baseUrl + url)
  }

  getStepEventActions(id:number, type:'path'|'step'):Observable<CreateStepEventDTO[]>{
    const url = type === 'path' ? `/Actions?pathId=${id}` : `/Actions?stepId=${id}`
    return this.http.get(this.baseUrl + url);
  }


  getPlaceholders(): Observable<IPlaceHolders[]>{
    return this.http.get(this.baseUrl + '/PlaceHolders');
  }

  getSurvays():Observable<IGenericTitle[]>{
    return this.http.get(this.baseUrl + '/survays')
  }


}
