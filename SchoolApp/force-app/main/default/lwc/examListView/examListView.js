import { LightningElement, track, wire } from 'lwc';
import getExamRecords from '@salesforce/apex/examSchedule.getExamRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import editExamRecord from '@salesforce/apex/examSchedule.getExamRecords';
import { updateRecord } from 'lightning/uiRecordApi';
const actions = [
    {
        label: 'View', name: 'View', iconName: "utility:preview",
        alternativeText: "View",
        title: "View"
    },

    {
        label: 'Add Subject', name: 'Add', iconName: "utility:add",
        alternativeText: "ADD Subject",
        title: "Add Subject"
    },
    
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
    { label: 'Exam Name', fieldName: 'Name', editable: true },
    { label: 'Class', fieldName: 'Class__c', editable: true },
    { label: 'Exam Date', fieldName: 'Date__c', editable: true },
    { type: 'action', typeAttributes: { rowActions: actions } }
];

export default class ExamListView extends LightningElement {


    columns = columns;

     @track isEditWindow= false;


    @track newRecordPage = false;
    @track dataList;
    @track eraseId = [];
    @track isPopOpen = false;
    @track isModalOpen = false;
    examRecords;

    @track getModalValue;
    // @track editRecordsId;
    @track recordID;

    openModal() {
        this.isModalOpen = true;
      // this.isPopOpen = true;
      }
      closeModal() {
        this.isModalOpen = false;
       // this.isPopOpen = false;
       }

    handleModalChange(event) {
        this.isModalOpen = event.detail;
        this.isPopOpen = event.detail;
    }

    @wire(getExamRecords)
    wiredExam({ data, error }) {
        var month = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
        if (data) {
            if (JSON.stringify(data) == '[]') {
                this.newRecordPage = false;
                return;
            }
            this.newRecordPage = true
            console.log('data...' + JSON.stringify(data));
            this.dataList = data.map((item) => {
                return {
                    Id: item.Id,
                    Name: item.Name,
                   Class__c: item.Class__r.Name,
            //  Date__c: `${month[item.Start_Date__c.split('T')[0].split('-')[1]-1]} ${item.Start_Date__c.split('T')[0].split('-')[2]} - ${month[item.End_Date__c.split('T')[0].split('-')[1]-1]} ${item.End_Date__c.split('T')[0].split('-')[2]}`,
                Date__c: `${month[item.Start_Date__c.split('-')[1]-1]} ${item.Start_Date__c.split('T')[0].split('-')[2]}- ${month[item.End_Date__c.split('-')[1]-1]} ${item.End_Date__c.split('T')[0].split('-')[2]}`,
                }
            });

        }
        else if (error) {
            console.log(error);
        }
    
    }

    handleRowSelection(event) {
        this.examRecords = event.detail.selectedRows;
    }

    getSelectedExam() {
        var selectedExam =  this.template.querySelector("lightning-datatable").getSelectedRows();
        let len = selectedExam.length;
        if(len > 0){
           selectedExam.forEach(currentItem => {
             this.array.push(currentItem.Id);
          }); 
        }  
        return len;
      }

    @track array=[];
    examRecords;
    deleteExamRecords() {
        if (this.getSelectedExam() > 0) {
            this.isPopOpen = true;
            for (let x of this.examRecords) {
                this.eraseId.push(x.Id);
            }
        }
        else if (this.getSelectedExam() == 0) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error While Deleting Record',
                    message: 'Please select a record to Delete',
                    variant: 'error',
                }),
            );
        }
    }

    rowActionHandler(event) {
        console.log('Event -->' + event.detail.action.name);
        //const rowDel = [];
        if (event.detail.action.name === "delete") {
            this.isPopOpen = true;
            this.eraseId.push(event.detail.row.Id);
            console.log(this.eraseId);
        }

        if (event.detail.action.name === 'Edit') {
            this.isModalOpen = true;
            console.log('Entered the loop');
            this.recordID = event.detail.row.Id;
            console.log('recordID --> '+this.recordID);
        }
    }

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