import { LightningElement, wire, track } from 'lwc';
import listSubject from '@salesforce/apex/listSubject.listSubject';
import deleteAclistTable from '@salesforce/apex/listSubject.deleteAclistTable';
import deleteSubject from '@salesforce/apex/listSubject.deleteSubject';

import { deleteRecord } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

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
    { label: 'Subject Name', fieldName: 'Name', editable: true },
    { label: 'Last Modified By', fieldName: 'LastModifiedBy', editable: false },
    { label: 'Last Modified Date', fieldName: 'LastModifiedDate', editable: false },
    { type: 'action', typeAttributes: { rowActions: actions } }
];

export default class ListSubject extends LightningElement {
    @track recordId;
    @track rows = [];
    @track arr = [];
    fldsItemValues = [];
    @track Subject_Course__c;
    error;
    columns = columns;
    saveDraftValues = [];
    selectedSubject;
    @track dataList;


    @track isModalOpen = false;
    @track isPopOpen = false;
    @track deletId = [];

    openModal() {
        this.isModalOpen = true;
        this.isPopOpen = true;
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



    handleContactDelete(event) {
        this.recordId = event.target.value;
        //window.console.log('recordId# ' + this.recordId);
        deleteRecord(this.recordId)
            .then(() => {

                const toastEvent = new ShowToastEvent({
                    title: 'Record Deleted',
                    message: 'Record deleted successfully',
                    variant: 'success',
                });
                this.dispatchEvent(toastEvent)
               
            

                     return refreshApex(this.getContact);

            })
            .catch(error => {
                window.console.log('Unable to delete record due to ' + error.body.message);
            });
 }

    columns = columns;

    @wire(listSubject)

    wiredDepartments({ data, error }) {

        console.log(this.wiredDepartments)

        if (data) {

            console.log('that' + JSON.stringify(data));

            this.Subject_Course__c = data.map((item) => {
                return {
                    Id:item.Id,
                    Name: item.Name,
                    LastModifiedBy: item.LastModifiedBy.Name,
                    LastModifiedDate: item.LastModifiedDate.split('T')[0],
                }
            });

            console.log('that1' + JSON.stringify(data));

            this.error = undefined;

        } else if (error) {

            console.log('that2' + JSON.stringify(error));

            this.error = error;

            console.log('that3' + JSON.stringify(data));

            this.Subject_Course__c = undefined;

        }

    }

    handleRowAction(event) {
        console.log(event.detail);
       // const rowDel = [];
        if (event.detail.action.name === "delete") {
            this.isPopOpen = true;
            this.deletId = event.detail.row.Id;
            // console.log(JSON.stringify(event.detail.row));
            // rowDel.push(event.detail.row.Id);
            // deleteAclistTable({ arr: rowDel })
            //     .then((res) => this.Subject_Course__c = res);
            //     this.ShowToast();
            //     location.reload();

        }
        if (event.detail.action.name === 'Edit') {
            this.recordID = event.detail.row.Id;
            this.isModalOpen = true;
        }
    }
    
    handleRowSelection(event){
        this.selectedSubject = event.detail.selectedRows;
    }

    
    


    // handlesave(event) {
    //     this.saveDraftValues = event.detail.draftValues;
    //     const recordInputs = this.saveDraftValues.slice().map(draft => {
    //         const fields = Object.assign({}, draft);
    //         return { fields };
    //     });

    // Updateing the records using the UiRecordAPi
    //     const promises = recordInputs.map(recordInput => updateRecord(recordInput));
    //     console.log(JSON.stringify(promises));
    //     Promise.all(recordInputs.map(recordInput => updateRecord(recordInput))).then(res => {
    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title: 'Success',
    //                 message: 'Records Updated Successfully!!',
    //                 variant: 'success'
    //             })
    //         );
    //         this.saveDraftValues = [];
    //         return this.refresh();
    //     }).catch(error => {
    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title: 'Error',
    //                 message: 'An Error Occured!!',
    //                 variant: 'error'
    //             })
    //         );
    //     }).finally(() => {
    //         this.saveDraftValues = [];
    //     });
    // }

    // // This function is used to refresh the table once data updated
    // async refresh() {
    //     await refreshApex(this.contacts);
    // }
    // handlesave(){
    //     listSubject()
    // }

    //////////////////inline

    

    saveHandleAction(event) {
        this.fldsItemValues = event.detail.draftValues;
        const inputsItems = this.fldsItemValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
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
            /* location.reload(); */
            return this.refresh();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: 'Subject with same name already exist!!',
                    variant: 'error'
                }),
            );
            console.log("error", JSON.stringify(this.error));
        }).finally(() => {
            this.fldsItemValues = [];
        });
    }
    
    async refresh() {
        await refreshApex(this.dataList);
    }

    ///////////
    // handleRowAction(event) {


    // }

    ///////////////////////
    ShowToast() {

        const toastEvent = new ShowToastEvent({

            title: 'Subject Record Deleted!',

            message: 'Record Deleted successfully',

            variant: 'success',

            mode: 'dismissable'

        });

        this.dispatchEvent(toastEvent);

       

    }
      ////////////without selecting records 
    getSelectedRec() {
        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();

        let len =selectedRecords.length;

        if(len.length > 0){
           // console.log('selectedRecords are ', selectedRecords);
   
            selectedRecords.forEach(currentItem => {
                this.arr.push(currentItem.Id);
            });
        }   

        return len;
      }



    ////////multiple select delete

    deleteRows() {
       
        console.log(this.selectedSubject);
        //this.getSelectedRec();
        if(this.getSelectedRec()>0){
            this.isPopOpen = true;
            for(let x of this.selectedSubject){

                this.deletId.push(x.Id);

            }
        // const idList = this.selectedSubject.map(row => { 
        //     return row.Id;
        // })
        // deleteSubject({ Ids: idList }).then((res) => {
        //     console.log(res)
        //     this.ShowToast();
        //     location.reload();
        //     return;
        // })
        // this.template.querySelector('lightning-datatable').selectedRows = [];
        // this.selectedSubject = undefined;

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

}