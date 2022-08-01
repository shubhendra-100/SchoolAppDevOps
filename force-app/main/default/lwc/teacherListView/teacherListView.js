import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
// import editRecord from '@salesforce/apex/getTeacherId.editRecord';
//import deleteTeachers from '@salesforce/apex/TeacherRecordList.deleteTeachers';
//import deleteAclistTable from '@salesforce/apex/delTeacher.deleteAclistTable';
import getRecords from '@salesforce/apex/searchBar.getRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';



const actions = [
    {
        label: 'Edit', name: 'Edit', iconName: "utility:edit",
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
    { label: 'Teacher Name', fieldName: 'Teacher_Name__c', editable: true },
    { label: 'Teacher Id', fieldName: 'Staff_Id__c' },
   // { label: 'Department', fieldName: 'Departments__c'},
    { label: 'Status', fieldName: 'Status__c', editable: true },
    { label: 'Last Modified By', fieldName: 'LastModifiedBy' },
    { label: 'Last Modified Date', fieldName: 'LastModifiedDate' },
    
    { type: 'action', typeAttributes: { rowActions: actions } }
];


export default class TeacherListView extends NavigationMixin(LightningElement) {
    @track recordID;
    @track dataList;
    @track array=[];
    selectedTeachers;
    wiredTeachers;

    //////inline edit
    fldsItemValues = [];
    
    @track isPopOpen = false;

   

    ShowToast() {
        const toastEvent = new ShowToastEvent({
            title: 'Teacher Record Deleted!',
            message: 'Record Deleted successfully',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(toastEvent);
        
    }

    @track isModalOpen = false;

    openModal() {
        this.isModalOpen = true;
      //this.isPopOpen = true;
        
    }
    closeModal() {
        this.isModalOpen = false;
        this.isPopOpen = false;
    }
    submitDetails() {
        this.isModalOpen = false;
    }
    handleModalChange(event) {
        this.isModalOpen = event.detail;
        this.isPopOpen = event.detail;
    }



    ///////search bar
    TeacherName = '';
    @track TeacherList;
    @wire(getRecords, ({ keySearch: '$TeacherName' }))
    wiredTeachers({ data, error }) {
        if (data) {
            console.log(data);
            console.log(error);
            console.log('data...'+JSON.stringify(data));
            this.dataList = JSON.parse(JSON.stringify(data)).map((item) => { 
                 return {
                    Id: item.Id,
                    Teacher_Name__c: item.Teacher_Name__c,
                    Staff_Id__c: item.Staff_Id__c,
                     //Departments__c : item.Departments__r.Name,
                    Status__c: item.Status__c,
                    LastModifiedBy: item.LastModifiedBy.Name,
                    LastModifiedDate: item.LastModifiedDate.split('T')[0],
                }
            });
          
            console.log('data...'+JSON.stringify(this.dataList));
        }
        else if (error) {
            console.log(error);
        }
    }

    /////////////////searching
    handleSearch(event) {
        this.TeacherName = event.target.value;
    }

    columns = columns;

          @track eraseId=[];

    ////single row delete
    @track rows = [];
    @track arr = [];
    rowActionHandler(event) {
        console.log('Event -->'+event.detail.action.name);
        //const rowDel = [];
        if (event.detail.action.name === "delete") {
            this.isPopOpen = true;
            this.eraseId.push(event.detail.row.Id);
            // rowDel.push(event.detail.row.Id);
            // deleteAclistTable({ arr: rowDel })
            //     .then((res) => this.Contact = res);
            // this.ShowToast();
            //location.reload();
            
        }

        if (event.detail.action.name === 'Edit') {
            this.isModalOpen = true;
            console.log('Entered the loop');
            this.recordID = event.detail.row.Id;
            console.log('recordID --> '+this.recordID);
        }
    }

    //////////////////for selecting the rows
    handleRowSelection(event) {
        this.selectedTeachers = event.detail.selectedRows;
    }

    getSelectedTeacher() {
        var selectedTeach =  this.template.querySelector("lightning-datatable").getSelectedRows();
        let len =selectedTeach.length;
        if(len > 0){
            //console.log('selectedTeach are '+JSON.stringify(selectedTeach));
            selectedTeach.forEach(currentItem => {
                //console.log('it is working fine ====>>>>>>')
                this.array.push(currentItem.Id);
                //console.log('it is working ====>>>>>')
            }); 
        }  
        return len;
      }

    ////////multiple select delete
    deleteSelectedTeachers() {
        if(this.getSelectedTeacher()>0){
            this.isPopOpen = true;
            for(let x of this.selectedTeachers){
                this.eraseId.push(x.Id);
            }
        // const idList = this.selectedTeachers.map(row => { return row.Id })
     
        // deleteTeachers({ contactIds: idList }).then(() => {

        //     this.ShowToast();
        //     location.reload();
        // })
           
        // this.template.querySelector('lightning-datatable').selectedRows = [];
        // this.selectedTeachers = undefined;
    }
        else if(this.getSelectedTeacher()==0){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error While Deleting Record',
                    message: 'Please select a record to Delete',
                    variant: 'error',
                }),
            );
        }
    }

 //////////////////inline edit

 saveAction(event) {

        this.fldsItemValues = event.detail.draftValues;

        const inputsItems = this.fldsItemValues.slice().map(draft => {

            const fields = Object.assign({}, draft);

            return { fields };

        });


 const promises = inputsItems.map(recordInput => updateRecord(recordInput));
         Promise.all(promises).then(res => {
            console.log('====>'+res)
            this.dispatchEvent(

                new ShowToastEvent({

                    title: 'Success',

                    message: 'Records Updated Successfully!!',

                    variant: 'success'

                })

            );
            location.reload();

            this.fldsItemValues = [];
          //return this.refresh();

        }).catch(error => {

            console.log("error"+error);

        }).finally(() => {

            this.fldsItemValues = [];

        });
      //location.reload();

    }
    

    async refresh() {

        await refreshApex(this.dataList);

    }

}