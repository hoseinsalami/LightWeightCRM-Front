import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {environment} from "../../../environments/environment";
import {map, Observable} from "rxjs";
import {EntityListType} from "../../_types/entityList.type";

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'Crm/Document';

  constructor(private http : FatapHttpClientService,) {
    super(http,'')
  }

  getDocItems<T>(input: object,
              methodName: string, otherParam: object) : Observable<EntityListType<T>> {
    return this.http.post<EntityListType<T>>(`${this.baseUrl + this.apiUrl + methodName}`, input, otherParam)
      // .pipe(map((result) => {
      //     let newItems: T[] = [];
      //     result.items.forEach(t => newItems.push(t));
      //     return new EntityListType(result.totalRecords, newItems);
      //   }
      // ));
  }


  getListOfDocument(){
    return this.http.get(this.baseUrl + 'list')
  }




}
