import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {environment} from "../../../environments/environment";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {Observable} from "rxjs";
import {DynamicData, FieldFilterDescriptor, IEntities} from "../_types/filter.type";

@Injectable({
  providedIn: 'root'
})
export class FiltersService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'Management/Filter'
  constructor(private http: FatapHttpClientService) {
    super(http, '')
  }

  getEntities():Observable<IEntities[]>{
    return this.http.get(this.baseUrl + '/Entities')
  }

  getEntitiesFilterModel(entity:any): Observable<FieldFilterDescriptor[]>{
    return this.http.get(this.baseUrl + `/EntityFilterModel/${entity}`)
  }

  onRegisterFilter(input:any){
    return this.http.post(this.baseUrl ,input)
  }

}
