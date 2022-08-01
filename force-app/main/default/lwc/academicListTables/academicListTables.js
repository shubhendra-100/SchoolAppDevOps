import { LightningElement, track, wire } from 'lwc';
import recordShow from '@salesforce/apex/AcademicYearRecordShow.recordShow';
import deleteAclistTable from '@salesforce/apex/deleteAcademicListTable.deleteAclistTable';
import { deleteRecord } from 'lightning/uiRecordApi';
//import {NavigationMixin} from 'lightning/navigation';

const columns = [
    { label: 'FROM MONTH', fieldName: 'From_Month__c' },
    { label: 'FROM YEAR', fieldName: 'From_Year__c' },
    { label: 'TO MONTH', fieldName: 'To_Month__c' },
    { label: 'TO YEAR', fieldName: 'To_Year__c' },
    { type: "button-icon", typeAttributes: {iconName: "utility:delete",
alternativeText: "Delete", onclick: { deleteclick },title: "Delete"}}
];

export default class AcademicListTable extends LightningElement {
    @track arr = [];
    @track recordId;
    @track dataList;

    @wire(recordShow) wiredAccounts({ data, error }) {
        // console.log('Hello');
        if (data) {

            this.dataList = data;

        }
        else if (error) {
            console.log(error);
        }
    }

    // // data = [
    // //     {
    // //         FROM_MONTH: 'MARCH',
    // //         FROM_YEAR: '1999',
    // //         TO_MONTH: 'APRIL',
    // //         TO_YEAR: '2022'
    // //     },
    // //     {
    // //         FROM_MONTH: 'APRIL',
    // //         FROM_YEAR: '2009',
    // //         TO_MONTH: 'JUNE',
    // //         TO_YEAR: '2019'
    // //     },
    // //     {
    // //         FROM_MONTH: 'JUNE',
    // //         FROM_YEAR: '2015',
    // //         TO_MONTH: 'JULY',
    // //         TO_YEAR: '2020'
    // //     }
    // // ];
     columns = columns;

    getSelectedRec() {
        var selectedRecords = this.template.querySelector("lightning-datatable").getSelectedRows();
        if (selectedRecords.length > 0) {
            // console.log('selectedRecords are ', JSON.stringify(selectedRecords));
            selectedRecords.map((currentItem) => {
                this.arr.push(currentItem.Id);
            });
            //// this.selectedIds = ids.replace(/^,/, '');
            // this.lstSelectedRecords = selectedRecords;
            // this.arr = selectedIds;
            // alert(this.selectedIds);
            if (this.arr.length > 0) {
                deleteAclistTable({ arr: this.arr })
                    .then((res) =>  this.dataList = res );
            }

        }

    }

    // // handleContactDelete(event){
    // //     this.recordId = event.target.value;
    // //     //window.console.log('recordId# ' + this.recordId);
    // //     deleteRecord(this.recordId) 
    // //     .then(() =>{

    // //        const toastEvent = new ShowToastEvent({
    // //            title:'Record Deleted',
    // //            message:'Record deleted successfully',
    // //            variant:'success',
    // //        })
    // //        this.dispatchEvent(toastEvent);

    // //        return refreshApex(this.getContact);

    // //     })
    // //     .catch(error =>{
    // //         window.console.log('Unable to delete record due to ' + error.body.message);
    // //     });
    // // }
}