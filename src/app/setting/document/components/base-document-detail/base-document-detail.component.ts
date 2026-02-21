import {Component, OnInit} from '@angular/core';
import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {LoadingService} from "../../../../_services/loading.service";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {
  CreatePropertyDTO,
  DocumentModelType,
  PropertyTypeEnum,
  PropertyTypeEnum2LabelMapping
} from "../../../_types/document.type";
import {Utilities} from "../../../../_classes/utilities";
import {DocumentService} from "../../../_services/document.service";
import {FormControl} from "@angular/forms";
import {MessageService} from "primeng/api";
import moment from "jalali-moment";
import {DropdownChangeEvent} from "primeng/dropdown/dropdown.interface";
import {MultiSelectChangeEvent} from "primeng/multiselect/multiselect.interface";

@Component({
  template: '',
})
export class BaseDocumentDetailComponent implements OnInit{

  newDocument:DocumentModelType = new DocumentModelType({});
  tempProperties: CreatePropertyDTO = new CreatePropertyDTO({});
  tempPropertiesIndex?:number;

  propertyOptions: any;
  propertyTypeEnum = PropertyTypeEnum;
  PropertyTypeEnum2LabelMapping = PropertyTypeEnum2LabelMapping
  isEnglish:boolean = false;
  showDialog:boolean = false;
  dialogState:'new' | 'edit' = 'new';

  parameters:{ [key: number]: { title?: string }[] } = [];
  parameter: { id:string, value?: string }[] = [];
  isEnglishError: { [field: string]: boolean } = {};

  docData = []


  startDate!: string;
  startDateTimeControl = new FormControl();
  constructor(
    private docService: DocumentService,
    protected manager: BaseSaveManager<DocumentModelType>,
    protected messageService: MessageService,
    protected loading: LoadingService,
  ) {
    this.propertyOptions = Utilities.ConvertEnumToKeyPairArray(PropertyTypeEnum, PropertyTypeEnum2LabelMapping);
  }

  ngOnInit() {
    this.getAllDocument()
  }

  getAllDocument(){
    this.loading.show();
    this.docService.getDocItems<{id:number, title:string, name:string }>({},'/list',{}).subscribe({
      next: (out) => {
        this.loading.hide();
        out.items.forEach(t => this.docData.push(t));
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  addNewProperties(){
    this.manager.oneObject.properties.unshift(new CreatePropertyDTO({}));

    // update parameters array
    // const newParameters: typeof this.parameters = {};
    // Object.keys(this.parameters).forEach(key => {
    //   const oldIndex = Number(key);
    //   newParameters[oldIndex + 1] = this.parameters[oldIndex];
    // });
    // this.parameters = newParameters;

    // this.parameters[0] = [];
  }

  removeProperties(index:number){
    this.manager.oneObject.properties.splice(index, 1)

    // update parameters array
    // const newParameters: typeof this.parameters = {};
    // Object.keys(this.parameters)
    //   .map(k => Number(k))
    //   .filter(k => k !== index)
    //   .forEach(k => {
    //     const newIndex = k > index ? k - 1 : k;
    //     newParameters[newIndex] = this.parameters[k];
    //   });

    // this.parameters = newParameters;
  }

  addNewParameter(index?:number){
    this.parameter.push({id:crypto.randomUUID(), value:null})
    // this.parameters[index].push({title:null})
  }

  removeParameter(id:string){
    if (this.parameter.length > 1) {
      this.parameter = this.parameter.filter(p => p.id !== id)
    }

    if (this.tempProperties.propertyType === this.propertyTypeEnum.SingleSelect) {
      if (this.tempProperties.defaultValue === id) {
        this.tempProperties.defaultValue = null;
      }
    }

    if (this.tempProperties.propertyType === this.propertyTypeEnum.MultiSelect) {
      if (Array.isArray(this.tempProperties.value)) {
        this.tempProperties.value =
          this.tempProperties.value.filter((v: string) => v !== id);

        if (this.tempProperties.value.length === 0) {
          this.tempProperties.value = null;
        }
      }
    }
    // index:number,paramIndex:number
    // this.parameter.splice(paramIndex, 1)
  }

  onParameterChange(index:number){
    this.parameter = [...this.parameter]
  }



  onChangeProperty(item:DropdownChangeEvent,prop:CreatePropertyDTO){
    prop.defaultValue = null
    if (item.value == this.propertyTypeEnum.SingleSelect || item.value == this.propertyTypeEnum.MultiSelect){
      this.parameter =[{id:crypto.randomUUID() ,value:null}]
      // this.parameters[index] =[{title:null}]
    }else {
      this.parameter = []
    }
    this.startDateTimeControl.patchValue(null);
    console.log(item)
  }

  allowOnlyEnglish(event: KeyboardEvent, fieldName?:string){
    const char = event.key;
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (!regex.test(char)){
      this.isEnglishError[fieldName] = true;
      event.preventDefault()
    } else{
      this.isEnglishError[fieldName] = false;
    }
  }

  initialStartDatePicker(event: any) {
    this.startDate = event.gregorian;
  }

  selectStartDate(event: any) {
    this.startDate = event.gregorian
  }


  hasTitleInParameters(index?:number): boolean {
    // return this.parameters[index]?.some(p => !!p?.title);
    return this.parameter?.some(p => !!p?.value);
  }

  onCaptionChange(index?: number) {
    this.manager.oneObject.properties.forEach((item,i)=>{
      item.isCaption = i === index;
    })
  }





  submit(){
    console.log(this.tempProperties)
    if (!this.manager.oneObject.properties) {
      this.manager.oneObject.properties = [];
    }

    if (this.dialogState === 'new'){
      const isDuplicate = this.manager.oneObject.properties.some( p => p.name === this.tempProperties.name);
      if (isDuplicate){
        return this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'کلید ویژگی قبلا استفاده شده است لطفا تغییر دهید',
        });
      }

      if(this.tempProperties.propertyType === this.propertyTypeEnum.SingleSelect || this.tempProperties.propertyType === this.propertyTypeEnum.MultiSelect){
        const rowParameters = this.parameter || [];
        // (this.tempProperties.descriptor as any) = rowParameters?.map(p => p.title)
        (this.tempProperties.descriptor as any) = rowParameters
        this.tempProperties.defaultValue = this.tempProperties.defaultValue
      }

      if (this.tempProperties.propertyType === this.propertyTypeEnum.Date)
        this.tempProperties.defaultValue = this.startDate ? this.startDate?.trim()?.concat('T' + '00:00:00') : null

      if (this.tempProperties.propertyType === this.propertyTypeEnum.Document)
        this.tempProperties.descriptor = this.tempProperties.descriptor

      const newProp = new CreatePropertyDTO(this.tempProperties);
      this.manager.oneObject.properties.push(newProp);
    } else {
      // Edit Mode

      // const indexProp = this.manager.oneObject.properties.findIndex(p => p.name === this.tempProperties.name);
      // چک duplicate در بقیه آیتم‌ها
      const isDuplicateEdit = this.manager.oneObject.properties.some((p, i) => i !== this.tempPropertiesIndex && p.name === this.tempProperties.name);
      if (isDuplicateEdit){
        return this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'کلید ویژگی قبلا استفاده شده است لطفا تغییر دهید',
        });
      }


      if(this.tempProperties.propertyType === this.propertyTypeEnum.SingleSelect || this.tempProperties.propertyType === this.propertyTypeEnum.MultiSelect){
        const rowParameters = this.parameter || [];
        // (this.tempProperties.descriptor as any) = rowParameters?.map(p => p.title)
        (this.tempProperties.descriptor as any) = rowParameters
        this.tempProperties.defaultValue = this.tempProperties.defaultValue
      }else {
        this.tempProperties.value = this.tempProperties.defaultValue ?? null;
      }

      if (this.tempProperties.propertyType === this.propertyTypeEnum.Document) {
        this.tempProperties.defaultValue = null
        this.tempProperties.descriptor = this.tempProperties.descriptor ? String(this.tempProperties.descriptor) : null
      }


      if (this.tempProperties.propertyType === this.propertyTypeEnum.Date){
        this.tempProperties.defaultValue = this.startDate ? this.startDate?.trim()?.concat('T' + '00:00:00') : this.tempProperties.defaultValue
        this.tempProperties.descriptor = null;
      }

      this.manager.oneObject.properties[this.tempPropertiesIndex] = this.tempProperties;
    }
    this.showDialog = false;
    console.log(this.manager.oneObject)
  }

  openDialog(state:'new'|'edit',index?:number){
    this.dialogState = state;
    if (state == 'new'){
      const hasCaption = this.manager.oneObject.properties
        ?.some(item => item.isCaption === true);
      this.tempProperties = new CreatePropertyDTO({})

      this.tempProperties.isCaption = !hasCaption;

    } else {
      //Edit Mode
      this.parameter = [];
      this.tempPropertiesIndex = index
      // const prop = this.manager.oneObject.properties.find(item => item.name === propertyName)
      const prop = this.manager.oneObject.properties[index]
      this.tempProperties = new CreatePropertyDTO(prop)

      // this.tempProperties.descriptor = prop.descriptor ? JSON.parse(prop?.descriptor) : null
      if(this.tempProperties.propertyType === this.propertyTypeEnum.SingleSelect || this.tempProperties.propertyType === this.propertyTypeEnum.MultiSelect){

        if (this.tempProperties.descriptor && Array.isArray(this.tempProperties.descriptor)){
          // this.parameter = this.tempProperties.descriptor.map(item => ({ title: item }));
          this.parameter = this.tempProperties.descriptor;
        }

        if (this.tempProperties.propertyType === this.propertyTypeEnum.SingleSelect){
          this.tempProperties.value = this.tempProperties?.defaultValue ? this.tempProperties?.defaultValue : null
        }
        if (this.tempProperties.propertyType === this.propertyTypeEnum.MultiSelect){
          this.tempProperties.value = this.tempProperties?.defaultValue ? JSON.parse(this.tempProperties?.defaultValue) : this.tempProperties.value
        }

      } else {
        this.tempProperties.value = this.tempProperties.defaultValue ?? null;
      }




      if (prop.propertyType === this.propertyTypeEnum.Date){
        if (prop.defaultValue){
          this.startDateTimeControl.patchValue(moment(prop?.defaultValue).locale('fa').format('YYYY-MM-DD').toString());
        }
      }


    }
    this.showDialog = true;
    console.log(this.tempProperties)
  }

  changeDefaultValue(event: any, item:CreatePropertyDTO) {
    // itemValue for MultiSelect, value for singeSelect
    if (event.itemValue){
      item.value = event.itemValue;
    } else {
      item.defaultValue = event.value;
    }
  }


}
