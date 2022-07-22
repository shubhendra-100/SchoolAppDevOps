import { LightningElement,track,wire, } from 'lwc';
import saved from '@salesforce/apex/saveandnew.saved';
import { getListInfoByName } from 'lightning/uiListsApi';
import getAccountDataToExport from '@salesforce/apex/extype.getAccountDataToExport';
import retrieveAccounts from '@salesforce/apex/listdel.retrieveAccounts';
import{ShowToastEvent} from 'lightning/platformShowToastEvent';
import{ createRecord } from 'lightning/uiRecordApi';
// import searchdep from '@salesforce/apex/findDepartment.searchdep';
import getSingleContact from '@salesforce/apex/listdel.getSingleContact';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import School_object from '@salesforce/schema/School_Type__c';
import school_type from '@salesforce/schema/School_Type__c.Name';
import findDepartment from '@salesforce/apex/searchdep.findDepartment';
import addschool from '@salesforce/apex/addschool.addschool';
// import showschool from '@salesforce/apex/addschool.showschool';


// import Soq from '@salesforce/apex/addschool.Soq';

const actions = [
    {
        label: 'edit', name: 'edit', iconName: "utility:edit",
        alternativeText: "edit",
        title: "edit", 
    
    } ,
    {
        label: 'Delete', name: 'delete', iconName: "utility:delete",
        alternativeText: "Delete",
        title: "Delete", 
    
    } ,
 
];


const columns = [
    { label: 'Department Id', fieldName: 'Department_ID__c' },
    { label: 'Department Name', fieldName: 'Name' },
    { type: 'action', typeAttributes: { rowActions: actions } }
];
const columns1 = [
    { label: 'School Type', fieldName: 'DepartmentClass__r' },
    { label: 'ClassSchool', fieldName: 'ClassSchool__r' },
    { label: 'LastModifiedBy', fieldName: 'LastModifiedByName' },
    { label: 'LastModifiedDate', fieldName: 'LastModifiedDate' },
    
    { type: 'action', typeAttributes: { rowActions: actions } }
];

export default class AcademicListTable extends LightningElement {
    @track recid = [];
    @track DelId=[];
    @track isDelete;
    @track recordID;
    @track Department__c;
    @track error;
    @track data;
    @track columns = columns;
    @track arr = [];
    @track isModalOpen = false;


    @track options = [];
  
  

    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }
    
    handleModalChange(event) {

        this.isModalOpen = event.detail;

    }
    columns1 = columns1;
    // @wire(showschool)

    // wiredClasses({ error, data }) {

    //     if (data) {

    //         this.data = data.map((item) => {

    //             return {

    //                 Id: item.Id,

    //                 Name: item.Name,

    //                 DepartmentClass__r : item.DepartmentClass__r.Name,
    //                 ClassSchool__r : item.ClassSchool__r.Name,

    //                 LastModifiedByName: item.LastModifiedBy.Name,
    //                 LastModifiedDate : item.LastModifiedDate.split('T')[0]

    //             }

    //         });

    //         this.error = undefined;

    //     } else if (error) {

    //         this.error = error;

    //         this.data = undefined;

    //     }

    // }
  
    
    value = ['option1'];
    
    

    

    get selectedValues() {
        return this.value.join(',');
    }

    handleChange(e) {
        this.value = e.detail.value;
    }
    // @wire(addschool)
    // wiredaddschol({ data, error }) {
    //     console.log('enemy'+JSON.stringify(data))
    //     if (data) {
    //          console.log( 'this'+ JSON.stringify(data) );
    //         // this.options = data;
    //         // console.log( 'this1'+ JSON.stringify(data) );
    //         // this.error = undefined;
    //        let obj=[];
    //        for(let x of data){
    //         obj.push({'label':`${x.Name} [${x.Classes__r.map(el=>el.Name)}]`,'value':x.Name});
    //        }
    //        this.options = obj;
    //        console.log('how'+this.options);
    //     } else if (error) {
    //         console.log('this2'+ JSON.stringify(error) );
    //         this.error = error;
    //         console.log( 'this3'+ JSON.stringify(data) );
    //         this.options = undefined;
    //     }
    // }

    columns = columns;

   searchKey='';
   
       @wire(saved)
    wiredDepartments({ data, error }) {
        console.log('dataa=========>'+JSON.stringify(data))
        if (data) {
            console.log( 'this'+ JSON.stringify(data) );
            this.Department__c = data;
            console.log( 'this1'+ JSON.stringify(data) );
            this.error = undefined;
        } else if (error) {
            console.log('this2'+ JSON.stringify(error) );
            this.error = error;
            console.log( 'this3'+ JSON.stringify(data) );
            this.Department__c = undefined;
        }
    }
    @track conatctData = {}

    columnHeader = ['ID', 'Name' ]

    @wire(getAccountDataToExport)
    wiredData({ error, data }) {
        if (data) {
            console.log('Data', data);
            this.conatctData = data;
        } else if (error) {
            console.error('Error:', error);
        }
    }

    
    @track DepartmentList;
    depname='';
    @wire(findDepartment,({searchKey:'$depname'}))
    wiredDepartments({ data, error }) {
        console.log('dataa=========>'+JSON.stringify(data))
        if (data) {
            console.log( 'this'+ JSON.stringify(data) );
            this.Department__c = data;
            console.log( 'this1'+ JSON.stringify(data) );
            this.error = undefined;
        } else if (error) {
            console.log('this2'+ JSON.stringify(error) );
            this.error = error;
            console.log( 'this3'+ JSON.stringify(data) );
            this.Department__c = undefined;
        }
    }

    handlesearch(event){
        this.depname = event.target.value;
    }

    exportContactData(){
        // Prepare a html table
        let doc = '<table>';
        // Add styles for the table
        doc += '<style>';
        doc += 'table, th, td {';
        doc += '    border: 1px solid black;';
        doc += '    border-collapse: collapse;';
        doc += '}';          
        doc += '</style>';
        // Add all the Table Headers
        doc += '<tr>';
        this.columnHeader.forEach(element => {            
            doc += '<th>'+ element +'</th>'           
        });
        doc += '</tr>';
        // Add the data rows
        this.Department__c.forEach(record => {
            doc += '<tr>';
            doc += '<th>'+record.Id+'</th>'; 
            doc += '<th>'+record.Name+'</th>';  
            doc += '</tr>';
        });
        doc += '</table>';
        var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
        let downloadElement = document.createElement('a');
        downloadElement.href = element;
        downloadElement.target = '_self';
        // use .csv as extension on below line if you want to export data as csv
        downloadElement.download = 'Contact Data.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click();
    }
    rowActionHandler(event){ 
        
        const rowDel = [];

        if (event.detail.action.name === "delete") {
          this.isDelete = true;
          this.recid.push(event.detail.row.Id);
        }
                //        this.DelId = rowDel;
                //         retrieveAccounts({ arr: rowDel })

                //                 .then((res) =>{ this.Department__c = res;
                                    
                //                     this.dispatchEvent(
                //                         new ShowToastEvent({
                //                             title: 'Success',
                //                             message: 'Record successfully deleted',
                //                             variant: 'success',
                //                         }),
                //                     );
                                
                //                     location.reload()})
                //                 .catch(error => {
                //     console.log('error=====>'+JSON.stringify(error))

                //     this.dispatchEvent(
                //         new ShowToastEvent({
                //             title: 'Error deleting record',
                //             message: 'record is associated with other object',
                //             variant: 'error',
                //         }),
                //     );
                //     location.reload();
                // });
                
        if (event.detail.action.label === 'edit') {

            this.recordID = event.detail.row.Id;

            this.isModalOpen = true;

        }
        

    }

    deleterow(){
        let sa = this.getSelectedRec();
        console.log('002'+this.sa);
        // this.DelId = this.getSelectedRec();
        if(this.getSelectedRec().length>0){
            this.isDelete = true;
            this.recid = this.getSelectedRec();
            console.log('create',this.getSelectedRec())
        }
        console.log('oo1'+this.getSelectedRec())
        if(!this.getSelectedRec()){

            console.log('oo')
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting record',
                    message: 'select atleast one record',
                    variant: 'error',
                }),
            );
        }
        if(this.getSelectedRec().length==0){

            
        }
    }
    closemodaldelete(event){
        this.isDelete = event.detail;
    }
    
    getSelectedRec() {
        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        console.log('end:')
        let len =selectedRecords.length;
        console.log('after:')
        
        if(selectedRecords.length > 0){
        console.log('before:')
            let sas = JSON.parse(JSON.stringify(selectedRecords));
            console.log('now',this.DelId);

            return sas.map(currentItem => {
               // this.DelId.push(currentItem.Id);
               return currentItem.Id;
            });
        }   

        return false;
      }
     
    



      }