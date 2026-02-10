import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {environment} from "../../../environments/environment";
import {CreateStepEventDTO, IPlaceHolders, IStepEvent, IStepEventUI, ISteps} from "../_types/step-event.type";
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

  getSteps(pathId:string):Observable<ISteps[]>{
    return this.http.get(this.baseUrl + `/Steps/${pathId}`)
  }

  getEvents():Observable<IStepEventUI[]>{
    return this.http.get(this.baseUrl + '/events')
  }

  getStepEventActions(stepId:number,eventName:string):Observable<CreateStepEventDTO>{
    return this.http.get(this.baseUrl + `/Actions/${stepId}?eventName=${eventName}`);
  }


  getPlaceholders(): Observable<IPlaceHolders[]>{
    return this.http.get(this.baseUrl + '/PlaceHolders');
  }

}
