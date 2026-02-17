import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {TableModule} from "primeng/table";
import {TabViewChangeEvent, TabViewModule} from "primeng/tabview";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {MenuItem} from "primeng/api";
import {LoadingService} from "../../../_services/loading.service";
import {CustomerService} from "../../_services/customer.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {OutType} from "../../../_classes/base-list.manager";
import {
  CreatePropertyDTO,
  DocumentModelType,
  ICreatDocumentInstance,
  IDetailDocInstance, IModifyInstancePropertyValueDTO, IUpdateDocInstance,
  PropertyTypeEnum
} from "../../_types/document.type";
import {ToolbarModule} from "primeng/toolbar";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {NgPersianDatepickerComponent, NgPersianDatepickerModule} from "ng-persian-datepicker";
import {DialogModule} from "primeng/dialog";
import {InputSwitchModule} from "primeng/inputswitch";
import {MultiSelectModule} from "primeng/multiselect";
import moment from "jalali-moment";
import {KeyFilterModule} from "primeng/keyfilter";
import {JalaliDatePipe} from "../../../_pipes/jalali.date.pipe";
import {PaginatorModule, PaginatorState} from "primeng/paginator";
import {DropdownChangeEvent} from "primeng/dropdown/dropdown.interface";

@Component({
  selector: 'app-customer-document',
  templateUrl: './customer-document.component.html',
  styleUrl: './customer-document.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    TabViewModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    DropdownModule,
    NgPersianDatepickerModule,
    DialogModule,
    InputSwitchModule,
    MultiSelectModule,
    KeyFilterModule,
    JalaliDatePipe,
    PaginatorModule,
    RouterLink

  ],
  providers:[JalaliDatePipe]
})
export class CustomerDocumentComponent implements OnInit{

  documents:DocumentModelType[] = [];
  currentDocument: CreatePropertyDTO[]= [];
  docDetail:IDetailDocInstance= {};
  customerId:number;
  selectDocId:number;
  isEditMode = false;
  currentDocumentInstanceId: number | null = null;
  docTitle?: string = ''


  pagination = { from:0, rows:20 }
  totalRecords:number;
  tableLoading:boolean = false
  many:OutType<IDetailDocInstance> = {}

  startDate!: string;
  startDateTimeControl = new FormControl();
  propertyTypeEnum = PropertyTypeEnum;

  parameters:{title?:string}[] = [];
  showDialog:boolean = false;
  showDialogState: 'new' | 'edit' = 'new';
  constructor(
    private customerService: CustomerService,
    private loading: LoadingService,
    private activeRoute: ActivatedRoute
  ) {
    this.customerId = this.activeRoute.snapshot.params['id'];
    console.log(this.customerId)
  }

  ngOnInit() {
    this.getListOfDocument()
  }

  getListOfDocument(){
    this.documents = []
    this.loading.show();
    this.customerService.getDocumentList().subscribe({
      next: (out)=> {
        this.loading.hide();
        this.documents = out
        if (this.documents.length > 0){
          this.selectDocId = this.documents[0].id;
          this.docTitle = this.documents[0].title
          this.documents.forEach(item =>{
            item.properties?.forEach(prop =>{
                prop.descriptor = prop.descriptor ? JSON.parse(prop?.descriptor) : null;

                if(prop.propertyType === this.propertyTypeEnum.MultiSelect){
                  prop.value = prop.defaultValue ? JSON.parse(prop?.defaultValue) : null;
                } else {
                  prop.value = prop.defaultValue ?? null;
                }



                if (prop.descriptor && Array.isArray(prop.descriptor)){
                  prop.descriptor.forEach((item, index) => {this.parameters.push({title: item})})
                }
                if (prop.propertyType === this.propertyTypeEnum.Date){
                  if (prop.defaultValue){
                    this.startDateTimeControl.patchValue(moment(prop?.defaultValue).locale('fa').format('YYYY-MM-DD').toString());
                  } else {
                    this.startDateTimeControl.patchValue(null);
                  }
                }
              })
          })


          this.getDocumentInstanceByCustomer();
        }
        console.log(this.documents)

      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  getDocumentInstanceByCustomer(event?:any){
    if (event) {
      this.pagination.from = event.first; // index شروع
      this.pagination.rows = event.rows;   // تعداد رکورد در صفحه
    }
    this.many = {};
    this.loading.show();
    this.tableLoading = true
    this.customerService.getDocumentInstancesByCustomer(this.selectDocId,+this.customerId,this.pagination.from, this.pagination.rows).subscribe({
      next: (out)=>{
        this.loading.hide();
        this.tableLoading = false;
        this.many.items = out.items;
        this.totalRecords = out.totalRecords

        this.many.items.forEach(item=>{
            item.propertiesValue?.forEach(prop => {
              // prop.property.descriptor = prop.property.descriptor ? JSON.parse(prop.property.descriptor) : null;
              const descriptor = prop.property.descriptor ? JSON.parse(prop.property.descriptor) : null;
              prop.property.descriptor = descriptor;

              if (prop.property.propertyType === this.propertyTypeEnum.SingleSelect) {
                const val = prop.value ? JSON.parse(prop.value) : null;
                if (val && descriptor) {
                  const descriptorIds = descriptor.map((d: any) => d.id);
                  prop.value = descriptorIds.includes(val.id) ? { id: val.id, value: val.value } : null;
                } else {
                  prop.value = null;
                }
              }

              if (prop.property.propertyType === this.propertyTypeEnum.MultiSelect) {
                const val = prop.value ? JSON.parse(prop.value) : null;
                if (val && descriptor) {
                  const descriptorIds = descriptor.map((d: any) => d.id);
                  prop.value = Array.isArray(val) ? val.filter((x: any) => descriptorIds.includes(x.id)) : [];
                } else {
                  prop.value = null;
                }
              }
              // if (prop.property.propertyType === this.propertyTypeEnum.SingleSelect || prop.property.propertyType === this.propertyTypeEnum.MultiSelect) {
              //   // prop.value = Array.isArray(val) ? val.join('، ') : val;
              //   prop.value = val;
              // }

            });
        })

        console.log(this.many)

      },
      error: (err)=> {
        this.loading.hide();
        this.tableLoading = false;
      }
    })
  }

  onSubmit(){
    console.log(this.documents)
    const input: ICreatDocumentInstance = {
      documentId: null,
      customerId: this.customerId,
      propertiesValue: []
    };

    this.documents.forEach(item => {
      input.documentId = item.id;

      item.properties.forEach(prop => {
        const obj = { propertyId: prop.id, value: null };

        if (prop.propertyType === this.propertyTypeEnum.MultiSelect) {
          obj.value = JSON.stringify(prop.value);
        }

        if (prop.propertyType === this.propertyTypeEnum.SingleSelect) {
          obj.value = JSON.stringify(prop.defaultValue);
        }

        if (
          prop.propertyType === this.propertyTypeEnum.ShortString ||
          prop.propertyType === this.propertyTypeEnum.LongString ||
          prop.propertyType === this.propertyTypeEnum.Number
        ) {
          obj.value = prop.defaultValue;
        }

        if (prop.propertyType === this.propertyTypeEnum.Document) {
          obj.value = String(prop.descriptor);
        }

        if (prop.propertyType === this.propertyTypeEnum.Date) {
          obj.value = this.startDate ? this.startDate.trim().concat('T00:00:00') : prop.defaultValue;
        }

        if (prop.propertyType === this.propertyTypeEnum.Bool) {
          obj.value = String(prop.defaultValue);
        }

        input.propertiesValue.push(obj);
      });
    });

    console.log(input);
    this.loading.show();
    this.customerService.postCreateDocumentInstance(input).subscribe({
      next:(out) =>{
        this.loading.hide();
        this.pagination.from = 0;
        this.pagination.rows= 20;
        this.many = {};
        this.totalRecords = 0;

        this.getDocumentInstanceByCustomer()
        this.showDialog = false;

      },
      error: (err) =>{
        this.loading.hide();
      }
    })

  }

  onUpdateSubmit(){
    console.log(this.docDetail)

    const input: IUpdateDocInstance = {
      documentInstanceId: this.docDetail.id,
      propertiesValue: []
    };

    this.docDetail.propertiesValue.forEach(item => {
      const prop = item.property;

      const obj: any = {
        propertyId: prop.id,
        value: null
      };

      switch (prop.propertyType) {
        case this.propertyTypeEnum.MultiSelect:
          obj.value = JSON.stringify(prop.value);
          break;

        case this.propertyTypeEnum.SingleSelect:
          obj.value = JSON.stringify(prop.defaultValue);
          break;

        case this.propertyTypeEnum.ShortString:
        case this.propertyTypeEnum.LongString:
        case this.propertyTypeEnum.Number:
          obj.value = prop.defaultValue;
          break;

        case this.propertyTypeEnum.Document:
          obj.value = String(prop.descriptor);
          break;

        case this.propertyTypeEnum.Date:
          obj.value = this.startDate
            ? this.startDate.trim().concat('T00:00:00')
            : prop.defaultValue;
          break;

        case this.propertyTypeEnum.Bool:
          obj.value = String(prop.defaultValue);
          break;
      }

      input.propertiesValue.push(obj);
    });

    console.log(input);
    this.loading.show();
    this.customerService.putUpdateDocumentInstance(input).subscribe({
      next:(out) =>{
        this.loading.hide();
        this.pagination.from = 0;
        this.pagination.rows= 20;
        this.many = {};
        this.totalRecords = 0;

        this.getDocumentInstanceByCustomer()
        this.showDialog = false;

      },
      error: (err) =>{
        this.loading.hide();
      }
    })

  }

  onSave() {
    const propertiesValue = this.currentDocument.map(prop => {
      const obj: any = {
        propertyId: prop.id,
        value: null
      };

      switch (prop.propertyType) {
        case this.propertyTypeEnum.MultiSelect:
          // obj.value = prop.value.length > 0 ? JSON.stringify(prop.value) : null;
          if (prop.value && prop.value.length > 0){
            const options = this.getParameters(prop);
            const selectedFullObjects = options.filter(opt => prop.value.includes(opt.id));
            obj.value = JSON.stringify(selectedFullObjects)
          }else {
            obj.value = null
          }
          break;

        case this.propertyTypeEnum.SingleSelect:
          // obj.value = prop.defaultValue ? JSON.stringify(prop.defaultValue) : null;
          if (prop.defaultValue) {
            const options = this.getParameters(prop);
            const selectedFullObject = options.find(opt => opt.id === prop.defaultValue);
            obj.value = selectedFullObject ? JSON.stringify(selectedFullObject) : null;
          } else {
            obj.value = null;
          }
          break;

        case this.propertyTypeEnum.ShortString:
        case this.propertyTypeEnum.LongString:
        case this.propertyTypeEnum.Number:
          obj.value = prop.defaultValue ?? null;
          break;

        case this.propertyTypeEnum.Document:
          obj.value = prop.value ? String(prop.value) : null;
          break;

        case this.propertyTypeEnum.Date:
          obj.value = this.startDate
            ? this.startDate.trim().concat('T00:00:00')
            : prop.defaultValue;
          break;

        case this.propertyTypeEnum.Bool:
          obj.value = String(prop.defaultValue);
          break;
      }

      return obj;
    });

    if (this.isEditMode) {
      const input: IUpdateDocInstance = {
        documentInstanceId: +this.currentDocumentInstanceId,
        propertiesValue
      };
      // console.log(input)
      this.updateDocument(input);
    } else {
      const input: ICreatDocumentInstance = {
        documentId: +this.selectDocId,
        customerId: +this.customerId,
        propertiesValue
      };

      // console.log(input)
      this.createDocument(input);
    }
  }

  private createDocument(input: ICreatDocumentInstance) {
    this.loading.show();
    this.customerService.postCreateDocumentInstance(input).subscribe({
      next: () => {
        this.afterSave();
      },
      error: () => this.loading.hide()
    });
  }

  private updateDocument(input: IUpdateDocInstance) {
    this.loading.show();
    this.customerService.putUpdateDocumentInstance(input).subscribe({
      next: () => {
        this.afterSave();
      },
      error: () => this.loading.hide()
    });
  }

  private afterSave() {
    this.loading.hide();
    this.pagination.from = 0;
    this.pagination.rows = 20;
    this.many = {};
    this.totalRecords = 0;
    this.getDocumentInstanceByCustomer();
    this.showDialog = false;
  }


  detailDocumentInstance(id:number, docId:number){
    this.loading.show();
    this.customerService.getDetailDocumentInstance(id).subscribe({
      next:(out) =>{
        this.loading.hide();
        this.currentDocumentInstanceId = out.id
        // this.docDetail = out

        this.currentDocument = [];
        const doc = this.documents.find(d => d.id === docId)
        if (!doc) return;

        //  merge properties + values
        this.currentDocument = this.buildCurrentDocument(
          doc.properties || [],
          out.propertiesValue
        );
        console.log(this.currentDocument)
        // نمایش مقدار داکیومنت در زمان ویرایش
        const docProp = this.currentDocument.find(x => x.propertyType === this.propertyTypeEnum.Document);
        if (docProp){
          this.getAllDocumentInstanceByCustomer(+docProp.descriptor,docProp.value)
        }

        this.showDialog = true
        this.isEditMode = true

      },
      error:(err)=>{
        this.loading.hide()
      }
    })
  }

  deleteDocumentInstance(id:number){
    console.log(id)
    this.loading.show();
    this.customerService.deleteDocumentInstance(id).subscribe({
      next:(out) =>{
        this.loading.hide();
        this.pagination.from = 0;
        this.pagination.rows= 20;
        this.many = {};
        this.totalRecords = 0;

        this.getDocumentInstanceByCustomer()
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }


  get hasTitleInParameters(): boolean {
    return this.parameters?.some(p => !!p?.title);
  }

  // Date Func
  initialStartDatePicker(event: any) {
    this.startDate = event.gregorian;
  }
  selectStartDate(event: any) {
    this.startDate = event.gregorian
  }

  onPageChange(event: PaginatorState) {
    this.pagination.from = event.first;
    this.pagination.rows = event.rows;
    this.getDocumentInstanceByCustomer()
  }

  onTabChange(event: TabViewChangeEvent) {
    const doc = this.documents[event.index];
    if (!doc) return;

    this.selectDocId = doc.id;
    this.pagination.from = 0;
    this.pagination.rows= 20;
    this.many = {};
    this.totalRecords = 0;
    this.docTitle = doc.title
    this.getDocumentInstanceByCustomer()
  }

  instanceCustomer:{title:string; value:any}[] = []
  test:any
  onShowDialog(doc:DocumentModelType){
    this.isEditMode = false;
    this.currentDocumentInstanceId = null;
    this.currentDocument = doc.properties?.map(p => {
      const prop = new CreatePropertyDTO(p);

      if (prop.propertyType === this.propertyTypeEnum.Date) {
        if (prop.defaultValue){
          this.startDateTimeControl.patchValue(moment(prop.defaultValue).locale('fa').format('YYYY-MM-DD').toString());
        } else {
          this.startDateTimeControl.patchValue(null);
        }
      }

      return prop;
    }) || [];

    const docProp = this.currentDocument.find(x => x.propertyType === this.propertyTypeEnum.Document);
    if (docProp){
      this.getAllDocumentInstanceByCustomer(+docProp.descriptor)
    }
    this.showDialog = true;
    console.log(this.currentDocument)
  }


  getAllDocumentInstanceByCustomer(docId:number, selectDocumentValue?:string){
    this.loading.show();
    this.customerService.getAllDocumentInstancesByCustomer(docId,this.customerId).subscribe({
      next:(out) =>{
        this.loading.hide();
        const newOptions: { title: string; value: any }[] = [];

        out.items.forEach(item => {
          item.propertiesValue.forEach(prop => {
            if (prop.property.isCaption) {
              // اضافه کردن فقط اگر قبلاً اضافه نشده باشد
              if (!newOptions.some(o => o.value === item.id)) {
                newOptions.push({ title: prop.value, value: item.id });
              }
            }
          });
        });

        this.instanceCustomer = newOptions;

        // اصلاح value انتخابی داکیومنت در زمان ویرایش
        if (selectDocumentValue){
          const doc = this.currentDocument.find(x => x.propertyType === this.propertyTypeEnum.Document)
          if (doc) {
            const match = this.instanceCustomer.find(o => o.value === +selectDocumentValue);
            if (match) {
              doc.value = match.value;
            } else {
              doc.value = null;
            }
          }
        }

        console.log(this.instanceCustomer)
      },
      error:(err) =>{
        this.loading.hide();
      }
    })
  }


  getParameters(prop:CreatePropertyDTO){
    if (!prop?.descriptor) return [];
    let parsed = prop.descriptor;

    // اگر descriptor هنوز string باشد
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }

    if (!Array.isArray(parsed)) return [];
    return parsed;
  }


  buildCurrentDocument(baseProperties: CreatePropertyDTO[], values: any[]): CreatePropertyDTO[] {

    return baseProperties.map(prop => {
      const clonedProp = new CreatePropertyDTO(prop);

      // پیدا کردن مقدار مربوط به این property
      const found = values.find(v => v.property.id === prop.id);
      console.log('prop.id', prop.id, 'found:', found);
      if (!found) return clonedProp;

      const val = found.value;

      switch (prop.propertyType) {
        case this.propertyTypeEnum.ShortString:
        case this.propertyTypeEnum.LongString:
        case this.propertyTypeEnum.Number:
          clonedProp.defaultValue = val ?? null;
          break;

        case this.propertyTypeEnum.SingleSelect:
          // const parsed = JSON.parse(val);
          // clonedProp.defaultValue = parsed.id;
          const parsedValue = JSON.parse(val);
          const descriptor = JSON.parse(found.property.descriptor);
          const descriptorIds = descriptor.map((d: any) => String(d.id));

          clonedProp.defaultValue = descriptorIds.includes(parsedValue.id) ? parsedValue.id : null;
          break;

        case this.propertyTypeEnum.MultiSelect:
          // clonedProp.value = val ? JSON.parse(val) : null;
          if (val){
            const parsedValue = JSON.parse(val);
            const descriptor = JSON.parse(found.property.descriptor)
            const descriptorIds = descriptor.map((d: any) => d.id);

            clonedProp.value = parsedValue.map((x: any) => x.id).filter((id: string) => descriptorIds.includes(id));
            // clonedProp.value = parsed.map((x: any) => x.id);
          } else { clonedProp.value = null }
          break;

        case this.propertyTypeEnum.Date:
          if (val) {
            this.startDateTimeControl.patchValue(
              moment(val).locale('fa').format('YYYY-MM-DD').toString()
            );
          }
          clonedProp.defaultValue = val;
          break;

        case this.propertyTypeEnum.Document:
          clonedProp.value = val;
          break;
      }

      return clonedProp;
    });
  }

  changeDefaultValue(event: any, item:CreatePropertyDTO) {
    // itemValue for MultiSelect   AND   value for singeSelect
    if (event.itemValue){
      item.value = [...event.itemValue];
    } else {
      item.defaultValue = event.value;
    }
    console.log(item, event)
  }

}
