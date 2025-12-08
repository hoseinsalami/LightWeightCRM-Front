import {Observable} from "rxjs";
import {EntityListType} from "../_types/entityList.type";

export interface IListService<T> {
    getItems(input: object, methodName: string, otherParam: object): Observable<EntityListType<T>>
}
