import {Table, TableLazyLoadEvent} from "primeng/table";
import {LazyLoadEvent} from "primeng/api";
import {Observable} from "rxjs";

interface SService<CustomType> {
  getAll(input: object, methodName: string, otherParam: object): Observable<OutType<CustomType>>
}

export interface OutType<custom> {
  totalRecords?: number;
  items?: custom[];
}

export  interface CostumeLazyLoadEvent extends TableLazyLoadEvent {
  searchCriteria?: any
}

export class BaseEditManager<ServiceName extends SService<TypeOut>, TypeOut> {

  tableLoading = true;
  many: TypeOut[] | undefined;
  // single = new TypeOut()
  totalRecords: number | undefined = 0;

  constructor(private allService: ServiceName) {
  }

  createInstance<TypeOut>(type: { new(input: TypeOut): TypeOut }, input: TypeOut): TypeOut {
    return new type(input);
  }


  lazyLoadData(table?: Table, event: CostumeLazyLoadEvent = {}, methodName: string = '', otherParam: object = {}) {

    this.tableLoading = true;
    this.allService.getAll(
      {
        'searchCriteria': event.searchCriteria,
        'first': event.first,
        'rows': event.rows,
        'sortOrder': event.sortOrder,
        'sortField': event.sortField == undefined ? null : event.sortField,
        'filters': table?.filters ? JSON.stringify(table.filters) : ''
      }, methodName, otherParam).subscribe(out => {
      // console.log(out);
      this.totalRecords = out.totalRecords;
      // out.items?.forEach(t=> this.many?.push(this.createInstance({TypeOut},t)))
      this.many = out.items;
      // this.many?.forEach((t)=> console.log(t.persianTitle()))
      this.tableLoading = false;
    });

  }

}
