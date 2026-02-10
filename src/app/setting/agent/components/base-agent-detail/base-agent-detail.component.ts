import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {AgentService} from "../../../_services/agent.service";
import {LoadingService} from "../../../../_services/loading.service";
import {AgentTimeUnitsEnum, AgentTimeUnitsEnum2LabelMapping, AgentType} from "../../../_types/agent.type";
import {Utilities} from "../../../../_classes/utilities";
import {
  PathAssignmentPoliciesEnum,
  PathAssignmentPoliciesEnum2LabelMapping
} from "../../../../_enums/path-assignment-policies.enum";
import {DropdownChangeEvent} from "primeng/dropdown/dropdown.interface";
import {IAppAction} from "../../../_types/CreateProcess.type";
import {FormControl} from "@angular/forms";
import {
  FieldFilterDescriptor,
  FilterField,
  FilterGroup,
  IFilterParameters,
  ValuePathAccess
} from "../../../_types/filter.type";
import {
  ITreeNodeModal, TreeSelectedValue
} from "../../../process-automation/components/base-process-automation-detail/base-process-automation-detail.component";
import {ProcessAutmationService} from "../../../_services/process-autmation.service";
import {IActiveDate} from "ng-persian-datepicker";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";

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

@Component({
  template: ''
})
export class BaseAgentDetailComponent<T> implements OnInit{

  oneObject: AgentType = new AgentType({})
  agentEnumOptions: any
  entityOptions: { entity: string, title:string }[];
  filterOptions = [];


  // ********* تب واکنش ها **********
  actionBlocks: IAppAction[] = [];
  finishDate!: string;
  finishDateTimeControl: FormControl[][]= [];

  actionTypeOptions = [];
  filterActionsInput:Record<number, FieldFilterDescriptor[]> = {};
  triggerEventEntity: string = ''

  actionOptions = [
    { label: 'بلافاصله', value: 'now' },
    { label: 'با تاخیر', value: 'timer' }
  ];
  actionRadio= [];
  timerState = new Map<string, { count: number; unitIndex: number }>();


  showActionFilterModal:ActionFilterModal[] = []

  treeNodeModals:ITreeNodeModal[]= [];
  treeValuesMap: Map<string, TreeSelectedValue[]> = new Map();

  booleanMap: { [key: string]: boolean } = {};
  displayBooleanMap = new Map<string, string>();
  displayDateMap = new Map<string, { value: string; type: 'timer' | null }>();

  // نگه داشتن ایندکس بلاک و فیلدی که مودال تاریخ برایش باز شده
  selectedDateContext: { blockIndex: number; fieldIndex: number } | null = null;
  showDateModal:boolean = false


  actionTimeType: Record<string, 'now' | 'timer'> = {};
  @ViewChildren('textareaRefs') textareaRefs!: QueryList<ElementRef<HTMLTextAreaElement>>;
  constructor(
    protected manager: BaseSaveManager<AgentType>,
    private agentService: AgentService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    protected loading: LoadingService,
    ){
    this.agentEnumOptions = Utilities.ConvertEnumToKeyPairArray(AgentTimeUnitsEnum, AgentTimeUnitsEnum2LabelMapping);
  }

  ngOnInit() {
    this.getEntities();
    this.addActionBlock();
    this.onGetActionData();

  }


  onSubmit() {
    this.loading.show()
    // this.oneObject.triggerCondition = JSON.stringify(this.dialogEventParameters[0]?._targetFilter)
    this.oneObject.filter = JSON.stringify(this.oneObject.filter);
    console.log(this.actionBlocks)

    this.actionBlocks.forEach((block,blockIndex) => {
      block.actionParameters.forEach((param,fieldIndex) => {

        if (param.type === 'object' || param.type === 'array') {
          const actionModal = this.showActionFilterModal.find(m => m.parameters.some(p => p.field === param.field));
          console.log(actionModal)
          if (actionModal && actionModal.filterGroup) {
            param.filter = Object.keys(actionModal.filterGroup).length === 0 ? null : actionModal.filterGroup ;
          } else {
            param.filter = (param.filter as any).value ? (param.filter as any).value?.filter : param.filter // برای حالتی هست که نوع اکشن(که object) هست مقدار فیلتر جایگزین بشه
          }

          // اگر اسکالر بود ⇒ valueParameters مقدار بگیره
        }
        else {
          const indexKey = `${blockIndex}_${fieldIndex}`;
          const treeModal = this.treeNodeModals.find(t => t.dataAction?.indexKey === indexKey);
          // console.log(treeModal)
          param.filter = null
          if (treeModal) {
            const treeValues = this.treeValuesMap.get(indexKey) || [];
            param.valueParameters = treeValues.map(item => item.value);
            // param.valueParameters = treeValues.length > 0 ? treeValues : [];
            // const ap = block.actionParameters[fieldIndex]
            // ap.valueParameters = treeModal.dataAction.valueParameters ? treeModal.dataAction.valueParameters : []

            // param.valueParameters = treeModal.dataAction.valueParameters

            treeModal.modalTreeNodeOutPut = null;
            console.log(treeModal)

          }

          // if (param.valueParameters && param.valueParameters.length > 0) {
          let text = param.valueFormat || '';


          const fieldValues = this.treeValuesMap.get(indexKey);
          if (fieldValues?.length) {
            fieldValues.forEach((val, index) => {
              const escapedVal = val.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const regex = new RegExp(`<!${escapedVal}!>`, 'g');
              text = text.replace(regex, `<!${index}!>`);
            });
          }


          if (param.type === 'datetime' && param.valueParameters.length>0) {
            const key = `${blockIndex}_${fieldIndex}`;
            const displayVal = this.displayDateMap.get(key);
            if (displayVal.type === null) {
              // const escapedVal = displayVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              // text = escapedVal
              // const regex = new RegExp(`<!${text}!>`, 'g');
              text = displayVal.value
              text = text.replace(displayVal.value, '<!0!>');
            }
            // param.filter = null
          }

          if (param.type === 'boolean' && param.valueParameters.length>0) {
            const key = `${blockIndex}_${fieldIndex}`;
            const displayVal = this.displayBooleanMap.get(key);
            if (displayVal) {
              // const escapedVal = displayVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              // text = escapedVal
              // const regex = new RegExp(`<!${text}!>`, 'g');
              text = displayVal
              text = text.replace(displayVal, '<!0!>');
            }
            // param.filter = null
          }

          param.valueFormat = text;

        }

      })
    });

    this.oneObject.actions = [...this.actionBlocks];


    console.log(this.oneObject)

    this.agentService.onRegisterAutomatedProcess(this.oneObject).subscribe({
      next: (out) =>{
        this.loading.hide()
        this.messageService.add({
          severity: 'success',
          summary: 'موفق',
          detail: 'عملیات با موفقیت انجام شد.',
        });
        this.router.navigate(['./'], {relativeTo: this.activeRoute.parent})
      },
      error: (err) =>{
        this.loading.hide()
      }
    })


  }

  getEntities(){
    this.loading.show();
    this.agentService.getEntities().subscribe({
      next: (out) =>{
        this.loading.hide();
        this.entityOptions = out;
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  getFilterList(entity:string){
    this.loading.show();
    this.agentService.getFilters(entity).subscribe({
      next: (out) => {
        this.loading.hide();
        this.filterOptions = out;
      },
      error: (err) => {
        this.loading.hide();
      }
    })
  }

  onChangeEntity(entity:DropdownChangeEvent){
    this.getFilterList(entity.value)
  }

  // **********  تب واکنش ها ********
  onGetActionData(){
    this.loading.show();
    this.agentService.getActionData().subscribe({
      next: (out)=>{
        this.loading.hide()
        this.actionTypeOptions = out
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  getEntityData(param: any, type:ModalType = 'action', blockIndex?:number, fieldIndex?:number){
    this.loading.show()
    this.agentService.getEntityModel(this.oneObject.entity).subscribe({
      next: (out) =>{
        this.loading.hide()
        if (out){
          // this.entitydata = this.buildTreeFromDescriptors(out);
          const entityData = this.buildTreeFromDescriptors(out);

          const activeActionModal = this.showActionFilterModal.find(m => m.visible);
          const parentModalId = activeActionModal ? activeActionModal.id : null;
          const indexKey = (typeof blockIndex !== 'undefined' && typeof fieldIndex !== 'undefined') ? `${blockIndex}_${fieldIndex}` : null; //
          const modal: ITreeNodeModal = {
            // id: crypto.randomUUID(), // برای مروگر های قدیمی و سرور های قدیمی خطا میخوره
            id: Math.random().toString(36).substring(2) + Date.now(),
            visible: true,
            entityData: entityData,
            selectedNodeFullPath: null,
            parentModalId,
            dataActionModalId: parentModalId,
            dataAction: { ...param, indexKey },
            parentModalType: type,
          };

          this.treeNodeModals.push(modal);
          console.log(this.treeNodeModals)
        }
      },
      error: (err) =>{
        this.loading.hide()
      }
    })
  }

  onActionInput(event:any, index: number, ){
    this.loading.show();
    const entityEvent = this.triggerEventEntity ? this.triggerEventEntity : ''
    this.agentService.getFilterInputData(event.value,entityEvent).subscribe({
      next: (out) =>{
        this.loading.hide();


        const parameters = (out || []).map(f => ({
          field: f.field,
          type: f.type,
          valueFormat: '',
          filter: {},
          valueParameters: []
        }));
        if (!this.actionBlocks[index]) {
          this.actionBlocks[index] = { name: '', actionParameters: [] };
        }

        this.actionBlocks[index].name = event.value;
        this.actionBlocks[index].actionParameters = parameters;

        // this.actionBlocks.push({
        //   name: event.value, // مقدار انتخابی جدید از dropdown
        //   actionParameters: parameters
        // });

        // ساخت FormControl برای فیلدهای datetime در همین بلاک
        this.finishDateTimeControl[index] = (out || []).map(f => new FormControl<string | null>(null));

        // ذخیره فیلدها برای استفاده در ngFor
        this.filterActionsInput[index] = out;


      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  onSelectFilterParameter(event:any, type: ModalType, block?:IAppAction,fi?:number){
    console.log(event)
    const filterParam: IFilterParameters = event.value?.value ? event.value?.value : event.value ;
    const parameters = filterParam.parameters ?? [];
    const allConditions = this.collectConditions(filterParam.filter);

    const matchedParams = allConditions.filter(c =>
      parameters.some(p =>  p.name === c.parameter)
    );
    if (matchedParams.length){
      const uniqueConditions = matchedParams.filter(
        (cond, index, self) =>
          index === self.findIndex(c => c.parameter === cond.parameter)
      );
      if (uniqueConditions.length){
        const activeTreeModal = this.treeNodeModals.find(m => m.visible);
        const parentModalId = activeTreeModal ? activeTreeModal.id : null;

        this.showActionFilterModal.push({
          // id: crypto.randomUUID(), // برای مرورگر های قدیمی و سرور های قدیمی خطا میخوره
          id: Math.random().toString(36).substring(2) + Date.now(),
          visible: true,
          parameters: parameters.filter(x=> uniqueConditions.some(p =>  p.parameter === x.name)),
          filterGroup: filterParam.filter,
          parentModalId,              // id پدر
          parentModalType: type,
        });
      }
    }
    // else {
    //   const filter = filterParam.filter
    //   block.actionParameters[fi].filter = filter;
    // }

    console.log(this.showActionFilterModal)
  }

  mapFilterParameterOptions(filterParams:any[],block?: IAppAction, fi?: number){
    const options = filterParams.filter(fp => fp?.filter)
      .map(fp => ({
        label: fp.filter.label,
        value: fp,
      }));

    // if (block && fi !== undefined && options.length) {
    //   const current = block.actionParameters[fi].filter;
    //   if (!current) {
    //     block.actionParameters[fi].filter = options[0].value.filter;
    //   }
    // }

    return options

  }

  // این ساختار برای نگهداری تاریخ انتخاب‌شده در هر فیلد
  tempSelectedDate: IActiveDate;
  openDateModal(blockIndex: number, fieldIndex: number, block: IAppAction) {
    this.selectedDateContext = { blockIndex, fieldIndex };
    this.showDateModal = true;
  }

  onApplyDatePickerModal(){
    if (!this.selectedDateContext || !this.tempSelectedDate) {
      this.showDateModal = false;
      return;
    }

    const { blockIndex, fieldIndex } = this.selectedDateContext;
    const block = this.actionBlocks[blockIndex];
    const dateEvent = this.tempSelectedDate;

    if (block?.actionParameters?.[fieldIndex]) {
      // مقدار میلادی برای مدل (backend)
      block.actionParameters[fieldIndex].valueFormat = dateEvent.gregorian;

      const indexKey = `${blockIndex}_${fieldIndex}`;
      const modal = this.treeNodeModals.find(m => m.dataAction?.indexKey === indexKey);
      if (modal) {
        modal.dataAction.valueParameters = [];
      }


      const fieldKey = block.actionParameters[fieldIndex].field;
      const key = `${blockIndex}_${fieldIndex}`;
      this.displayDateMap.set(key, {value:dateEvent.shamsi.trim(), type:null});// مقدار شمسی برای نمایش در input
    }

    // پاک‌سازی و بستن مودال
    this.tempSelectedDate = null;
    this.selectedDateContext = null;
    this.showDateModal = false;
  }

  closeActionModal(modalId: string) {
    const modal = this.showActionFilterModal.find(m => m.id === modalId);
    if (modal) modal.visible = false;
    this.showActionFilterModal = this.showActionFilterModal.filter(m => m.id !== modalId);
  }

  closeEntityModal(modalId: any) {
    const modal = this.treeNodeModals.find(m => m.id === modalId);
    if (modal) modal.visible = false;
    // حذفش
    setTimeout(() => {
      this.treeNodeModals = this.treeNodeModals.filter(m => m.id !== modalId);
    }, 300);
  }

  clickRadioButton(node: any, modal: ITreeNodeModal) {
    modal.selectedNodeFullPath = node.fullPath;
    this.clearUnrelatedDropdownSelections(modal.entityData, node.fullPath)
  }

  onRadioSelect(type: 'value' | 'parameter', modal: ActionFilterModal) {
    console.log(modal)
    modal.parameters.forEach(param => {
      if (modal.selectedParamRadio === 'parameter') {
        param.value = '';
      }
    });
  }

  addActionBlock(block?:IAppAction) {
    const blockIndex = this.actionBlocks.length;

    if (!this.finishDateTimeControl[blockIndex]) {
      this.finishDateTimeControl[blockIndex] = [];
    }

    const fields = this.filterActionsInput[blockIndex - 1] || [];

    const parameters = fields.map((f, index) => {
      // کنترل‌های datetime
      this.finishDateTimeControl[blockIndex][index] = new FormControl<string | null>(null);

      return {
        field: f.field,
        type: f.type,
        valueFormat: '',
        filter: {},
        valueParameters: []
      };
    });

    this.actionBlocks.push({
      name: null,
      actionParameters:parameters
    });
  }

  removeActionBlock(index: number) {
    if (this.actionBlocks.length > 1) {
      this.actionBlocks.splice(index, 1);
    }
  }

  clearUnrelatedDropdownSelections(nodes: FilterNode[] = [], selectedFullPath: string) {
    const isAncestor = (ancestorFullPath: string, descendantFullPath: string): boolean => {
      if (!ancestorFullPath) return false;
      const prefix = ancestorFullPath.endsWith('.') ? ancestorFullPath : ancestorFullPath + '.';
      return descendantFullPath.startsWith(prefix);
    };

    // تابع کمکی داخلی: پاک‌کردن انتخاب‌ها برای یک نود و تمام فرزندانش
    const clearSelectionsRecursively = (n: FilterNode) => {
      n.selectedValue = null;
      if (n.children?.length) {
        for (const child of n.children) clearSelectionsRecursively(child);
      }
    };

    for (const node of nodes) {
      // اگر این نود dropdown داره (دارای values)
      if (node.values?.length) {
        // اگر selectedFullPath در شاخه این نود نیست → پاکش کن
        if (!isAncestor(node.fullPath, selectedFullPath)) {
          clearSelectionsRecursively(node);
          continue; // از این شاخه خارج شو چون پاک شده
        }
      }

      // ادامه بررسی برای فرزندان
      if (node.children?.length) {
        this.clearUnrelatedDropdownSelections(node.children, selectedFullPath);
      }
    }
  }

  //********** start Date functions *********
  initialFinishDatePicker(event: IActiveDate,block: any, index: number) {
    // this.finishDate = event.gregorian
    if (!block.actionParameters || !block.actionParameters[index]) return;
    block.actionParameters[index].valueFormat = event.gregorian;
  }

  selectFinishDate(event: IActiveDate, block: any, index: number) {
    // this.finishDate = event.gregorian
    this.tempSelectedDate = event
    // if (!block.actionParameters || !block.actionParameters[index]) return;
    // block.actionParameters[index].valueFormat = event.gregorian;
  }
  //******** start Date functions ***********

  // onActionRadioValue(value:any ,blockIndex:number){
  //   this.actionRadio[blockIndex] = value;
  //   console.log(this.actionRadio[blockIndex])
  //   console.log(value)
  //
  //   const block = this.actionBlocks[blockIndex];
  //   block.executionDateTime = null;
  //   // if (value.value === 'now') {
  //   //   block.executionDateTime = null;
  //   // } else if (value.value === 'timer') {
  //   //   this.initTimerAction(`${blockIndex}`);
  //   // }
  //   // if (this.actionRadio == 'now'){
  //   //   const block = this.actionBlocks[blockIndex];
  //   //   block.executionDateTime = null
  //   // } else {
  //   //   this.initTimerAction(`${blockIndex}`)
  //   // }
  // }



  insertAtCursor(event: any,indexKey: string){
    console.log(event)
    const textareaRef = this.textareaRefs.toArray()
      .find(el => el.nativeElement.getAttribute('data-key') === indexKey);
    if (!textareaRef) return;

    const textarea = textareaRef.nativeElement;
    const textToInsert = `<!${event.label}!>`;

    // موقعیت فعلی کرسر
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // متن قبلی
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    // قرار دادن متن جدید بین before و after
    textarea.value = before + textToInsert + after;

    // به‌روزرسانی موقعیت کرسر بعد از درج متن
    const newCursorPos = start + textToInsert.length;
    textarea.selectionStart = textarea.selectionEnd = newCursorPos;

    // تریگر کردن change برای [(ngModel)] در صورت وجود
    textarea.dispatchEvent(new Event('input'));

  }

  toggleExpand(node: FilterNode) {
    node.expanded = !node.expanded;
  }

  saveTreeNodeModal(modal: ITreeNodeModal){
    if (!modal.selectedNodeFullPath) return;

    const selectedNode = this.findNodeByFullPath(modal.entityData, modal.selectedNodeFullPath);
    const fullLabel = selectedNode.fullLabel
    if (!selectedNode) return;

    // 2. ساخت مسیر پدر از fullPath با حذف آخرین بخش
    const full = selectedNode.fullPath || '';
    const parts = full.split('.').filter(Boolean); // ['sender','customer','customerPhones','phoneNumber'] یا ممکنه بدون 'sender'
    let field: string | null = null;
    let path = '';
    let filter = null;
    let type = null;

    const parentNode = this.findParentNodeObject(modal.entityData, full);
    if (parentNode && parentNode.type === 'array') {
      field = parts.pop() || null;
      path = parts.join('.');
      filter = parentNode?.filter;
      type = parentNode.type;
    } else {
      // در غیر این صورت (مثل sender.title) field = null، و path کامل می‌مونه
      field = null;
      path = full;
      filter = null;
      type = parentNode?.type ? parentNode?.type : null
    }
    if (!path.startsWith('sender')) path = `sender.${path}`;

    const valuePathAccess:ValuePathAccess = { path, field, filter };

    const result = {...valuePathAccess, type};
    modal.modalTreeNodeOutPut = result;

    modal.fullLabel = fullLabel

    if (modal.parentModalId && modal.parentModalType) {
      if (modal.parentModalType === 'action'){
        const parentActionModal = this.showActionFilterModal.find(m => m.id === modal.parentModalId);
        if (parentActionModal) parentActionModal.outputValuePath = result;
        console.log('Found parent tree modal:', parentActionModal);
      } else if (modal.parentModalType === 'tree'){
        const parentTreeModal = this.treeNodeModals.find(t => t.id === modal.parentModalId);
        if (parentTreeModal) parentTreeModal.modalTreeNodeOutPut = result;
        console.log('Found parent tree modal:', parentTreeModal);
      }
    }

    if (!modal.parentModalId) {
      if (modal.dataAction.type === 'string'){
        const existing = this.treeValuesMap.get(modal.dataAction.indexKey) || [];
        this.treeValuesMap.set(modal.dataAction.indexKey, [...existing,{label: modal.fullLabel, value: result}]);
        const updated = new Map(this.treeValuesMap);
        // this.treeValuesMap = updated;
        // const existingText = this.treeNodeTextareaMap.get(modal.dataAction.indexKey) || [];
        // this.treeNodeTextareaMap.set(modal.dataAction.indexKey, [...existingText, result]);
        // modal.dataAction.valueParameters = [...modal.dataAction.valueParameters ? modal.dataAction.valueParameters : [],result]
        console.log(this.treeValuesMap)
      }



      if (modal.dataAction?.type === 'datetime') {
        const fieldKey = modal.dataAction?.field
        this.displayDateMap.delete(modal.dataAction.indexKey)
        this.displayDateMap.set(modal.dataAction.indexKey, {value:fullLabel, type: null});
        modal.dataAction.valueParameters = [result]
      }

      if (modal.dataAction?.type === 'boolean'){
        const fieldKey = modal.dataAction?.field

        this.displayBooleanMap.delete(modal.dataAction.indexKey)
        this.displayBooleanMap.set(modal.dataAction.indexKey, fullLabel)
        modal.dataAction.valueParameters = [result]
        // this.booleanMap[modal.dataAction.indexKey] = false;
        // this.booleanMap = { ...this.booleanMap };
      }
    }

    // if (modal.parentModalId ) {
    //   const parentActionModal = this.showActionFilterModal.find(m => m.id === modal.parentModalId);
    //   if (parentActionModal) parentActionModal.outputValuePath = result;
    // }

    modal.visible = false
    console.log('Result:', result);
  }


  saveModalAction(modalId:string){
    const modalIndex = this.showActionFilterModal.findIndex(m => m.id === modalId);
    if (modalIndex === -1) return null;

    const modal = this.showActionFilterModal[modalIndex];
    const parameters = modal.parameters

    const updateFilterValues = (filters: FilterField[], mode: 'value' | 'parameter', paramName:string, value: any, valuePath: ValuePathAccess | null) => {
      filters.forEach(f => {
        // conditions بررسی
        if (f.conditions?.length) {
          f.conditions.forEach(cond => {
            if(cond.parameter === paramName){
              if (mode === 'value') {
                cond.value = value;
                cond.valuePath = null;
              } else if (mode === 'parameter') {
                cond.value = null;
                cond.valuePath = valuePath;
              }
            }
          });
        }
        if (f.filters?.length) {
          updateFilterValues(f.filters, mode, paramName, value, valuePath);
        }
      });
    };

    parameters.forEach(param => {
      if (modal.selectedParamRadio === 'value') {
        updateFilterValues(modal.filterGroup.filters, 'value', param.name, param.value, null);

      }else if (modal.selectedParamRadio === 'parameter' ) {
        const valuePath = modal.outputValuePath;
        updateFilterValues(modal.filterGroup.filters, 'parameter',param.name, null, valuePath);

      }

    });
    const actionResult = {...modal.outputValuePath, type: 'action'};
    console.log('🟩 [saveModalAction] Action Result:', actionResult);

    localStorage.setItem('actionFilter', JSON.stringify(modal))
    console.log('ActionModal data saved:', modal);

    if (modal.parentModalId && modal.parentModalType) {
      if (modal.parentModalType === 'tree') {
        const parentTreeModal = this.treeNodeModals.find(t => t.id === modal.parentModalId);
        if (parentTreeModal) parentTreeModal.modalTreeNodeOutPut = actionResult
        console.log('Found parent tree modal:', parentTreeModal);
      }

      else if (modal.parentModalType === 'action') {
        const parentActionModal = this.showActionFilterModal.find(m => m.id === modal.parentModalId);
        if (parentActionModal) parentActionModal.outputValuePath = actionResult;
        // if (parentActionModal) parentActionModal.outputValuePath = actionResult;
        console.log('Found parent tree modal:', parentActionModal);
      }
    }


    // const relatedTreeModal = this.treeNodeModals.find(t => t.dataActionModalId === modal.id);
    // if (relatedTreeModal) {
    //   relatedTreeModal.modalTreeNodeOutPut = modal.outputValuePath;
    // }

    modal.outputValuePath = null;
    modal.visible = false;
    this.showActionFilterModal = this.showActionFilterModal.filter(m => m.id !== modalId);

  }


  collectConditions(group?: FilterGroup){
    if (!group) return [];
    let all = []

    for (const f of group.filters) {
      // اگر خودش conditions دارد، اضافه کن
      if (f.conditions && f.conditions.length > 0) {
        all.push(...f.conditions);
      }

      // اگر فیلترهای درونی دارد (زیرگروه)
      if (f.filters && f.filters.length > 0) {
        for (const sub of f.filters) {
          all.push(...this.collectConditions(sub)); //  بازگشتی
        }
      }
    }

    return all
  }

  findNodeByFullPath(nodes: FilterNode[], fullPath: string): FilterNode | null {
    for (const node of nodes) {

      if (node.fullPath === fullPath){
        const fullLabel = node.children?.length ? node.label : node.label;
        return { ...node, fullLabel };
      }
      if (node.children) {
        const found = this.findNodeByFullPath(node.children, fullPath);
        if (found){
          const fullLabel = `${node.label}(${found.label})`
          return { ...found, fullLabel };
        }
      }
    }
    return null;
  }

  findParentNodeObject(nodes: FilterNode[], targetFullPath: string, parentLabel: string = ''): FilterNode | null {
    for (const node of nodes) {
      const currentLabel = parentLabel ? `${parentLabel}(${node.label})` : node.label;

      if (node.children?.some(child => child.fullPath === targetFullPath)) {
        return { ...node, fullLabel: currentLabel }; // همین نود پدر است
      }
      if (node.children) {
        const found = this.findParentNodeObject(node.children, targetFullPath, currentLabel );
        if (found) return found;
      }
    }
    return null;
  }


  getDefaultMatchMode(type?: string): string {
    switch (type) {
      case 'boolean': return 'equals';
      case 'datetime': return 'dateBefore';
      case 'number': return 'equals';
      default: return 'contains';
    }
  }

  buildTreeFromDescriptors(fields: FieldFilterDescriptor[], parentPath: string = ''): FilterNode[] {
    return fields.map(f => {
      const fullPath = parentPath ? `${parentPath}.${f.field}` : f.field || '';
      let filter: FilterGroup[] | undefined = undefined;
      if (f.filterParameter?.length) {
        filter = f.filterParameter.map(fp => fp.filter!).filter(fg => !!fg); // فقط فیلترهای موجود
      }

      // اگر اسکالر بود
      if (['string', 'number', 'datetime', 'boolean'].includes(f.type || '')) {
        return {
          key: f.field || '',
          label: f.label || f.field || '',
          fullLabel: '',
          fullPath,
          isLeaf: true,
          type: f.type as FieldType,
          conditions: [
            { value: null, matchMode: this.getDefaultMatchMode(f.type), operator: 'and' }
          ],
          filter
        };
      }

      // اگر Object بود
      if (f.type === 'object') {
        return {
          key: f.field || '',
          label: f.label || f.field || '',
          fullLabel: '',
          fullPath,
          isLeaf: false,
          type: f.type as FieldType,
          children: this.buildTreeFromDescriptors(f.subFields || [], fullPath),
          expanded: false,
          filter
        };
      }

      // اگر Array بود
      if (f.type === 'array') {
        // استخراج گزینه‌های dropdown از filterParameter
        const dropdownValues =
          f.filterParameter?.flatMap(fp =>({
              label: fp.filter.label,
              value: fp
            }) ?? []
          ) ?? [];


        return {
          key: f.field || '',
          label: f.label || f.field || '',
          fullLabel: '',
          fullPath,
          isLeaf: false,
          type: f.type as FieldType,
          values: dropdownValues, // برای dropdown
          children: this.buildTreeFromDescriptors(f.subFields || [], fullPath),
          expanded: false,
          filter
        };
      }

      return {
        key: f.field || '',
        label: f.label || f.field || '',
        fullLabel: '',
        fullPath,
        isLeaf: true,
        type: 'string',
        conditions: [{ value: null, matchMode: 'contains', operator: 'and' }],
        filter
      };
    });

  }

  onBooleanChange(blockIndex: number, fieldIndex: number) {
    const key = `${blockIndex}_${fieldIndex}`;
    const block = this.actionBlocks[blockIndex];
    const value = this.booleanMap[key];

    if (block?.actionParameters?.[fieldIndex]) {
      // مقدار منطقی برای backend
      block.actionParameters[fieldIndex].valueFormat = value === true ? "true" : "false";

      const indexKey = `${blockIndex}_${fieldIndex}`;
      const modal = this.treeNodeModals.find(m => m.dataAction?.indexKey === indexKey);
      if (modal) {
        modal.dataAction.valueParameters = [];
      }

      // مقدار نمایشی برای input
      const fieldKey = block.actionParameters[fieldIndex].field;
      this.displayBooleanMap.set(key, value ? 'بله' : 'خیر');

    }


  }

  // getActionTime(key: string): 'now' | 'timer' {
  //   return this.actionTimeType[key] ?? 'now';
  // }
  // setActionTime(key: string, value: 'now' | 'timer') {
  //   this.actionTimeType[key] = value;
  // }
  // onActionTimeChange(data:{label:string, value:'now' | 'timer'}, i: number, fi: number) {
  //   const value: 'now' | 'timer' = data.value
  //   const key = `${i}_${fi}`;
  //   this.actionTimeType[key] = value
  //   console.log(this.actionTimeType)
  //
  //   const block = this.actionBlocks[i];
  //
  //   if (value === 'now') {
  //     // ارسال null
  //     if (block?.actionParameters?.[fi]) {
  //       block.actionParameters[fi].valueFormat = null;
  //     }
  //     // state تایمر هم پاک میشه (اختیاری)
  //     this.timerState.delete(key);
  //     this.displayDateMap.set(key, { value: '', type: null });
  //
  //   } else {
  //     // تأخیر → state تایمر ساخته میشه
  //     // this.initTimerState(key);
  //     // this.updateTimerValue(i, fi);
  //   }
  // }


}
