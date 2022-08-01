import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import editExamRecord from '@salesforce/apex/examSchedule.editExamRecord';
import updateExamRecords from '@salesforce/apex/examSchedule.updateExamRecords';
export default class EditScheduleExam extends LightningElement {
   

    @track ClassName;
    @track ExamName;
    @track StartDate;
    @track EndDate;
    @track error;
    @track dataList;
    @track updateExamRecord;
    @api editRecordsId;
    @track Name;
    @track StartDate;
    @track EndDate;

   
    closeModal() {
        this.getModalValue = false;
        this.dispatchEvent(new CustomEvent('modalchange', { detail: this.getModalValue }));
    }


    ShowToast() {
        const toastEvent = new ShowToastEvent({
            title: 'Success!',
            message: 'Exam updated successfully',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }

    handleSelectValue(event) {
        let ids = event.detail && JSON.parse(JSON.stringify(event.detail));
        //console.log(ids);
        this.allClassIds = ids;
    }


    @wire(editExamRecord, { id: '$editRecordsId' })
    wiredData({ error, data }) {
        if (data) {
            let singleData = JSON.parse(JSON.stringify(data));
            this.dataList = singleData[0];
            // console.log(JSON.stringify(singleData));
        

            this.updateExamRecord = {
                Id: this.editRecordsId,
                Name: this.dataList.Name ? this.dataList.Name : null,
                Start_Date__c: this.dataList.Start_Date__c ? this.dataList.Start_Date__c : null,
                End_Date__c: this.dataList.End_Date__c ? this.dataList.End_Date__c : null,

            };

            this.Name = this.dataList.Name;
            this.ClassName = this.dataList.Class__r.Name;
            this.StartDate = this.dataList.Start_Date__c;
            this.EndDate = this.dataList.End_Date__c;

            console.log(JSON.stringify(this.dataList));
            console.log(this.prevClass);
        }
        if (error) {
            console.error('wiredPromise', error);
        }
    };

   

    handleChange(event) {
        this.updateExamRecord = { ...this.updateExamRecord, [event.target.name]: event.target.value };
        //     console.log(JSON.stringify(this.updateExamRecord));
    }

    updateHandler() {
        console.log("new record Id ");
        updateExamRecords({ newExamRecord: this.updateExamRecord })
            .then(() => {
                this.ShowToast();
                setTimeout(() => {
                    location.reload();
                }, 1500);
                this.ShowToast();
            })
            .catch(error => {
                console.log(error);
            });
    }
}