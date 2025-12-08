import { Component } from '@angular/core';
import {Table, TableLazyLoadEvent} from "primeng/table";
import {BaseCrudService} from "../../_services/base-crud.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'app-base-list',
  templateUrl: './base-list.component.html',
  styleUrl: './base-list.component.scss',
  standalone:true
})
export class BaseListComponent<T> {

    tableLoading = true;
    many: T[] | undefined;
    totalRecords: number | undefined = 0;

    OnLazyLoad:BehaviorSubject<TableLazyLoadEvent> = new BehaviorSubject<TableLazyLoadEvent>({});

    lastConstruct:(input: Partial<T>) => T;
    lastTable?:Table;
    lastEvent:TableLazyLoadEvent;
    lastMethodName:string;
    lastOtherParam:object;

    constructor(
        private service: BaseCrudService,
        protected confirmationService: ConfirmationService,
        protected messageService: MessageService) {
    }

    lazyLoadData(construct :(input: Partial<T>) => T,
                    table?: Table,
                    event: TableLazyLoadEvent = {},
                    methodName: string = '',
                    otherParam: object = {}) {
        this.tableLoading = true;
        this.service.getItems<T>(construct,
            {
                first: event.first,
                rows: event.rows,
                sortOrder: event.sortOrder,
                sortField: event.sortField == undefined ? null : event.sortField,
                filters: table?.filters ? JSON.stringify(table.filters) : ''
            }, methodName, otherParam).subscribe(out => {
                this.totalRecords = out.totalRecords;
                this.many = this.convertItems(out.items);
                this.tableLoading = false;
                this.OnLazyLoad.next(event);
            },
            error =>{
                this.tableLoading = false;
            }
        );
        this.lastConstruct=construct;
        this.lastTable=table;
        this.lastEvent=event;
        this.lastMethodName=methodName;
        this.lastOtherParam=otherParam;
    }

    protected convertItems(items:T[]){
      return items;
    }

    deleteItem(id :number){
        this.confirmationService.confirm({
            header: 'حذف',
            message: 'آیا از انجام حذف اطمینان دارید؟',

            accept: () => {
                this.service.delete(id).subscribe({
                    next: () => {
                      this.messageService.add({
                            severity: 'success',
                            summary: 'موفق',
                            detail: 'حذف با موفقیت انجام شد.',
                        });
                        this.lazyLoadData(this.lastConstruct,this.lastTable,this.lastEvent,this.lastMethodName,this.lastOtherParam);
                    },
                    error: () => {
                        // this.messageService.add({
                        //     severity: 'error',
                        //     summary: 'خطا',
                        //     ticket-detail: 'حذف با خطا مواجه  شد',
                        // });
                    },
                });
            },
        });
    }
}
