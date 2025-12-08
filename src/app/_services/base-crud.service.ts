import {HttpClient} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {environment} from "../../environments/environment";
import {EntityListType} from "../_types/entityList.type";
import {FatapHttpClientService} from "./fatap-http-client.service";
import {ServerResponseType} from "../_types/server-response.type";
import {GenericType} from "../_types/genericType.type";
import {IHaveConstructorInterface} from "../_interfaces/I-have-constructor.interface";


export  class BaseCrudService {
  public completeApiUrl = '';
  baseUrl = environment.apiUrl;

  protected constructor(
    private httpClient: FatapHttpClientService,
    //private httpClient: HttpClient,
    protected apiUrl: string) {
    this.completeApiUrl = this.baseUrl + apiUrl;
  }

    public create<T>(TClass: IHaveConstructorInterface<T> = null,//constructor :(input: Partial<T>) => T = null,
                     //resource: Partial<T> & { toJson: () => T }): Observable<T> {
                     resource: GenericType<T>): Observable<T> {
        return this.httpClient
            //.extendedPost<T>(`${this.baseUrl + this.apiUrl}`, resource.toJson())
            .post<T>(`${this.baseUrl + this.apiUrl}`, resource.toJson())
            .pipe(map((result) => TClass != null ? new TClass(result) : result));
    }

    public getItems<T>(constructor :(input: Partial<T>) => T,
                     input: object,
                     methodName: string,
                     otherParam: object) : Observable<EntityListType<T>> {
    return this.httpClient
      .post<EntityListType<T>>(`${this.baseUrl + this.apiUrl + methodName}`, input, otherParam)
      .pipe(map((result) => {
          let newItems: T[] = [];
          result.items.forEach(t => newItems.push(constructor(t)));
          return new EntityListType(result.totalRecords, newItems);
        }
      ));
    }

    public getDetail<T>(TClass: IHaveConstructorInterface<T>,//constructor :(input: Partial<T>) => T,
                        id: number): Observable<T> {
    return this.httpClient
        .get<T>(`${this.baseUrl + this.apiUrl}/${id}`)
        .pipe(map((result) => new TClass(result)),
      );
    }

    public update<TInput extends GenericType<TInput>>(resource: Partial<TInput>): Observable<void> {
    return this.httpClient
      .put<void>(`${this.baseUrl + this.apiUrl}/${resource.id}`, resource.toJson());
      // .pipe(tap(out => console.log(out)))
      // .pipe(map((result) => constructor != null ? constructor(result): result ));
    }

    public delete(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl + this.apiUrl}/${id}`);
    }
}

