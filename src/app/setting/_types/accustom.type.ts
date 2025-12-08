import {GenericType} from "../../_types/genericType.type";

export class AccustomType extends GenericType<AccustomType>{

  title?:string;

  constructor(model?:Partial<AccustomType>) {
    super(model);
  }
}

//
// export class AccustomTypeCreate extends AccustomType{
//
//   constructor(model?: Partial<AccustomTypeCreate>) {
//     super(model);
//   }
// }
//
// export class AccustomTypeUpdate extends AccustomType{
//
//   constructor(model?: Partial<AccustomTypeUpdate>) {
//     super(model);
//   }
// }
//
// export class AccustomTypeDetail extends AccustomType{
//
//   constructor(model?: Partial<AccustomTypeDetail>) {
//     super(model);
//   }
// }
