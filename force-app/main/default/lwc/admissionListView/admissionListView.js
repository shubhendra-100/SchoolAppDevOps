import { LightningElement, wire, track } from 'lwc';
import listViewAdmission from '@salesforce/apex/admissionListViewController.listViewAdmission';
import deleteAdmission from '@salesforce/apex/admissionListViewController.deleteAdmission';
import refreshApex from '@salesforce/apex';
import fetchAcademicYear from '@salesforce/apex/createAdmission.fetchAcademicYear';
import searchBarRecords from '@salesforce/apex/admissionListViewController.searchBarRecords';
import { NavigationMixin } from 'lightning/navigation';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


const actions = [
    {
        label: 'Edit', name: 'edit', iconName: "utility:edit",
        alternativeText: "Edit",
        title: "Edit"
    },
    {
        label: 'Delete', name: 'delete', iconName: "utility:delete",
        alternativeText: "Delete",
        title: "Delete"
    }
   
];


const columns = [
    { label: 'Classes', fieldName: 'Assign_Class_Name', editable: true,sortable: "true"},
    { label: 'No. Of Seats', fieldName: 'Total_No_of_Seats__c', editable: true,sortable: "true" },
    { label: 'Seats Filled', fieldName: 'Seats_Filled__c',sortable: "true" },
    { label: 'Seats Available', fieldName: 'No_of_Seats_Available__c',sortable: "true" },
    { label: 'Admission Status', fieldName: 'Admission_Status__c', editable: true,sortable: "true" },
    { label: 'Starting Fee', fieldName: 'Starting_Fee__c', editable: true,sortable: "true" },
    // { label: 'Last Modified By', fieldName: 'LastModifiedById', editable: true, },
    // { label: 'Last Modified Date', fieldName: 'LastModifiedDate', editable: true },
    { label: 'Admission Available', fieldName: 'Admission_Available_on_Website__c', type:'boolean', editable: true,sortable: "true" },
    { type: 'action', typeAttributes: { rowActions: actions } }
];

export default class AdmissionListView extends NavigationMixin(LightningElement) {
@track options = [];
@track sortBy;
@track sortDirection;
@track dataListcopy=[];
@track arr=[];
 

@track deleteWindow=false;

openDeleteWindow(){
  this.deleteWindow=true;
}
handleModalChange(event){
    this.deleteWindow=event.detail
}

academicYear(monthName){
    switch(monthName){
        case "Jan": return '1';
        
        case "Feb": return '2';
      
        case "Mar": return'3';
        
        case "Apr": return'4';
        
        case "May": return'5';
        
        case "June": return '6';
      
        case "July": return '7';

        case "Aug": return '8';
       
        case "Sep": return '9';
      
        case "Oct": return '10';

        case "Nov": return '11';
        
        case "Dec": return '12';
        
        default: console.log("Invalid Data.");

    }
}

    @wire(fetchAcademicYear) 
    wiredFetchAY({error, data}){
        if(data){
            console.log('Dataaaaaaaaaaaaaaaaaaa'+data)
            console.log('academiccc'+this.academicYear)
            let obj=[];
            for( let x of data){
                obj.push({'label': x.From_Year__c +'/'+ this.academicYear(x.From_Month__c) +  ' - '  + x.To_Year__c+'/'+ this.academicYear(x.To_Month__c), 
                'value': x.From_Year__c +'/'+ this.academicYear(x.From_Month__c) +  ' - '   +  x.To_Year__c+'/'+ this.academicYear(x.To_Month__c)})
            }
            this.options = obj
            // this.options = data.map(item=>{
            //     return 
            //          {label: item.From_Year__c, value: item.From_Year__c};
            // })
            console.log('Optionssss->' +JSON.stringify(this.options));

        } 
        else{
            console.log(error);
        }
    }

    get status(){
        console.log('statusssssssssss'+JSON.stringify(this.dataList));
        let  oj = 'Open';
       
        let isClosed = this.dataList.find((x)=> x.Admission_Status__c =='Closed');
        let isOpen = this.dataList.find((x)=> x.Admission_Status__c =='Open');
        let isStatusNull = this.dataList.find((x)=> x.Admission_Status__c ==null);

        if(this.dataList.length == 0 || (isOpen== null && (isClosed || isStatusNull))){
            oj ='Closed';
        }
        return oj
    }


    get nos(){
        // console.log('Beforeee')
        if(this.dataListcopy.length>0){
            return this.dataListcopy.reduce((previousValue,currentValue) => Number(previousValue) + Number(currentValue.Total_No_of_Seats__c),0);
        }        
    }

    get vals(){
        if(this.dataListcopy.length>0){
            return this.dataListcopy.reduce((previousValue,currentValue) => Number(previousValue) + Number(currentValue.Seats_Filled__c),0);
        }
        else{
            return 0;
        }   
    }

    get answer(){
        if(this.dataListcopy.length>0){
            return this.dataListcopy.reduce((previousValue,currentValue) => Number(previousValue) + Number(currentValue.No_of_Seats_Available__c),0);
        }
        else{
            return 0;
        }      

    }
    @track openPopup = false;
    
    popup() {
        this.dispatchEvent(new CustomEvent('edit',{
            detail:true
        }))
    }

    closePopUp(event){
        this.dispatchEvent(new CustomEvent('close',{
            detail:true
        }))

    }

     @track isModalOpen = false;
    columns = columns;
    academic;
    admission;
    getResults;
    selectedAdmission;
    admissionResult;
    admissionVal;
    admissionAnswer;
    delId=[];
    @track editRecordId;
    @track editObj ={};

    @track editData={
        'Starting_Fee__c':null
    };
    
    @track dataList=[];

    fldsItemValues = [];

    searchData = '';

    @track wiredList = [];

    @wire(searchBarRecords, { keySearch: '$searchData' })
    wireSearchRecords(result) {
        // console.log('Heloooooooo23')
        this.wiredList = result
        // console.log('resiultt===>' + JSON.stringify(result))
        if (result.data) {
            let objList = JSON.parse(JSON.stringify(result.data))
            for(let x of objList){
               x['Assign_Class_Name'] = x.Assign_Classes__r.Name
               x.Total_No_of_Seats__c = x.Total_No_of_Seats__c == null?0:x.Total_No_of_Seats__c
            }
            this.dataList = objList;
            this.dataListcopy = objList;
        }

        else if (result.error) {
            // console.log(JSON.stringify(result.error));
            this.dataList = undefined;
        }
    }

    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.dataList));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.dataList = parseData;
    }

    getsearchRecords(event) {
        this.searchData = event.detail.value;
    }
    

    @wire(listViewAdmission)

    admissionWire(result) {
        // console.log('checkkkk123')
        // console.log(result);
        this.getResults = result;

        if (result.data) {
            // console.log('resultttttttt1')
            this.admission = result.data.map((row) => {
                // console.log('resultttttttt2')
                return this.mapAdmission(row);

            }
            )
            this.admissionVal = result.data;
            console.log(this.admission)
        } 

       if (result.error) {
            console.error(result.error);
        }

    }
    mapAdmission(row) {
        // console.log(row);
        return {
            ...row
        };

    }

    handleAccountSelection(event) {
        this.academic = event.detail;
        // console.log(this.academic);
    }

    getSelectedRec() {

        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        let len =selectedRecords.length;
        if(selectedRecords.length > 0){
            console.log('selectedRecords are '+JSON.stringify(selectedRecords));
            selectedRecords.forEach(currentItem => {
                console.log('Selecteeeed')
                this.arr.push(currentItem.Id);
                console.log('Selecteeeed134')
            }); 
        }  
        return len;
      }

    rowSelectionHandler(event) {
       
        this.selectedAdmission = event.detail.selectedRows;
        console.log('Rowssssssss'+JSON.stringify(this.selectedAdmission))
    }

    keyUpHandler(event){
        console.log('Eevnt1'+JSON.stringify(event))
        console.log('Event->'+JSON.stringify(event.detail))
        console.log('Event112233'+event.detail.draftValues)
        console.log('Eventwwwwwww'+event.target.value)
    }

    rowActionHandler(event) {
        console.log('Checkingg')

        if(event.detail.action.label==='Delete'){
            this.deleteWindow=true;

            this.delId=event.detail.row.Id;
            console.log('dfghgfdfgh'+this.delId)
        
        // deleteAdmission({ admissionIds: [event.detail.row.Id] }).then((res) => {
        //     //this.searchData = '';
        //     location.reload();
        // })
    // this.dispatchEvent(
    //     new ShowToastEvent({
    //         title: 'Success',
    //         message: 'Records Deleted Successfully!!',
    //         variant: 'success'
    //     })
    // );

     
    }

    else{
        // console.log('edit')
        this.editObj = this.dataList.find(x=>x.Id==event.detail.row.Id);
        this.editRecordId=event.detail.row.Id;
            this.openPopup = true
            // console.log('EdittttttttttttObj' +JSON.stringify(this.editObj) )
            

          this.editData.Academic_Year__c=this.editObj.Academic_Year__c
          this.editData.Admission_Close_Date__c=this.editObj.Admission_Close_Date__c
        //   console.log( 'Closeeeeeeeeeeee' +this.editData.Admission_Close_Date__c);
          this.editData.Assign_Classes__c=this.editObj.Assign_Classes__c
          this.editData.No_of_Seats_Available__c=this.editObj.No_of_Seats_Available__c
          this.editData.Starting_Fee__c=this.editObj.Starting_Fee__c
        //   console.log( this.editData.Starting_Fee__c);
          this.editData.Minimum_Age_limit__c=this.editObj.Minimum_Age_limit__c
          this.editData.Required_Proofs__c=this.editObj.Required_Proofs__c
          this.editData.Admission_Status__c=this.editObj.Admission_Status__c
          this.editData.Max_No_of_Applications__c=this.editObj.Max_No_of_Applications__c
          this.editData.Total_No_of_Seats__c=this.editObj.Total_No_of_Seats__c
          this.editData.Seats_Filled__c=this.editObj.Seats_Filled__c
          this.editData.Admission_Available_on_Website__c=this.editObj.Admission_Available_on_Website__c
          this.editData.Maximum_Age_limit__c=this.editObj.Maximum_Age_limit__c
          


     }
    }

    deleteHandler() {
       
        if(this.getSelectedRec()>0){        
        console.log('Delete')
        this.deleteWindow=true;
        for(let x of this.selectedAdmission){
            console.log('this.selectedAdmission'+this.selectedAdmission)
            this.delId.push(x.Id);
        }

        // const idList = this.selectedAdmission.map(row => { return row.Id })
        // deleteAdmission({ admissionIds: idList }).then(() => {
        //     //return refreshApex(this.dataList);
        //     location.reload();
        // })

        // this.template.querySelector('lightning-datatable').selectedRows = [];
        // this.selectedAdmission = undefined;

        // this.dispatchEvent(
        //     new ShowToastEvent({
        //         title: 'Success',
        //         message: 'Records Deleted Successfully!!',
        //         variant: 'success'
        //     })
        // );
    }
    else if(this.getSelectedRec()==0){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error While Deleting Record',
                message: 'Please select a record to Delete',
                variant: 'error',
            }),
        );
    }
}

    handleCloseModal(event) {
        this.isModalOpen = event.detail
        this.openPopup = event.detail
    
    }

    handleSaveHandler(event){
        this.isModalOpen = event.detail
    }

    saveHandleAction(event) {
        this.fldsItemValues = event.detail.draftValues;
        const inputsItems = this.fldsItemValues.slice().map(draft => {
            // console.log('inside save')
            const fields = Object.assign({}, draft);
            return { fields };
        });


        const promises = inputsItems.map(
            recordInput =>
                updateRecord(recordInput));
        // console.log(promises)

        Promise.all(promises).then(res => {
            // console.log('Promises')
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated Successfully!!',
                    variant: 'success'
                })
            );
            this.fldsItemValues = [];
            this.refresh();
        }).catch(error => {
             console.log(JSON.stringify(error))
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An Error Occured!!',
                    variant: 'error'
                })
            );
        }).finally(() => {
            this.fldsItemValues = [];
        });
    }
    refresh() {
        // console.log('Refresh')

        location.reload();
        // console.log('refresh2345')
    }
    
    openModal(event){
        this.isModalOpen = true;

    }
}