import {SelectItemGroup} from "primeng/api";

export class MultiSelectItemType implements SelectItemGroup {

    constructor(public label:string, public value:string, public items: {title:string, value:number }[]) {
    }
}
