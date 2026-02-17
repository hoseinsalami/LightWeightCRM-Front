import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TabViewModule} from "primeng/tabview";
import {StepEventService} from "../../_services/step-event.service";
import {LoadingService} from "../../../_services/loading.service";
import {
  ChangeWorkItemStepActionUserInputDTO,
  SendSmsToCustomerActionUserInputDTO,
  CreateWorkItemActionInputDTO,
  CreateStepEventDTO,
  IStepEvent,
  IStepEventAction,
  IStepEventUI,
  ISteps, CreateActionDTO, IStepUI, StepEventActionType, IPlaceHolders, StepEventActionTypeEnum2LabelMapping
} from "../../_types/step-event.type";
import {ActivatedRoute, Router} from "@angular/router";
import {AccordionModule} from "primeng/accordion";
import {DropdownModule} from "primeng/dropdown";
import {DropdownChangeEvent} from "primeng/dropdown/dropdown.interface";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {FieldsetModule} from "primeng/fieldset";
import {InputTextModule} from "primeng/inputtext";
import {forkJoin} from "rxjs";
import {ConfirmationService} from "primeng/api";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {TooltipModule} from "primeng/tooltip";


@Component({
  selector: 'app-config',
  standalone: true,
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
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
    TooltipModule
  ]
})
export class ConfigComponent implements OnInit, AfterViewInit, AfterViewChecked{

  pathId: string;
  stepId: number;
  showDialog:boolean = false

  placeHolders: IPlaceHolders[] = []
  steps:IStepUI[] = [];
  events:IStepEventUI[] = [];
  selectedEvent:any = null;
  StepEventActionType = StepEventActionType
  StepEventActionTypeEnum2LabelMapping = StepEventActionTypeEnum2LabelMapping
  options=[
    { title:'ارسال پیام', value: 0 },
    { title:'تغییر گام', value: 1 },
    { title:'ایجاد معامله در کاریز', value: 2 },
    { title:'ارسال لینک نظرسنجی به مشتری', value: 3 },
  ]

  selectedEventIndex: number = 0; // event فعلی
  previousStepIndex: number = 0; // step فعلی

  markerY = '0px';
  @ViewChildren('eventTab') eventTabs!: QueryList<ElementRef<HTMLDivElement>>;
  constructor(
    private service: StepEventService,
    private confirmationService: ConfirmationService,
    private loading: LoadingService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.pathId = this.activeRoute.snapshot.params['pathId'];
    this.stepId = this.activeRoute.snapshot.params['stepId'];
  }

  ngOnInit() {
    // this.loadStepsAndEvents(this.pathId);
    this.getListOfSteps(this.pathId)
    this.getListOfEvents()
    this.getListOfPlaceHolders();
  }

  ngAfterViewInit() {
    this.updateMarkerY()
  }

  ngAfterViewChecked() {
    this.updateMarkerY()
  }

  updateMarkerY() {
    if (this.selectedEventIndex === null) {
      this.markerY = '0px';
      return;
    }
    const tabsArray = this.eventTabs.toArray() || [];
    const tab = tabsArray[this.selectedEventIndex];
    if (!tab) {
      this.markerY = '0px';
      return;
    }
    const newY = `${tab.nativeElement.offsetTop}px`;
    if (newY !== this.markerY) {
      this.markerY = newY;
      this.cdr.detectChanges();
    }
  }

  markerTranslateY() {
    if (this.selectedEventIndex === null) return '0px';
    const tabsArray = this.eventTabs?.toArray() || [];
    const tab = tabsArray[this.selectedEventIndex];
    if (!tab) return '0px';
    return `${tab.nativeElement.offsetTop}px`;
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
     this.service.getEvents().subscribe({
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

  // loadStepsAndEvents(stepId: string) {
  //   this.loading.show();
  //
  //   forkJoin({
  //     steps: this.getListOfSteps(stepId),
  //     events: this.getListOfEvents()
  //   }).subscribe({
  //     next: ({ steps, events }) => {
  //       this.loading.hide();
  //       this.events = events
  //
  //       // 👇 ترکیب steps و events
  //       this.steps = steps.map(step => ({
  //         ...step,
  //         events: events.map(e => ({
  //           ...e,
  //           actions: []
  //         })),
  //         selectedEventIndex: 0
  //       }));
  //       console.log(this.steps)
  //
  //       // اکشن های اولین event
  //       this.getDataActions(this.steps[0],this.steps[0].events[0].name, 0)
  //       // this.steps.forEach((step, stepIndex) => {
  //       //   if (step.events.length > 0) {
  //       //     const firstEvent = step.events[0];
  //       //     this.getDataActions(step, firstEvent.name, 0); // index = 0 برای اولین event
  //       //   }
  //       // });
  //
  //     },
  //     error: err => {
  //       this.loading.hide();
  //       console.error(err);
  //     }
  //   });
  // }

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


  onchangeAction(eventItem: IStepEventAction, actionType: number) {
    let data;
    switch (actionType) {
      case 0: // ارسال پیام
        data = { message: '' } as SendSmsToCustomerActionUserInputDTO;
        break;

      case 1: // تغییر گام
        data = { stepId: null } as ChangeWorkItemStepActionUserInputDTO;
        break;

      case 2: // ایجاد معامله
        data = { title:null, description: null, stepId:null, pathId: +this.pathId } as CreateWorkItemActionInputDTO;
        break;

        case 3: // ارسال لینک نظرسنجی به مشتری
        data = { description: null, stepId:null } as CreateWorkItemActionInputDTO;
        break;
    }

    eventItem.data = data
    eventItem.type = actionType;
    console.log(this.selectedEvent)

    // const existingIndex = eventItem.actions.findIndex(a => a.type === actionType);
    //
    // if (existingIndex !== -1) {
    //   // 🔄 جایگزینی اکشن موجود با اکشن جدید
    //   eventItem.actions[existingIndex] = { type: actionType, data };
    // } else {
    //   // 📌 افزودن اکشن جدید (اگر اکشنی با این نوع وجود نداشت)
    //   eventItem.actions.push({ type: actionType, data });
    // }

    // eventItem.actions.push({
    //   type: actionType,
    //   data
    // });
  }


  getDataActions(step:IStepUI, eventName:string,eventIndex:number){
  //   this.loading.show();
  //   const ACTION_TYPE_MAP = {
  //     'SendSmsToCustomerActionRequest': 0,
  //     'ChangeWorkItemStepActionRequest': 1,
  //     'CreateWorkItemActionRequest': 2,
  //   };
  //   this.service.getStepEventActions(step.id, eventName).subscribe({
  //     next: (out) => {
  //       this.loading.hide();
  //       step.events[eventIndex].id = out.id
  //       step.events[eventIndex].actions = out?.actions?.map(a =>({
  //         id: a.id,
  //         type: ACTION_TYPE_MAP[a.name],
  //         data: {
  //           ...a.input || {},
  //           message: a.input?.message ? this.convertMessageToUI(a.input.message) : a.input.message
  //         }
  //       }))
  //     },
  //     error: (err) =>{
  //       this.loading.hide();
  //     }
  //   })
  }

  getDataActionsStep(){
    this.loading.show();
    const ACTION_TYPE_MAP = {
      'SendSmsToCustomerActionRequest': 0,
      'ChangeWorkItemStepActionRequest': 1,
      'CreateWorkItemActionRequest': 2,
    };
    this.service.getStepEventActions(this.stepId).subscribe({
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

  saveStepEvent(step: IStepUI, event: IStepEventUI, callback?: ()=>void) {
    const ACTION_TYPE_MAP = {
      0: 'SendSmsToCustomerActionRequest',
      1: 'ChangeWorkItemStepActionRequest',
      2: 'CreateWorkItemActionRequest',
    };
    this.confirmationService.confirm({
      header: 'ذخیره',
      message: 'آیا از انجام ذخیره اطمینان دارید؟',
      accept: () => {
        const dto = new CreateStepEventDTO({});
        dto.stepId = step.id;
        dto.eventName = event.name;
        // dto.id = event.id;
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
        this.service.updateStepEvent(dto).subscribe({
          next: (out) =>{
            this.loading.hide();
            event.actions = [];
            if (callback) callback();
            console.log(step)
          },
          error: (err)=>{
            this.loading.hide();
          }
        })

      },

      reject: ()=>{
        event.actions = [];
        if (callback) callback();
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
    };
    const dto = new CreateStepEventDTO({});
    dto.stepId = this.stepId;
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

  saveCurrentEvent(step: IStepUI) {
    const currentIndex = step.selectedEventIndex;
    const currentEvent = step.events[currentIndex];
    this.selectEvent(step, currentIndex);
  }

  selectEvent(step: IStepUI, index: number) {
    this.selectedEventIndex = index;
    this.updateMarkerY()
    // if (step.selectedEventIndex === index) return;

    const prevEvent = step.events[step.selectedEventIndex];
    const nextEvent = step.events[index];

    this.saveStepEvent(step, prevEvent, ()=>{
      this.getDataActions(step,nextEvent.name, index);
      step.selectedEventIndex = index;
    })
  }

  onStepChange(event: any) {
    const newStepIndex = event.index;
    const prevStep = this.steps[this.previousStepIndex];
    const prevEvent = prevStep.events[prevStep.selectedEventIndex];

    // ذخیره event فعلی قبل از تغییر step
    this.saveStepEvent(prevStep, prevEvent, () => {
      // بعد از ذخیره، step جدید را فعال کن
      const nextStep = this.steps[newStepIndex];
      nextStep.selectedEventIndex = 0;

      // اگر step جدید حداقل یک event داشته باشه، اولین event را load کن
      if (nextStep.events.length > 0) {
        const firstEvent = nextStep.events[0];
        this.getDataActions(nextStep, firstEvent.name, 0);
      }
      this.previousStepIndex = newStepIndex
    });
    this.selectedEventIndex = 0
  }

  addActionCard(event: IStepEventUI) {
    if (!event.actions){
      event.actions = []
    }
    event.actions.push({
      type: null,
      data: {}
    });
  }

  removeActionCard(event: IStepEventUI, index: number) {
    event.actions.splice(index, 1);
  }


  appendPlaceholder(action: IStepEventAction, item: IPlaceHolders){
    const value = `<!${item.caption}!>`; // فرمت موردنظر شما
    if (!action.data.message) {
      action.data.message = value;
    } else {
      action.data.message += value;
    }
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



  cancel() {
    this.router.navigate(['./'], { relativeTo: this.activeRoute.parent })
  }


  openEventModal(event:any, state:'new'|'edit' , action?: IStepEvent,) {
    this.showDialog = true;
    if (state === 'new') {

      // ساخت مدل خالی برای مودال
      this.selectedEvent = {
        id: null,
        name: event.name,
        actions: []
      };

      this.addActionCard(this.selectedEvent);

    } else {

      // clone برای جلوگیری از تغییر مستقیم
      this.selectedEvent = {
        ...event,
        actions: [structuredClone(action)]
      };

    }
  }


}
