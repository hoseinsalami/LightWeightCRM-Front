import {GenericType} from "../../_types/genericType.type";
import {WorkItemType} from "../../path/_types/create-work-item.type";
import {TicketStateEnum} from "../../_enums/ticket-state.enum";

export class CreateTenantTicketDTO extends GenericType<CreateTenantTicketDTO>{
  title?: string;
  description?: string;
  attachments?: string[];
  createDateTime?:any;
  state?: TicketStateEnum
  constructor(model?: Partial<CreateTenantTicketDTO>) {
    super(model);
  }

}


export class EditTenantTicketDTO extends GenericType<EditTenantTicketDTO>{
  conversations: ConversationsType[];
  createDateTime?: any;
  title?: string;
  constructor(model?: Partial<EditTenantTicketDTO>) {
    super(model);

    if (model.conversations) {
      this.conversations = model.conversations.map(w => { return new ConversationsType(w) });
    } else {
      this.conversations = [];
    }

  }
}

export class ConversationsType extends GenericType<ConversationsType>{
  attachments?: string[];
  content?: string;
  createDateTime?:any;
  tenantTitle?:string;
  constructor(model?: Partial<ConversationsType>) {
    super(model);
  }
}
