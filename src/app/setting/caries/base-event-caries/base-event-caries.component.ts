import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TabViewModule} from "primeng/tabview";
import {AccordionModule} from "primeng/accordion";
import {DropdownModule} from "primeng/dropdown";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {FieldsetModule} from "primeng/fieldset";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {TooltipModule} from "primeng/tooltip";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Menu, MenuModule} from "primeng/menu";
import {StepEventService} from "../../_services/step-event.service";
import {ConfirmationService, MenuItem} from "primeng/api";
import {LoadingService} from "../../../_services/loading.service";
import {
  ChangeWorkItemStepActionUserInputDTO, CreateActionDTO, CreateStepEventDTO, CreateWorkItemActionInputDTO,
  IGenericTitle,
  IPlaceHolders, IStepEvent, IStepEventAction,
  IStepEventUI,
  IStepUI, SendSmsToCustomerActionUserInputDTO,
  StepEventActionTypeEnum, StepEventActionTypeEnum2LabelMapping
} from "../../_types/step-event.type";

@Component({
  selector: 'app-base-event-caries',
  templateUrl: './base-event-caries.component.html',
  styleUrl: './base-event-caries.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    AccordionModule,
    DropdownModule,
    InputTextareaModule,
    InputTextModule,
    ButtonModule,
    FieldsetModule,
    TableModule,
    DialogModule,
    TooltipModule,
    RouterLink,
    MenuModule
  ]
})
export class BaseEventCariesComponent implements OnInit{

  pathId: string;
  pathInfo:IGenericTitle;


  placeHolders: IPlaceHolders[] = []
  documentPlaceHolders: IPlaceHolders[] = []
  steps:IStepUI[] = [];

  paths:IGenericTitle[] = [];
  survays:IGenericTitle[] = [];
  stepsByPath:IStepUI[] = [];



  events:IStepEventUI[] = [];
  selectedEvent:any = null;
  selectedEventId?:number;

  StepEventActionType = StepEventActionTypeEnum
  StepEventActionTypeEnum2LabelMapping = StepEventActionTypeEnum2LabelMapping

  options: MenuItem[] =[
    { label:'ارسال پیام', icon: 'pi pi-send',command: ()=> this.openDialog(0) },
    { label: 'تغییر گام', icon: 'pi pi-directions', command: () => this.openDialog(1) },
    { label: 'ایجاد معامله در کاریز',  icon: 'pi pi-briefcase', command: () => this.openDialog(2) },
    { label: 'ارسال لینک نظرسنجی به مشتری',  icon: 'pi pi-link',  command: () => this.openDialog(3) }
  ]

  showDialog: boolean = false
  @ViewChild('menu') menu: Menu;
  constructor(
    private service: StepEventService,
    private confirmationService: ConfirmationService,
    private loading: LoadingService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {
    this.pathId = this.activeRoute.snapshot.params['pathId'];
  }

  ngOnInit() {
    this.getListOfSteps(this.pathId)
    this.getListOfEvents()
    this.getListOfPlaceHolders();
    this.getListOfPath();

    this.getListOfSurvays();
  }

  getListOfSteps(pathId:string){
    this.loading.show();
    this.service.getSteps(pathId).subscribe({
      next: (out) => {
        this.loading.hide();
        this.steps = out;
      },
      error: (err) => {
        this.loading.hide();
      }
    })
  }

  getListOfEvents(){
    this.loading.show()
    this.service.getEvents("path").subscribe({
      next: (out)=>{
        this.loading.hide();
        this.events = out

        this.events = out.map(e => ({
          ...e,
          actions: [],
        }));
        console.log(this.steps)

        this.getDataActionsStep();
      },
      error: (err) => {
        this.loading.hide();
      }
    })
  }

  getListOfPlaceHolders(){
    this.loading.show();
    this.service.getPlaceholders().subscribe({
      next: (out) => {
        this.loading.hide();
        this.placeHolders = out
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  getDocumentPlaceHolders(id:number){
    this.loading.show();
    this.documentPlaceHolders = []
    this.service.getDocumentPlaceholders(id).subscribe({
      next:(out) =>{
        this.loading.hide();
        // this.documentPlaceHolders = out
        const newItems = out.map(item => ({ ...item }));

        // الحاق به placeHolders
        this.placeHolders = [...this.placeHolders, ...newItems];
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  getListOfPath(){
    this.loading.show()
    this.service.getPaths().subscribe({
      next: (out) =>{
        this.loading.hide();
        this.paths = out;
        this.pathInfo = out.find(item => item.id === +this.pathId )
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  getListOfSurvays(){
    this.loading.show();
    this.service.getSurvays().subscribe({
      next:(out) =>{
        this.loading.hide();
        this.survays = out
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  removeAction(id:number){
    this.loading.show();
    this.service.deleteAction(id).subscribe({
      next:(out) =>{
        this.loading.hide();
        this.getDataActionsStep()
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  onGetStepsByCaries(id:string){
    this.loading.show();
    this.stepsByPath = []
    this.service.getSteps(id).subscribe({
      next: (out) =>{
        this.loading.hide();
        this.stepsByPath = out;
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  getDataActionsStep(){
    this.loading.show();
    const ACTION_TYPE_MAP = {
      'SendSmsToCustomerActionRequest': 0,
      'ChangeWorkItemStepActionRequest': 1,
      'CreateWorkItemActionRequest': 2,
      'SendSurveyActionRequest': 3,
    };
    this.service.getStepEventActions(+this.pathId, "path").subscribe({
      next: (out) => {
        this.loading.hide();
        this.events.forEach(e => e.actions = []);

        out.forEach(item =>{
          const matchingEvents = this.events.filter(e => e.name === item.eventName);
          if (matchingEvents.length === 0) return;

          const newActions = item.actions?.map(a => ({
            id: a.id,
            eventId: item.id,
            type: ACTION_TYPE_MAP[a.name],
            data: {
              ...a.input,
              message: a.input?.message ? this.convertMessageToUI(a.input.message) : a.input?.message
            }
          })) || [];

          matchingEvents.forEach(e => {
            // e.id = item.id;
            e.actions.push(...newActions);
          });

        })

        console.log(this.events)

      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  saveCurrentEventDirect(event: IStepEventUI){
    console.log(event)
    console.log(this.selectedEvent)
    const ACTION_TYPE_MAP = {
      0: 'SendSmsToCustomerActionRequest',
      1: 'ChangeWorkItemStepActionRequest',
      2: 'CreateWorkItemActionRequest',
      3: 'SendSurveyActionRequest'
    };
    const dto = new CreateStepEventDTO({});
    dto.pathId = +this.pathId;
    dto.eventName = event.name;
    dto.id = event.actions[0].eventId ?? null;
    dto.actions = event.actions.map(action =>
      new CreateActionDTO({
        id: action.id,
        name: ACTION_TYPE_MAP[action.type],
        input: JSON.stringify({
          ...action.data,
          message: action.data.message ? this.convertMessageToBackend(action.data.message) : null
        })
      })
    );

    console.log('SAVE EVENT DTO:', dto);

    const isUpdate = event.actions.some(a => !!a.id);
    let service = isUpdate ? this.service.updateStepEvent(dto) : this.service.createStepEvent(dto)

    this.loading.show();
    service.subscribe({
      next: (out) =>{
        this.loading.hide();
        this.showDialog = false;
        this.getDataActionsStep();
      },
      error: (err)=>{
        this.loading.hide();
      }
    })
  }


  appendPlaceholder(action: IStepEventAction, item: IPlaceHolders,
                    field: 'title' | 'description' | 'message', selectedEvent:any){
    const value =  selectedEvent.name === 'Path_AddDocument_factor' || selectedEvent.name === 'Path_AddDocument_price' ? `<?${item.caption}?>` :`<!${item.caption}!>`;
    if (!action.data[field]) {
      action.data[field] = value;
    } else {
      action.data[field] += value;
    }
  }

  appendDocumentPlaceholder(action: IStepEventAction, item: IPlaceHolders, field: 'title' | 'description' | 'message'){
    const value = `<?${item.caption}?>`;
    if (!action.data[field]) {
      action.data[field] = value;
    } else {
      action.data[field] += value;
    }
  }


  openEventModal(event:any, state:'new'|'edit' , action?: IStepEvent,) {
    this.showDialog = true;
    if (state === 'new') {
      console.log(event)
      // ساخت مدل خالی برای مودال
      this.selectedEvent = {
        id: null,
        name: event.name,
        actions: []
      };

      // this.addActionCard(this.selectedEvent);
      console.log(this.selectedEvent)

    } else {
      if (event?.actions?.length) {
        event.actions.forEach(action => {
          if (action.type === 2) {          // type 2
            const pathId = action.data?.pathId;
            if (pathId) {
              this.onGetStepsByCaries(pathId);
            }
          }
        });
      }
      // clone برای جلوگیری از تغییر مستقیم
      this.selectedEvent = {
        ...event,
        actions: [structuredClone(action)]
      };

    }
  }

  openMenu(event, item, eventId?:number){
    this.menu.toggle(event)
    this.selectedEventId = eventId ?? null;
    this.selectedEvent = {
      id: null,
      name: item.name,
      actions: []
    };
  }

  openDialog(actionType: any) {
    // this.onchangeAction(this.selectedEvent.actions,event)
    if (!this.selectedEvent.actions) {
      this.selectedEvent.actions = [];
    }

    // یک اکشن جدید بسازید
    const newAction: IStepEventAction = {
      type: actionType,
      data: null
    };

    // مقداردهی data بر اساس نوع
    switch (actionType) {
      case 0: // ارسال پیام
        newAction.data = { message: '' } as SendSmsToCustomerActionUserInputDTO;
        break;
      case 1: // تغییر گام
        newAction.data = { stepId: null } as ChangeWorkItemStepActionUserInputDTO;
        break;
      case 2: // ایجاد معامله
        newAction.data = { title:null, description: null, stepId:null, pathId: null} as CreateWorkItemActionInputDTO;
        break;
      case 3: // نظرسنجی
        newAction.data = { message: null, surveyId:null } as CreateWorkItemActionInputDTO;
        break;
    }

    // اکشن جدید را به آرایه اضافه کنید
    this.selectedEvent.actions.push(newAction);
    if (this.selectedEventId) this.getDocumentPlaceHolders(this.selectedEventId)

    this.showDialog = true;
    console.log(this.selectedEvent)
  }

  // UI --> back
  convertMessageToBackend(msg:string){
    let res = msg;
    this.placeHolders.forEach(p =>{
      const uiPattern = `<!${p.caption}!>`;
      const backendPattern = `<!${p.name}!>`;
      res = res.replaceAll(uiPattern, backendPattern);
    });
    return res;
  }

  // BACK --> UI
  convertMessageToUI(message: string): string {
    let result = message;

    this.placeHolders.forEach(ph => {
      const backendPattern = `<!${ph.name}!>`;
      const uiPattern = `<!${ph.caption}!>`;
      result = result.replaceAll(backendPattern, uiPattern);
    });

    return result;
  }


}
