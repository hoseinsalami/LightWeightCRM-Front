export class EntityListType<T> {
    // totalRecords?: number;
    // items?: T[];

    public constructor(public totalRecords:number, public  items:T[]){
    }
}
