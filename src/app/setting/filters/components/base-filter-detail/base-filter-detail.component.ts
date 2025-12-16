import {Component, OnInit} from '@angular/core';
import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {LoadingService} from "../../../../_services/loading.service";
import {FiltersService} from "../../../_services/filters.service";
import {
  CreateFilterDTO,
  DynamicData, FieldFilterDescriptor,
  FieldValue, FilterField, FilterGroup,
  IEntities, ParameterGroup,
} from "../../../_types/filter.type";
import {MessageService} from "primeng/api";


export class BaseFilterDetailComponent<T>{

  entitiesData:IEntities[];
  entityFilter:FieldFilterDescriptor[];
  filterModel: CreateFilterDTO = new CreateFilterDTO({})
  dropdownOptions:any = [];
  filters: any[] = [];
  radiobtn: string[] = [];

  filterGroupLogic:string;
  logicOptions:any = [];

  parameters = [{name: null, label:null, isErrEng:false}];
  showFilterModal:boolean = false;
  dialogParameters = []
  parameterOptionsDialog: { label: string, value: string }[] = [];
  selectedParameterDialog:any
  selectedParamRadio: 'value' | 'parameter' = 'value';
  modeFilter = [];
  constructor(protected manager: BaseSaveManager<T>,
              public service: FiltersService,
              protected loading: LoadingService) {
    this.getEntitiesData()
    this.logicOptions= [
      {label: 'همه شروط', value:'and'},
      {label: 'حداقل یکی از شروط', value:'or'},
    ]
    this.filterGroupLogic = 'and';
  }


  getEntitiesData(){
    this.loading.show();
    this.service.getEntities().subscribe(res =>{
      this.loading.hide();
      this.entitiesData = res;
    }, error => {
      this.loading.hide()
    })
  }

  getEntityFilterModelData(entity){
    this.loading.show()
    this.service.getEntitiesFilterModel(entity).subscribe({
      next: (res) =>{
        this.loading.hide();
        this.entityFilter = res;


        this.dropdownOptions = Object.entries(res).map(([key, value]) => ({
          field: value.field,
          type: value.type,
          label: value.label,
          filterParameter: value.filterParameter,
          value: { ...value, key },
        }));

        Object.keys(this.dropdownOptions).forEach(key => {
          const item = this.dropdownOptions[key];
          item.value.logic = 'and';
          if (!['object', 'array'].includes(item.type)) {
            // اگر filterParameter وجود نداره، بسازش
            if (!item.value.filterParameter || item.value.filterParameter.length === 0) {
              item.value.filterParameter = [
                {
                  filter: [
                    {
                      label: item.label,
                      logic: 'and',
                      filters: [
                        {
                          field: item.field,
                          logic: 'and',
                          type: item.type,
                          mode: 'single',
                          conditions: [
                            {
                              operator: 'and',
                              value: '',
                              parameter: ''
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  parameters: []
                }
              ];
              // item.value.filters  = [
                // {
                //   label: item.label,
                //   filters: [
                //     {
                //       // matchMode: '',
                //       operator: 'and',
                //       value: '',
                //       parameter:''
                //     }
                //   ]
                // }
              // ]
            } else {
              item.value.selectedFilter = [
                {
                  label: item.label,
                  filters: []
                }
              ]
            }
          }
        });

        console.log(this.dropdownOptions)

      },
      error: () => {
        this.loading.hide();
      }
    })
  }



  onSaveFilter(){
    const rootFilterGroup :FilterGroup ={
      label : '' ,
      filters:[],
      logic: this.filterGroupLogic,
      entity:this.filterModel.entity
    };



    const input = {
      title: this.filterModel.title,
      entity: this.filterModel.entity,
      description: this.filterModel.description,
      parameters : this.parameters,
      filter: rootFilterGroup
    }

    rootFilterGroup.filters = []

    this.filters.forEach((item,  fi) =>{
      const filterField : FilterField   = {}
      rootFilterGroup.filters.push(filterField)

      filterField.field = item.field;
      filterField.logic= item.logic;

      if (item.type !== 'object' && item.type !== 'array'){
          filterField.conditions = [];

        item.selectedFilter.forEach(select => {
          select.filterParameter.forEach(field => {
            field.filter.forEach(i =>{
              i.filters.forEach(ff=>{
                if (ff.conditions?.length) {
                  filterField.conditions.push(...ff.conditions);
                }
              })
            })
            // filterField.conditions.push(field)
          })
        })

      } else if (item.type === 'object'){
        filterField.type = "object";
        filterField.filters = item.selectedFilter;
      } else if (item.type === 'array'){
        filterField.type = "array";
        filterField.filters = item.selectedFilter;
        filterField.filters.forEach((item,index) =>{
          item.filters.forEach((mode) =>{
            mode.mode = this.modeFilter?.[index] ?? 'any';
          })
        })
        // filterField.mode = this.modeFilter?.[fi] ?? 'any';
      }
    })
    console.log('filter',this.filters)


    console.log(input)
    this.loading.show()
    this.service.onRegisterFilter(input).subscribe({
      next: (res) => {
        this.loading.hide()
      },
      error: () =>{
        this.loading.hide()
      }
    })


  }

  getFilterParameterOptions(filter: any) {
    if (!filter.filterParameter) return [];

    return filter.filterParameter
      .flatMap(fp => fp.filter ?? [])   // همه FilterGroupها
      .map(fg => ({
        label: fg.label,
        filters: fg.filters,
        logic: fg.logic
      }));
  }

  onNewFilter(){
    const newFilter = {
      field: null,           // هنوز چیزی انتخاب نشده
      label: null,           // بعد از انتخاب پر می‌شود
      selected: false,       // کنترل نمایش dropdown یا header
      filterParameter: []
      // selectedFilter: []     // پارامترهای داخل Fieldset
    };

    // به آرایه filters اضافه کن
    this.filters.unshift(newFilter);
    console.log(this.filters)
  }

  // وقتی یک گزینه از dropdown اصلی انتخاب شد
  onFieldSelected(selected: any, fi:number) {

    if (!selected) return;
    const filter = this.filters[fi]; // ردیف موجود
    if (!filter) return;

    const exists = this.filters.some(f => f.field === selected.field);
    if (exists) {
      console.warn('این فیلد قبلاً اضافه شده است:', selected.field);
      return;
    }

    const newFilter = { ...selected };

    filter.field = selected.field;
    filter.label = selected.label;
    filter.type = selected.type;
    filter.filterParameter = selected.filterParameter;
    filter.selected = true;

    if (selected.type === 'object' || selected.type === 'array') {
      // فقط یک selectedFilter بساز، که مقدار کاربر داخل آن قرار می‌گیرد
      filter.selectedFilter = [
        {
          // label: selected.label,
          label: '',
          logic: 'and',
          filterParameter: []
        }
      ];
    } else {
      // فیلدهای ساده
      filter.selectedFilter = [
        {
          // label: selected.label,
          label: '',
          filterParameter: [
            // {
            //   operator: 'and',
            //   value: '',
            //   parameter:''
            // }
            {
              filter: [
                {
                  label: selected.label,
                  logic: 'and',
                  filters: [
                    {
                      field: selected.field,
                      logic: 'and',
                      type: selected.type,
                      mode: 'single',
                      conditions: [
                        {
                          operator: 'and',
                          value: '',
                          parameter: ''
                        }
                      ]
                    }
                  ]
                }
              ],
              parameters: []
            }

          ]
        }
      ];
    }

    // this.filters = [newFilter]
    // this.filters.push(newFilter);
    // const fi = this.filters.length - 1;
    // const fi = 0;

    this.radiobtn[fi] = 'and'; // یا 'and' هرکدام که میخوای

    // if (!this.filters[fi].selectedFilter) {
    //   this.filters[fi].selectedFilter = [];
    // }

    console.log(this.filters)
  }


  // onSelecteFilter(event:any, filterIndex: number, rowIndex) {
  //   const filter = this.filters[filterIndex];
  //   if (!filter || !filter.selectedFilter) {
  //     filter.selectedFilter = [];
  //   }
  //   const selectedRow = event.value;
  //   // ردیف انتخاب شده را در selectedFilter ذخیره کن
  //   filter.selectedFilter[rowIndex] = selectedRow;
  //   console.log(filter.selectedFilter);
  //   console.log(filter);
  // }

  onSelecteFilter(event:any, filterIndex: number, rowIndex:number){
    const filter = this.filters[filterIndex];
    if (!filter || !filter.selectedFilter) {
      filter.selectedFilter = [];
    }

    // کپی عمیق
    const selectedRow = JSON.parse(JSON.stringify(event.value));
    filter.selectedFilter[rowIndex] = selectedRow;

    this.parameterOptionsDialog = this.parameters
      .filter(p => p.name?.trim() && p.label?.trim())
      .map(p => ({
        label: p.label,
        value: p.name
      }));


    const allParameters: ParameterGroup[] = filter.filterParameter?.flatMap(fp => fp.parameters ?? []) ?? [];
    let matchParams: any[] = [];
    selectedRow.filters?.forEach((fg: any) => {
      if (fg.conditions && fg.conditions.length){
        fg.conditions?.forEach((cond: any) => {
          const matches = allParameters.filter(p => p.name === cond.parameter);
          if (matches.length) {
            matchParams.push(...matches);
          }
        });
      }
      if (fg.filters && fg.filters.length){
        fg.filters.forEach(filter =>{
          filter.filters.forEach(ff =>{
            ff.conditions.forEach(cond => {
              const matches = allParameters.filter(p => p.name === cond.parameter);
              if (matches.length) {
                matchParams.push(...matches);
              }
            })
          })
        })
      }

    });

    // اگر پارامتر مطابق پیدا شد → مودال باز کن
    if (matchParams.length) {
      this.showFilterModal = true;
      const uniqueParams = matchParams.filter(
        (param, index, self) =>
          index === self.findIndex(p => p.name === param.name)
      );
      this.dialogParameters = uniqueParams.map(param => {
        let condValue = '';
        selectedRow.filters?.forEach((fg: any) => {
          fg.conditions?.forEach((cond: any) => {
            if (cond.parameter === param.name) {
              condValue = cond.value;
            }
          });
        });
        return {
          ...param,
          value: condValue,
          _targetFilter: selectedRow,
          _rowIndex: rowIndex
        };
      });
    }

    console.log(this.dialogParameters);
    console.log(filter);

  }

  saveModal(){
    if (!this.dialogParameters?.length) return;

    const rowIndex = this.dialogParameters[0]._rowIndex;  // فرض: همه پارامترها مربوط به یک ردیف هستند
    const targetFilter  = this.dialogParameters[0]._targetFilter;

    this.dialogParameters.forEach(param => {
      targetFilter.filters?.forEach((fg: any) => {
        fg.conditions?.forEach((cond: any) => {
          if (this.selectedParamRadio === 'value') {
            if (cond.parameter === param.name) cond.value = param.value;
          }
          if (this.selectedParamRadio === 'parameter') {
            cond.parameter = this.selectedParameterDialog
          }
        });
      });
    });

    this.showFilterModal = false;
    console.log(this.dialogParameters)
    console.log(this.selectedParameterDialog)
  }

  cancelModal(){
    this.showFilterModal = false
    this.selectedParameterDialog = null;
    this.dialogParameters = []
  }

  addNewRowFilter(){}

  onChangeMatchModes(event:any, filter:any, fi:number, ci:number){
    if (filter.type !== 'object' && filter.type !== 'array') {
      filter.selectedFilter[ci] = {
        label: null,
        mode: null,
        filters: [
          {
            matchMode: event.value, // مقدار انتخاب شده
            operator: this.radiobtn[fi], // از radio button فعلی استفاده می‌کنیم
            value: ''
          }
        ]
      };
    } else {
      if (!filter.selectedFilter[ci]) {
        // اگه قبلاً چیزی وجود نداشت، می‌سازیم
        filter.selectedFilter[ci] = {
          label: null,
          mode: event.value,         // مقدار انتخابی dropdown میره تو mode
          filters: [
            {
              operator: this.radiobtn[fi] ,
              value: ''
            }
          ]
        };
      } else {
        // اگر قبلاً وجود داشت، فقط mode رو آپدیت می‌کنیم
        filter.selectedFilter[ci].mode = event.value;
        // matchMode دست‌نخورده باقی می‌مونه ✅
      }
    }
  }

  onValueChange(value: any, filter: any, fi: number, ci: number){
    if (filter.selectedFilter[ci]) {
      filter.selectedFilter[ci].value = value;
    } else {
      filter.selectedFilter[ci] = {
        matchMode: filter.selectedFilter[ci]?.matchMode || 'equals',
        operator: this.radiobtn[fi],
        value: value
      };
    }
  }


  onRadioChange(filter: any, value: string) {


    const fi = this.filters.indexOf(filter);
    this.radiobtn[fi] = value;
    filter.logic = value;

    // filter.selectedFilter?.forEach((item: any) => {
    //   if (filter.type === 'object' || filter.type === 'array') {
    //     // همه sub-filters داخل object/array آپدیت شود
    //     item.filters?.forEach((f: any) => f.logic = value);
    //   } else {
    //     // اسکالر: همه شروط داخل selectedFilter بروزرسانی شود
    //     item.filters?.forEach((f: any) => f.operator = value);
    //   }
    // });


    // this.radiobtn[fi] = value;
    //
    // const targetFilter = this.filters[fi];
    // if (!targetFilter || !targetFilter.selectedFilter) return;
    //
    // targetFilter.selectedFilter.forEach(row => {
    //   if (!row || !row.filters) return;
    //   console.log(targetFilter)
    //   // row.filters ممکنه به شکل: [{id: Array(1)}, {id: Array(2)}, ...]
    //   Object.values(row.filters).forEach((filterArray: any[]) => {
    //     filterArray.forEach(f => {
    //       f.operator = value; // تغییر operator برای هر آیتم
    //     });
    //   });
    // });
    // console.log(targetFilter)
    console.log(filter)
  }


  // افزودن یک شرط جدید به یک فیلد
  addCondition(filterIndex: number) {

    const filter = this.filters[filterIndex];
    console.log(filter)
    if (!filter.filterParameter) filter.filterParameter = [];

    //کپی عمیق
    const lastRow = filter.selectedFilter[filter.selectedFilter.length - 1] || {};
    const newRow = JSON.parse(JSON.stringify(lastRow));

    if (filter.type !== 'object' && filter.type !== 'array') {
      // اگر lastRow وجود نداشت، یک ردیف جدید بساز
      // if (!newRow.filterParameter || newRow.filterParameter.length === 0) {
      //
      // }
      const newRowScaler = {
        label: '',
        filterParameter: [
          {
            filter: [
              {
                filters: [
                  {
                    conditions: [
                      {
                        operator: this.radiobtn[filterIndex] || 'eq',
                        value: '',
                        parameter: ''
                      }
                    ]
                  }
                ]
              }
            ],
            parameters: []
          }
        ]
      }
      filter.selectedFilter.push(newRowScaler);
      return;
    }

    // object یا array
    else {
      console.log(newRow)
      newRow.label = '';
      newRow.logic = 'and';
      if (!newRow.filterParameter) newRow.filterParameter = [];
      console.log(newRow)

    }

    filter.selectedFilter.push(newRow);

    // اسکالر
    // if (filter.type !== 'object' && filter.type !== 'array') {
      // filter.selectedFilter.push({
      //   label: '',
      //   filterParameter: [{ operator: this.radiobtn[filterIndex], value: '', parameter:'' }]
      // });

    //   filter.selectedFilter.push({
    //     label: '',
    //     filterParameter: [
    //       {
    //         filter: [
    //           {
    //             filters: [
    //               {
    //                 conditions: [
    //                   {
    //                     operator: this.radiobtn[filterIndex],
    //                     value: '',
    //                     parameter: ''
    //                   }
    //                 ]
    //               }
    //             ]
    //           }
    //         ]
    //       }
    //     ]
    //   });
    //
    // }
    // // آبجکت یا آرایه
    // else {
    //   filter.selectedFilter.push({
    //     // label: filter.label,
    //     label: '',
    //     logic: 'and',
    //     filterParameter: []
    //   });
    // }

  }

// حذف یک شرط
  removeCondition(filterIndex: number, rowIndex: number) {
    const filter = this.filters[filterIndex];
    if (!filter || !filter.selectedFilter) return;

    // حداقل یک ردیف باقی بماند
    if (filter.selectedFilter.length > 1) {
      filter.selectedFilter.splice(rowIndex, 1);
    }

  }

  // حذف یک fieldset
  deleteFieldset(index:number){
    this.filters.splice(index, 1);
  }

  onChangeDrp(){
    this.filters = []
    this.getEntityFilterModelData(this.filterModel.entity)
  }

  get availableParameters() {
    return this.parameters.filter(p => (p.name || '').trim() !== '' && (p.label || '').trim() !== '');
  }

  addNewParameter(){
    this.parameters.push({name:'', label:'',isErrEng: false})
  }

  removeParamenter(index:number){
    this.parameters.splice(index, 1)
  }

  allowOnlyEnglish(event: KeyboardEvent, index:number){
    const char = event.key;
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (!regex.test(char)){
      this.parameters[index].isErrEng = true;
      event.preventDefault()
    } else{
      this.parameters[index].isErrEng = false;
    }
  }

  hasAnyValue(filters: any[]): boolean {
    if (!Array.isArray(filters)) return false;
    return filters.some(f => f != null && f.value !== '' && f.value !== undefined);
  }

  onRadioSelect(type: 'value' | 'parameter') {
    this.selectedParamRadio = type;

    if (type === 'value') {
      // وقتی "مقدار" انتخاب شد، dropdown را null کن
      this.selectedParameterDialog = null;
    } else if (type === 'parameter') {
      // وقتی "پارامتر" انتخاب شد، inputها را پاک کن
      this.dialogParameters.forEach(p => p.value = '');
    }
  }

}
