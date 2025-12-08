import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownChangeEvent, DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {DividerModule} from "primeng/divider";
import {StepperModule} from "primeng/stepper";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputSwitchModule} from "primeng/inputswitch";
import {Utilities} from "../../_classes/utilities";
import {ActionTypesEnum, ActionTypesEnumEnum2LabelMapping} from "../../_enums/action-types.enum";
import {EventTypesEnum, EventTypesEnum2LabelMapping} from "../../_enums/event-types-enum";
import {LoadingService} from "../../_services/loading.service";
import {ProcessAutmationService} from "../_services/process-autmation.service";
import {CustomMessageService} from "../../_services/custom-message.service";
import {
  ActionModel,
  ChangeStep,
  CreateProcessType,
  IActionParameter,
  IAppAction, IEvent, ProcessTypeBase,
  SendSms
} from "../_types/CreateProcess.type";
import {TreeSelectModule} from "primeng/treeselect";
import {ProcessEntityEnum} from "../../_enums/process-entity.enum";
import {map} from "rxjs";
import {DialogModule} from "primeng/dialog";
import {IActiveDate, NgPersianDatepickerModule} from "ng-persian-datepicker";
import {MultiSelectModule} from "primeng/multiselect";
import {
  FieldFilterDescriptor,
  FilterField,
  FilterGroup,
  IFilterParameters,
  ValuePathAccess
} from "../_types/filter.type";
import {RadioButtonModule} from "primeng/radiobutton";
import {TabViewModule} from "primeng/tabview";
import {FieldsetModule} from "primeng/fieldset";
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {OrderListModule} from "primeng/orderlist";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import {BaseListComponent} from "../../shared/base-list/base-list.component";
import {CreatePathType} from "../_types/createPath.type";


type FieldType = 'string' | 'number' | 'boolean' | 'datetime' | 'enum' | 'object' | 'array';
type ModalType = 'action' | 'tree';

interface FilterCondition {
  value?: any;
  matchMode?: string;
  operator?: string;
}

interface FilterNode {
  key: string;         // معادل انگلیسی
  label: string;       // معادل فارسی
  fullLabel: string;       // اسم پدر(اسم فرزند)
  fullPath: string;
  isLeaf: boolean;
  type?: FieldType;
  enumOptions?: string[];
  values?: any[];
  children?: FilterNode[];
  expanded?: boolean;
  conditions?: FilterCondition[];
  filter?: FilterGroup[];
  selectedValue?: any;
  parent?: FilterNode;
}


interface ActionFilterModal {
  id: string;
  visible: boolean;
  parameters: any[];
  filterGroup: FilterGroup
  outputValuePath?:any;
  selectedParamRadio?:string;

  parentModalId?: string;
  parentModalType?: ModalType;
}

export interface ITreeNodeModal {
  id: string;                        // شناسه یکتا برای هر مودال
  visible: boolean;                  // وضعیت باز/بسته بودن مودال
  entityData: any[];                 // داده درختی که داخل مودال نمایش داده میشه
  selectedNodeFullPath?: string | null;     // مسیر نود انتخاب‌شده
  parentModalId?: string,
  dataActionModalId?: any;
  dataAction?:any
  modalTreeNodeOutPut?:any;


  fullLabel?: string;
  parentModalType?: ModalType;
}



@Component({
  selector: 'app-process-automation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    TooltipModule,
    DividerModule,
    StepperModule,
    InputTextareaModule,
    InputSwitchModule,
    TreeSelectModule,
    DialogModule,
    RadioButtonModule,
    NgPersianDatepickerModule,
    MultiSelectModule,
    TabViewModule,
    FieldsetModule,
    ToolbarModule,
    SharedModule,
    TableModule,
    RouterLink,
    OrderListModule,
    JalaliDatePipe,
    DividerModule
  ],
  templateUrl: './process-automation.component.html',
  styleUrl: './process-automation.component.scss'
})
export class ProcessAutomationComponent extends BaseListComponent<CreateProcessType> implements OnInit{

  @ViewChild('sendDateTimeInput') sendDateTimeInput!: ElementRef<HTMLInputElement>;
  listProcess:ProcessTypeBase[] = []
  oneObject: CreateProcessType = new CreateProcessType({})
  listOfEvent: IEvent[];
  oneObjectSendSms: SendSms = {}

  treeNodes: FilterNode[] = [];
  selectedFilterTreeNodes: FilterNode;
  actionBlocks: IAppAction[] = [];


  finishDate!: string;
  finishDateTimeControl: FormControl[][]= []

  booleanOptions = [
    { label: 'درست', value: true },
    { label: 'غلط', value: false }
  ];

  matchModeOptions = [
    { label: 'شامل باشد', value: 'contains' },
    { label: 'برابر باشد', value: 'equals' },
    { label: 'برابر نباشد', value: 'notEquals' },
    { label: 'شروع شود با', value: 'startsWith' },
    { label: 'پایان یابد با', value: 'endsWith' },

    //  مخصوص تاریخ
    { label: 'قبل از تاریخ', value: 'dateBefore' },
    { label: 'بعد از تاریخ', value: 'dateAfter' },

    //  مخصوص اعداد
    { label: 'کمتر از', value: 'lt' },
    { label: 'کمتر یا مساوی', value: 'lte' },
    { label: 'بیشتر از', value: 'gt' },
    { label: 'بیشتر یا مساوی', value: 'gte' }
  ];

  operatorOptions = [
    { label: 'و', value: 'and' },
    { label: 'یا', value: 'or' }
  ];

  actionTypeOptions = [];
  filterActionsInput:Record<number, FieldFilterDescriptor[]> = {};

  // eventTypesOptions = []
  eventFilterOptions = []

  dialogEventParameters = []

  showEventFilterModal:boolean = false
  showActionFilterModal:ActionFilterModal[] = []
  // selectedParamRadio: 'value' | 'parameter' = 'value';
  triggerEventParameter:any;
  triggerEventEntity: string = ''

  // showEntityModal:boolean = false;
  treeNodeModals:ITreeNodeModal[]= [];
  // entitydata:FilterNode[] = []


  treeValues: string[] = [];

  showDateModal:boolean = false
  dateTimeMode: string = '';
  // نگه داشتن ایندکس بلاک و فیلدی که مودال تاریخ برایش باز شده
  selectedDateContext: { blockIndex: number; fieldIndex: number } | null = null;

  paginationData = { from: 0, rows: 20, hasMore: true}
  constructor(
    private processService: ProcessAutmationService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private loading: LoadingService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
    ) {
    super(processService, confirmationService, messageService);
  }

  construct(input: CreateProcessType){
    return new CreateProcessType(input)
  }

  ngOnInit() {
    // this.addActionBlock()
    // this.onGetActionData();
    // this.getListOfEvent();
    this.getListOfProccess()

  }

//   getListOfEvent(){
//     this.loading.show();
//     this.service.getEvents().subscribe({
//       next: (out) =>{
//         this.loading.hide();
//         this.listOfEvent = out
//       },
//       error: (err) =>{
//         this.loading.hide();
//       }
//     })
//   }
//
//
//
//   buildTreeFromDescriptors(fields: FieldFilterDescriptor[], parentPath: string = ''): FilterNode[] {
//     return fields.map(f => {
//       const fullPath = parentPath ? `${parentPath}.${f.field}` : f.field || '';
//       let filter: FilterGroup[] | undefined = undefined;
//       if (f.filterParameter?.length) {
//         filter = f.filterParameter.map(fp => fp.filter!).filter(fg => !!fg); // فقط فیلترهای موجود
//       }
//
//       // اگر اسکالر بود
//       if (['string', 'number', 'datetime', 'boolean'].includes(f.type || '')) {
//         return {
//           key: f.field || '',
//           label: f.label || f.field || '',
//           fullLabel: '',
//           fullPath,
//           isLeaf: true,
//           type: f.type as FieldType,
//           conditions: [
//             { value: null, matchMode: this.getDefaultMatchMode(f.type), operator: 'and' }
//           ],
//           filter
//         };
//       }
//
//       // اگر Object بود
//       if (f.type === 'object') {
//         return {
//           key: f.field || '',
//           label: f.label || f.field || '',
//           fullLabel: '',
//           fullPath,
//           isLeaf: false,
//           type: f.type as FieldType,
//           children: this.buildTreeFromDescriptors(f.subFields || [], fullPath),
//           expanded: false,
//           filter
//         };
//       }
//
//       // اگر Array بود
//       if (f.type === 'array') {
//         // استخراج گزینه‌های dropdown از filterParameter
//         const dropdownValues =
//           f.filterParameter?.flatMap(fp =>({
//             label: fp.filter.label,
//             value: fp
//             }) ?? []
//           ) ?? [];
//
//
//         return {
//           key: f.field || '',
//           label: f.label || f.field || '',
//           fullLabel: '',
//           fullPath,
//           isLeaf: false,
//           type: f.type as FieldType,
//           values: dropdownValues, // برای dropdown
//           children: this.buildTreeFromDescriptors(f.subFields || [], fullPath),
//           expanded: false,
//           filter
//         };
//       }
//
//       return {
//         key: f.field || '',
//         label: f.label || f.field || '',
//         fullLabel: '',
//         fullPath,
//         isLeaf: true,
//         type: 'string',
//         conditions: [{ value: null, matchMode: 'contains', operator: 'and' }],
//         filter
//       };
//     });
//
//   }
//
//   getDefaultMatchMode(type?: string): string {
//     switch (type) {
//       case 'boolean': return 'equals';
//       case 'datetime': return 'dateBefore';
//       case 'number': return 'equals';
//       default: return 'contains';
//     }
//   }
//
//   clickRadioButton(node: any, modal: ITreeNodeModal) {
//     modal.selectedNodeFullPath = node.fullPath;
//     this.clearUnrelatedDropdownSelections(modal.entityData, node.fullPath)
//   }
//
//   clearUnrelatedDropdownSelections(nodes: FilterNode[] = [], selectedFullPath: string) {
//     const isAncestor = (ancestorFullPath: string, descendantFullPath: string): boolean => {
//       if (!ancestorFullPath) return false;
//       const prefix = ancestorFullPath.endsWith('.') ? ancestorFullPath : ancestorFullPath + '.';
//       return descendantFullPath.startsWith(prefix);
//     };
//
//     // تابع کمکی داخلی: پاک‌کردن انتخاب‌ها برای یک نود و تمام فرزندانش
//     const clearSelectionsRecursively = (n: FilterNode) => {
//       n.selectedValue = null;
//       if (n.children?.length) {
//         for (const child of n.children) clearSelectionsRecursively(child);
//       }
//     };
//
//     for (const node of nodes) {
//       // اگر این نود dropdown داره (دارای values)
//       if (node.values?.length) {
//         // اگر selectedFullPath در شاخه این نود نیست → پاکش کن
//         if (!isAncestor(node.fullPath, selectedFullPath)) {
//           clearSelectionsRecursively(node);
//           continue; // از این شاخه خارج شو چون پاک شده
//         }
//       }
//
//       // ادامه بررسی برای فرزندان
//       if (node.children?.length) {
//         this.clearUnrelatedDropdownSelections(node.children, selectedFullPath);
//       }
//     }
//   }
//
//
//
//
//   onGetActionData(){
//     this.loading.show();
//     this.service.getActionData().subscribe({
//       next: (out)=>{
//         this.loading.hide()
//         this.actionTypeOptions = out
//       },
//       error: (err) =>{
//         this.loading.hide();
//       }
//     })
//   }
//
//   onActionInput(event:any, index: number, ){
//     this.loading.show();
//     const entityEvent = this.triggerEventEntity ? this.triggerEventEntity : ''
//     this.service.getFilterInputData(event.value,entityEvent).subscribe({
//       next: (out) =>{
//         this.loading.hide();
//
//
//         const parameters = (out || []).map(f => ({
//           field: f.field,
//           type: f.type,
//           valueFormat: '',
//           filter: {},
//           valueParameters: []
//         }));
//         if (!this.actionBlocks[index]) {
//           this.actionBlocks[index] = { name: '', actionParameters: [] };
//         }
//
//         this.actionBlocks[index].name = event.value;
//         this.actionBlocks[index].actionParameters = parameters;
//
//         // this.actionBlocks.push({
//         //   name: event.value, // مقدار انتخابی جدید از dropdown
//         //   actionParameters: parameters
//         // });
//
//         // ساخت FormControl برای فیلدهای datetime در همین بلاک
//         this.finishDateTimeControl[index] = (out || []).map(f => new FormControl<string | null>(null));
//
//         // ذخیره فیلدها برای استفاده در ngFor
//         this.filterActionsInput[index] = out;
//
//
//       },
//       error: (err) =>{
//         this.loading.hide();
//       }
//     })
//   }
//
//   //blockIndex و fieldIndex
//   //برای فیلد تاریخ استفاده میشه که دیتا درست داخل input بشینه
//   getEntityData(param: any, type:ModalType = 'action', blockIndex?:number, fieldIndex?:number){
//     this.loading.show()
//     this.service.getEntityModel(this.triggerEventEntity).subscribe({
//       next: (out) =>{
//         this.loading.hide()
//         if (out){
//           // this.entitydata = this.buildTreeFromDescriptors(out);
//           const entityData = this.buildTreeFromDescriptors(out);
//
//           const activeActionModal = this.showActionFilterModal.find(m => m.visible);
//           const parentModalId = activeActionModal ? activeActionModal.id : null;
//           const indexKey = (typeof blockIndex !== 'undefined' && typeof fieldIndex !== 'undefined') ? `${blockIndex}_${fieldIndex}` : null; //
//           const modal: ITreeNodeModal = {
//             id: crypto.randomUUID(),
//             visible: true,
//             entityData: entityData,
//             selectedNodeFullPath: null,
//             parentModalId,
//             dataActionModalId: parentModalId,
//             dataAction: { ...param, indexKey },
//             parentModalType: type,
//           };
//
//           this.treeNodeModals.push(modal);
//           console.log(this.treeNodeModals)
//         }
//       },
//       error: (err) =>{
//         this.loading.hide()
//       }
//     })
//   }
//
//   onRadioSelect(type: 'value' | 'parameter', modal: ActionFilterModal) {
//     console.log(modal)
//     modal.parameters.forEach(param => {
//       if (modal.selectedParamRadio === 'parameter') {
//         param.value = '';
//       }
//     });
//   }
//
//   onEventData(event: any) {
//     console.log(event)
//     this.service.getDataJson(event.entity).subscribe({
//       next: (out) => {
//         this.loading.hide();
//         this.eventFilterOptions = out
//         this.oneObject.triggerEvent = event.name
//         this.triggerEventEntity = event.entity
//         // this.treeNodes = this.buildTreeFromSchema(nodes);
//         // console.log(this.treeNodes)
//       },
//       error: (err) =>{
//         this.loading.hide();
//       }
//     })
//
//   }
//
//   onEventFilterOptions(event: DropdownChangeEvent){
//     console.log(event.value)
//     const filterParam: IFilterParameters = event.value;
//     const parameters = filterParam.parameters ?? [];
//
//     const allConditions = this.collectConditions(filterParam.filter);
//
//     const matchedParams = allConditions.filter(c =>
//       parameters.some(p =>  p.name === c.parameter)
//     );
//
//     const uniqueConditions  = matchedParams.filter(
//       (cond, index, self) =>
//         index === self.findIndex(c => c.parameter === cond.parameter)
//     );
//
//
//     if (uniqueConditions.length){
//       this.showEventFilterModal = true;
//
//       this.dialogEventParameters = parameters
//         .filter(p => uniqueConditions.some(u => u.parameter === p.name))
//         .map(p => {
//           const cond = allConditions.find(c => c.parameter === p.name);
//           return {
//             ...p,
//             value: cond ? cond.value : '',
//             _targetFilter: filterParam.filter
//           };
//         });
//
//     }
//
//     console.log(this.dialogEventParameters)
//   }
//
//   collectConditions(group?: FilterGroup){
//     if (!group) return [];
//     let all = []
//
//     for (const f of group.filters) {
//       // اگر خودش conditions دارد، اضافه کن
//       if (f.conditions && f.conditions.length > 0) {
//         all.push(...f.conditions);
//       }
//
//       // اگر فیلترهای درونی دارد (زیرگروه)
//       if (f.filters && f.filters.length > 0) {
//         for (const sub of f.filters) {
//           all.push(...this.collectConditions(sub)); //  بازگشتی
//         }
//       }
//     }
//
//     return all
//   }
//
//   // ذخیره مقدار جدید در conditions به صورت بازگشتی
//   updateConditionValues(group: FilterGroup, param: any): void {
//     if (!group || !group.filters) return;
//
//     for (const f of group.filters) {
//       // اگر این فیلتر conditions دارد، بررسی کن
//       if (f.conditions && f.conditions.length > 0) {
//         for (const cond of f.conditions) {
//           if (cond.parameter === param.name) {
//             cond.value = param.value;
//           }
//         }
//       }
//
//       //  اگر فیلترهای درونی دارد (زیرگروه‌ها)
//       if (f.filters && f.filters.length > 0) {
//         for (const sub of f.filters) {
//           this.updateConditionValues(sub, param); //  بازگشتی
//         }
//       }
//     }
//   }
//
//   saveModalEvent(){
//     if (!this.dialogEventParameters?.length) return;
//
//     const targetFilter = this.dialogEventParameters[0]?._targetFilter;
//
//     // به‌روزرسانی همه مقادیر در ساختار بازگشتی
//     this.dialogEventParameters.forEach(param => {
//       this.updateConditionValues(targetFilter, param);
//     });
//
//     this.showEventFilterModal = false;
//
//     this.showEventFilterModal = false;
//     console.log('Updated filter:', targetFilter);
//     console.log('Updated filter:', this.dialogEventParameters);
//     localStorage.setItem('EventFilter', JSON.stringify(this.dialogEventParameters))
//   }
//
//   saveModalAction(modalId:string){
//     const modalIndex = this.showActionFilterModal.findIndex(m => m.id === modalId);
//     if (modalIndex === -1) return null;
//
//     const modal = this.showActionFilterModal[modalIndex];
//     const parameters = modal.parameters
//
//     const updateFilterValues = (filters: FilterField[], mode: 'value' | 'parameter', paramName:string, value: any, valuePath: ValuePathAccess | null) => {
//       filters.forEach(f => {
//         // conditions بررسی
//         if (f.conditions?.length) {
//           f.conditions.forEach(cond => {
//             if(cond.parameter === paramName){
//               if (mode === 'value') {
//                 cond.value = value;
//                 cond.valuePath = null;
//               } else if (mode === 'parameter') {
//                 cond.value = null;
//                 cond.valuePath = valuePath;
//               }
//             }
//           });
//         }
//         if (f.filters?.length) {
//           updateFilterValues(f.filters, mode, paramName, value, valuePath);
//         }
//       });
//     };
//
//     parameters.forEach(param => {
//       if (modal.selectedParamRadio === 'value') {
//         updateFilterValues(modal.filterGroup.filters, 'value', param.name, param.value, null);
//
//       }else if (modal.selectedParamRadio === 'parameter' ) {
//         const valuePath = modal.outputValuePath;
//         updateFilterValues(modal.filterGroup.filters, 'parameter',param.name, null, valuePath);
//
//       }
//
//     });
//     const actionResult = {...modal.outputValuePath, type: 'action'};
//     console.log('🟩 [saveModalAction] Action Result:', actionResult);
//
//     localStorage.setItem('actionFilter', JSON.stringify(modal))
//     console.log('ActionModal data saved:', modal);
//
//     if (modal.parentModalId && modal.parentModalType) {
//       if (modal.parentModalType === 'tree') {
//         const parentTreeModal = this.treeNodeModals.find(t => t.id === modal.parentModalId);
//         if (parentTreeModal) parentTreeModal.modalTreeNodeOutPut = actionResult
//         console.log('Found parent tree modal:', parentTreeModal);
//       }
//
//       else if (modal.parentModalType === 'action') {
//         const parentActionModal = this.showActionFilterModal.find(m => m.id === modal.parentModalId);
//         if (parentActionModal) parentActionModal.outputValuePath = actionResult;
//         // if (parentActionModal) parentActionModal.outputValuePath = actionResult;
//         console.log('Found parent tree modal:', parentActionModal);
//       }
//     }
//
//
//     // const relatedTreeModal = this.treeNodeModals.find(t => t.dataActionModalId === modal.id);
//     // if (relatedTreeModal) {
//     //   relatedTreeModal.modalTreeNodeOutPut = modal.outputValuePath;
//     // }
//
//     modal.outputValuePath = null;
//     modal.visible = false;
//     this.showActionFilterModal = this.showActionFilterModal.filter(m => m.id !== modalId);
//
//   }
//
//   treeNodeTextareaMap: Map<string, ValuePathAccess[]> = new Map();
//   saveTreeNodeModal(modal: ITreeNodeModal){
//     if (!modal.selectedNodeFullPath) return;
//
//     const selectedNode = this.findNodeByFullPath(modal.entityData, modal.selectedNodeFullPath);
//     const fullLabel = selectedNode.fullLabel
//     if (!selectedNode) return;
//
//     // 2. ساخت مسیر پدر از fullPath با حذف آخرین بخش
//     const full = selectedNode.fullPath || '';
//     const parts = full.split('.').filter(Boolean); // ['sender','customer','customerPhones','phoneNumber'] یا ممکنه بدون 'sender'
//     let field: string | null = null;
//     let path = '';
//     let filter = null;
//     let type = null;
//
//     const parentNode = this.findParentNodeObject(modal.entityData, full);
//     if (parentNode && parentNode.type === 'array') {
//       field = parts.pop() || null;
//       path = parts.join('.');
//       filter = parentNode?.filter;
//       type = parentNode.type;
//     } else {
//       // در غیر این صورت (مثل sender.title) field = null، و path کامل می‌مونه
//       field = null;
//       path = full;
//       filter = null;
//       type = parentNode?.type ? parentNode?.type : null
//     }
//     if (!path.startsWith('sender')) path = `sender.${path}`;
//
//     const valuePathAccess:ValuePathAccess = { path, field, filter };
//
//     const result = {...valuePathAccess, type};
//     modal.modalTreeNodeOutPut = result;
//
//     modal.fullLabel = fullLabel
//
//     if (modal.parentModalId && modal.parentModalType) {
//       if (modal.parentModalType === 'action'){
//         const parentActionModal = this.showActionFilterModal.find(m => m.id === modal.parentModalId);
//         if (parentActionModal) parentActionModal.outputValuePath = result;
//         console.log('Found parent tree modal:', parentActionModal);
//       } else if (modal.parentModalType === 'tree'){
//         const parentTreeModal = this.treeNodeModals.find(t => t.id === modal.parentModalId);
//         if (parentTreeModal) parentTreeModal.modalTreeNodeOutPut = result;
//         console.log('Found parent tree modal:', parentTreeModal);
//       }
//     }
//
//     if (!modal.parentModalId) {
//        if (modal.dataAction.field === 'message') this.treeValues.push(modal.fullLabel);  // textarea
//       // modal.array = [...(modal.array || []), result];
//       // this.treeNodeTextareaMap.push(result)
//       const fieldKey = modal.dataAction?.field
//       const existing = this.treeNodeTextareaMap.get(fieldKey) || [];
//
//       if (modal.dataAction?.type === 'datetime') {
//         this.displayDateMap.delete(modal.dataAction.indexKey)
//         this.displayDateMap.set(modal.dataAction.indexKey, fullLabel);
//         this.treeNodeTextareaMap.set(fieldKey, [result]);
//       } else {
//         this.treeNodeTextareaMap.set(fieldKey, [...existing, result]);
//       }
//
//
//       console.log(this.treeNodeTextareaMap)
//     }
//
//     // if (modal.parentModalId ) {
//     //   const parentActionModal = this.showActionFilterModal.find(m => m.id === modal.parentModalId);
//     //   if (parentActionModal) parentActionModal.outputValuePath = result;
//     // }
//
//     modal.visible = false
//     console.log('Result:', result);
//   }
//
//
//   findNodeByFullPath(nodes: FilterNode[], fullPath: string): FilterNode | null {
//     for (const node of nodes) {
//
//       if (node.fullPath === fullPath){
//         const fullLabel = node.children?.length ? node.label : node.label;
//         return { ...node, fullLabel };
//       }
//       if (node.children) {
//         const found = this.findNodeByFullPath(node.children, fullPath);
//         if (found){
//           const fullLabel = `${node.label}(${found.label})`
//           return { ...found, fullLabel };
//         }
//       }
//     }
//     return null;
//   }
//
//   findParentNodeObject(nodes: FilterNode[], targetFullPath: string, parentLabel: string = ''): FilterNode | null {
//     for (const node of nodes) {
//       const currentLabel = parentLabel ? `${parentLabel}(${node.label})` : node.label;
//
//       if (node.children?.some(child => child.fullPath === targetFullPath)) {
//         return { ...node, fullLabel: currentLabel }; // همین نود پدر است
//       }
//       if (node.children) {
//         const found = this.findParentNodeObject(node.children, targetFullPath, currentLabel );
//         if (found) return found;
//       }
//     }
//     return null;
//   }
//
//   @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;
//   insertAtCursor(event: any){
//     console.log(event)
//     const textarea = this.textareaRef.nativeElement;
//     const textToInsert = `<!${event}!>`;
//
//     // موقعیت فعلی کرسر
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//
//     // متن قبلی
//     const before = textarea.value.substring(0, start);
//     const after = textarea.value.substring(end);
//
//     // قرار دادن متن جدید بین before و after
//     textarea.value = before + textToInsert + after;
//
//     // به‌روزرسانی موقعیت کرسر بعد از درج متن
//     const newCursorPos = start + textToInsert.length;
//     textarea.selectionStart = textarea.selectionEnd = newCursorPos;
//
//     // تریگر کردن change برای [(ngModel)] در صورت وجود
//     textarea.dispatchEvent(new Event('input'));
//
//   }
//
//
//
//
//   addActionBlock(block?:IAppAction) {
//     const blockIndex = this.actionBlocks.length;
//
//     if (!this.finishDateTimeControl[blockIndex]) {
//       this.finishDateTimeControl[blockIndex] = [];
//     }
//
//     const fields = this.filterActionsInput[blockIndex - 1] || [];
//
//     const parameters = fields.map((f, index) => {
//       // کنترل‌های datetime
//       this.finishDateTimeControl[blockIndex][index] = new FormControl<string | null>(null);
//
//       return {
//         field: f.field,
//         type: f.type,
//         valueFormat: '',
//         filter: {},
//         valueParameters: []
//       };
//     });
//
//     this.actionBlocks.push({
//       name: null,
//       actionParameters:parameters
//     });
//   }
//
//   removeActionBlock(index: number) {
//     if (this.actionBlocks.length > 1) {
//       this.actionBlocks.splice(index, 1);
//     }
//   }
//
//
//   onSubmit() {
//     this.oneObject.triggerCondition = JSON.stringify(this.dialogEventParameters[0]?._targetFilter)
//     console.log(this.actionBlocks)
//
//     this.actionBlocks.forEach((block,blockIndex) => {
//       block.actionParameters.forEach((param,fieldIndex) => {
//
//         if (param.type === 'object') {
//           const actionModal = this.showActionFilterModal.find(m => m.parameters.some(p => p.field === param.field));
//           console.log(actionModal)
//           if (actionModal && actionModal.filterGroup) {
//             param.filter = Object.keys(actionModal.filterGroup).length === 0 ? null : actionModal.filterGroup ;
//           } else {
//             param.filter = (param.filter as any).value.filter // برای حالتی هست که نوع اکشن(که object) هست مقدار فیلتر جایگزین بشه
//           }
//
//           // اگر اسکالر بود ⇒ valueParameters مقدار بگیره
//         } else {
//           const treeModal = this.treeNodeModals.find(t => t.dataAction?.field === param.field);
//           // console.log(treeModal)
//           param.filter = null
//           if (treeModal) {
//             const fieldValues = this.treeNodeTextareaMap.get(param.field) || [];
//             param.valueParameters = fieldValues.length > 0 ? fieldValues : [];
//
//             treeModal.modalTreeNodeOutPut = null;
//             console.log(treeModal)
//
//           }
//
//           // if (param.valueParameters && param.valueParameters.length > 0) {
//             let text = param.valueFormat || '';
//
//             if (this.treeValues?.length) {
//               this.treeValues.forEach((val, index) => {
//                 const escapedVal = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//                 const regex = new RegExp(`<!${escapedVal}!>`, 'g');
//                 text = text.replace(regex, `<!${index}!>`);
//               });
//             }
//             if (param.type === 'datetime' && param.valueParameters.length>0) {
//               const key = `${blockIndex}_${fieldIndex}`;
//               const displayVal = this.displayDateMap.get(key);
//               if (displayVal) {
//                 const escapedVal = displayVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//                 text = escapedVal
//                 const regex = new RegExp(`<!${text}!>`, 'g');
//                 text = text.replace(regex, '<!0!>');
//               }
//               // param.filter = null
//             }
//
//             param.valueFormat = text;
//
//         }
//
//       })
//     });
//
//     this.oneObject.actions = [...this.actionBlocks];
//
//
//     console.log(this.oneObject)
//
//     this.service.onRegisterAutomatedProcess(this.oneObject).subscribe(res =>{
//       this.loading.hide()
//     }, error => {
//       this.loading.hide();
//     })
//
//
//   }
//
//   toggleExpand(node: FilterNode) {
//     node.expanded = !node.expanded;
//   }
//
//
//   mapFilterParameterOptions(filterParams:any[],block?: IAppAction, fi?: number){
//     const options = filterParams.filter(fp => fp?.filter)
//       .map(fp => ({
//         label: fp.filter.label,
//         value: fp,
//       }));
//
//     // if (block && fi !== undefined && options.length) {
//     //   const current = block.actionParameters[fi].filter;
//     //   if (!current) {
//     //     block.actionParameters[fi].filter = options[0].value.filter;
//     //   }
//     // }
//
//     return options
//
//   }
//
//   onSelectFilterParameter(event:any, type: ModalType, block?:IAppAction,fi?:number){
//     console.log(event)
//     const filterParam: IFilterParameters = event.value.value;
//     const parameters = filterParam.parameters ?? [];
//     const allConditions = this.collectConditions(filterParam.filter);
//
//     const matchedParams = allConditions.filter(c =>
//       parameters.some(p =>  p.name === c.parameter)
//     );
//     if (matchedParams.length){
//       const uniqueConditions = matchedParams.filter(
//         (cond, index, self) =>
//           index === self.findIndex(c => c.parameter === cond.parameter)
//       );
//       if (uniqueConditions.length){
//         const activeTreeModal = this.treeNodeModals.find(m => m.visible);
//         const parentModalId = activeTreeModal ? activeTreeModal.id : null;
//
//         this.showActionFilterModal.push({
//           id: crypto.randomUUID(), // شناسه یکتا
//           visible: true,
//           parameters: parameters.filter(x=> uniqueConditions.some(p =>  p.parameter === x.name)),
//           filterGroup: filterParam.filter,
//           parentModalId,              // id پدر
//           parentModalType: type,
//         });
//       }
//     }
//     // else {
//     //   const filter = filterParam.filter
//     //   block.actionParameters[fi].filter = filter;
//     // }
//
//     console.log(this.showActionFilterModal)
//   }
//
//   closeActionModal(modalId: string) {
//     const modal = this.showActionFilterModal.find(m => m.id === modalId);
//     if (modal) modal.visible = false;
//     this.showActionFilterModal = this.showActionFilterModal.filter(m => m.id !== modalId);
//   }
//
//   closeEntityModal(modalId: any) {
//     const modal = this.treeNodeModals.find(m => m.id === modalId);
//     if (modal) modal.visible = false;
//     // حذفش
//     setTimeout(() => {
//       this.treeNodeModals = this.treeNodeModals.filter(m => m.id !== modalId);
//     }, 300);
//   }
//
//
// // این ساختار برای نگهداری تاریخ انتخاب‌شده در هر فیلد
//   tempSelectedDate: IActiveDate;
//   openDateModal(blockIndex: number, fieldIndex: number, block: IAppAction) {
//     this.selectedDateContext = { blockIndex, fieldIndex };
//     this.showDateModal = true;
//     // اگر آرایه وضعیت هنوز وجود نداره، بسازش
//     // if (!this.dateTimeMode[blockIndex]) this.dateTimeMode[blockIndex] = [];
//     // this.dateTimeMode[blockIndex][fieldIndex] = 'date';
//   }
//
//   onApplyDatePickerModal(){
//     if (!this.selectedDateContext || !this.tempSelectedDate) {
//       this.showDateModal = false;
//       return;
//     }
//
//     const { blockIndex, fieldIndex } = this.selectedDateContext;
//     const block = this.actionBlocks[blockIndex];
//     const dateEvent = this.tempSelectedDate;
//
//     if (block?.actionParameters?.[fieldIndex]) {
//       // مقدار میلادی برای مدل (backend)
//       block.actionParameters[fieldIndex].valueFormat = dateEvent.gregorian;
//
//
//       const fieldKey = block.actionParameters[fieldIndex].field;
//       const key = `${blockIndex}_${fieldIndex}`;
//       this.displayDateMap.set(key, dateEvent.shamsi.trim());// مقدار شمسی برای نمایش در input
//       this.treeNodeTextareaMap.delete(fieldKey);
//       console.log(this.treeNodeTextareaMap)
//     }
//
//     // پاک‌سازی و بستن مودال
//     this.tempSelectedDate = null;
//     this.selectedDateContext = null;
//     this.showDateModal = false;
//   }
//
//   //************************************************ start Date functions ***************************************
//   displayDateMap = new Map<string, string>();
//   initialFinishDatePicker(event: IActiveDate,block: any, index: number) {
//     // this.finishDate = event.gregorian
//     if (!block.actionParameters || !block.actionParameters[index]) return;
//     block.actionParameters[index].valueFormat = event.gregorian;
//   }
//   selectFinishDate(event: IActiveDate, block: any, index: number) {
//     // this.finishDate = event.gregorian
//     this.tempSelectedDate = event
//     // if (!block.actionParameters || !block.actionParameters[index]) return;
//     // block.actionParameters[index].valueFormat = event.gregorian;
//   }
//   //************************************************ start Date functions ***************************************

  getListOfProccess(){
    this.loading.show();
    this.processService.getAutomatedProcess(this.paginationData).subscribe({
      next: (out) =>{
        this.loading.hide();

        if (out.items.length < this.paginationData.rows) this.paginationData.hasMore = false;
        this.listProcess = [...this.listProcess, ...out.items];
        this.paginationData.from += out.items.length;
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }


  formatActions(actions: any[]): string {
    if (!actions || actions.length === 0) return '';
    if (actions.length === 1) return actions[0];   // فقط یکی بود همان را بده
    return actions.join(' | ');                    // چندتا بود با | جدا کن
  }


}
