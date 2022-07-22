import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

//import { deleteRecord } from 'lightning/uiRecordApi';

import listClass from '@salesforce/apex/listClass.listClass';
import delClass from '@salesforce/apex/listClass.delClass';
import noOfClassRec from '@salesforce/apex/listClass.noOfClassRec';

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
    },
    {
        label: 'Assign Teacher', name: 'assign teacher', iconName: "utility:education",
        alternativeText: "Assign Teacher",
        title: "Assign Teacher"
    }
];

const columns = [
    { label: 'Class Section', fieldName: 'Name', editable: true },
    { label: 'Class', fieldName: 'Class__c' },
    //{ label: 'Students', fieldName: 'Students', editable: true  },
    //{ label: 'Teachers', fieldName: 'Teachers', editable: true  },
    { label: 'Last Modified By', fieldName: 'LastModifiedBy', editable: false },
    { type: 'action', typeAttributes: { rowActions: actions } }
];
export default class ClassList extends LightningElement {

    a = false;
    b = true;
    @track data;
    columns = columns;
    draftValues;

    @track recordId;
    @track isModalOpen = false;

    @track isModalOpens = false;

    @track DelId = [];
    @track isDelete;

    handleModalChange(event) {
        this.isModalOpen = event.detail;
    }

    handleModalChanges(event) {
        this.isModalOpens = event.detail;
    }

    closeModals(){
        this.isModalOpens = false;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    @wire(listClass)
    wiredClasses({ error, data }) {
        if (data) {
            this.data = data.map((item) => {
                return {
                    Id: item.Id,
                    Name: item.Name,
                    Class__c: item.Class__r.Name, 
                    // Sections__r: item.Sections__r.Name,
                    // Department__c: item.Department__r.Name,
                    LastModifiedBy: item.LastModifiedBy.Name
                }
            });
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    handleRowAction(event) {
        let rowToDel = [];

        if (event.detail.action.name === "delete") {
            rowToDel.push(event.detail.row.Id);
            //rowToDel.push(JSON.parse(JSON.stringify(event.detail.row.Id)));
            
            this.DelId = rowToDel;
            this.isDelete = true;
            //this.DelId = [...rowToDel, rowToDel];

            // delClass({ recId: rowToDel })
            //     .then((res) => {//this.data = data;
            //         const toastEvent = new ShowToastEvent({
            //             title: 'Record Deleted',
            //             message: 'Record deleted successfully',
            //             variant: 'success'
            //         });
            //         this.dispatchEvent(toastEvent);
            //         location.reload()
            //     }).catch(error => {
            //         const toastEvent = new ShowToastEvent({
            //             title: 'Record Can not be deleted',
            //             message: 'Record is Associated with other object',
            //             variant: 'error'
            //         });
            //         return this.dispatchEvent(toastEvent);
            //     })
        }
        else if (event.detail.action.name === "edit") {
            this.recordId = event.detail.row.Id;
            this.isModalOpen = true;
        }

        else if (event.detail.action.name=== "assign teacher"){
            this.isModalOpens = true;
            this.recordId = event.detail.row.Id;
        }

    }

    recordsToDel= [];

    handleSelectedRow(event) {
        this.recordsToDel = event.detail.selectedRows;
    }

    //deleteRows() {
    
        //     const idList = this.recordsToDel.map(row => { return row.Id })
        //     delClass({ recId: idList }).then((res) => {
        //         const toastEvent = new ShowToastEvent({
        //             title: 'Records deleted',
        //             message: 'Selected classes has been deleted',
        //             variant: 'success'
        //         });
        //         this.dispatchEvent(toastEvent);
        //         location.reload();
        //     })
        //     .catch(error => {
        //         const toastEvent = new ShowToastEvent({
        //             title: 'Record Can not be deleted',
        //             message: 'Record is Associated with other object',
        //             variant: 'error'
        //         });
        //         return this.dispatchEvent(toastEvent);
        //     })
    
        //     this.template.querySelector('lightning-datatable').selectedRows = [];
        //     this.recordsToDel = undefined;

        //}
    

    deleteRows() {

        const idList = this.recordsToDel.map(row => { return row.Id });
        //const len = idList.length;

        if(idList.length>0){
            this.DelId = idList;
            this.isDelete = true;
        
        // delClass({ recId: idList }).then((res) => {
        //     const toastEvent = new ShowToastEvent({
        //         title: 'Records deleted',
        //         message: 'Selected classes has been deleted',
        //         variant: 'success'
        //     });
        //     this.dispatchEvent(toastEvent);
        //     location.reload();
        //     this.template.querySelector('lightning-datatable').selectedRows = [];
        //     this.recordsToDel = [];
        // })
        // .catch((error) => {
        //     const toastEvent = new ShowToastEvent({
        //         title: 'Record Can not be deleted',
        //         message: 'Record is Associated with other object',
        //         variant: 'error'
        //     });
        //     this.dispatchEvent(toastEvent);
        // })

        //this.template.querySelector('lightning-datatable').selectedRows = [];
        //this.recordsToDel = [];
        this.idList = undefined;
        }
        
        else if(idList.length==0){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting record',
                    message: 'select atleast one record',
                    variant: 'error',
                }),
            );
        }


    }

    closemodaldelete(event){
        this.isDelete = event.detail;
    }

    // getSelectedRec() {
    //     var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
    //     let len =selectedRecords.length;
    //     if(selectedRecords.length > 0){
    //         console.log('selectedRecords are ', selectedRecords);
   
    //         selectedRecords.forEach(currentItem => {
    //             this.recordsToDel.push(currentItem.Id);
    //         });
    //     }   
    //     return len;
    //   }

    // NoneSelectedToastEvent(){
    //     toastEvent = new ShowToastEvent({
    //         title: 'Record Can not be deleted',
    //         message: 'Select atleast one record to delete',
    //         variant: 'error'
    //     });
    // }    

    handleSave(event) {

        this.fldsItemValues = event.detail.draftValues;
        const inputsItems = this.fldsItemValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        location.reload();

        //Updating the records using the UiRecordAPi
        const promises = inputsItems.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated Successfully!!',
                    variant: 'success'
                })
            );

            this.fldsItemValues = [];
            return this.refresh();
        }).catch(error => {
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

    async refresh() {
        await refreshApex(this.data);
    }

    @track title;

    @wire(noOfClassRec)
    wiredClassOutput({ error, data }) {
        this.title = 'Sections [' + data + ']';
    }

}