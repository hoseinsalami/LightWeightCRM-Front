import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {AccustomType} from "../_types/accustom.type";

@Injectable({
  providedIn: 'root'
})
export class AccustomService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'Management/AccustomMethod'

  constructor(private http: FatapHttpClientService) {
    super(http , '')
  }

  onGetAccustomList():Observable<AccustomType>{
    return this.http.get<AccustomType>(this.baseUrl)
  }
}
