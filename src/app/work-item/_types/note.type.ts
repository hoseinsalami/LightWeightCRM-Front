import {GenericType} from "../../_types/genericType.type";
import {UserTypeBase} from "../../setting/_types/user.type";
import {AttachmentType} from "../../_types/create-activity.type";

export class NoteType extends GenericType<NoteType>{
  content?: string;
  // یکی از این دو مقدا زیر میتواند value داشته باشد
  customerId?: number;
  workItemId?: number;
  userId?:number;
  user?: UserTypeBase;
  attachments?: AttachmentType[];
  thirdPartyEmployeeFullName?: string;

  constructor(model?: Partial<NoteType>) {
    super(model)

    if (model?.attachments){
      this.attachments = model.attachments.map( c => {return  new AttachmentType(c)});
    }

    if (model.user){
      this.user = new UserTypeBase(model.user)
    } else {
      this.user = new UserTypeBase({})
    }

  }

}
