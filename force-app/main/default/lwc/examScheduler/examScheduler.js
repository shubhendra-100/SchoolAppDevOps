import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import insertExamsRec from '@salesforce/apex/examSchedule.insertExamsRec';

export default class ExamScheduler extends LightningElement {

    @track error;
   // @track Id;

    @track ClassName;
    @track ExamName;
    @track StartDate;
    @track EndDate;

    @track isModalOpen = false;
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

    ShowToast() {
        const toastEvent = new ShowToastEvent({
            title: 'Success!',
            message: 'Exam Scheduled successfully',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
        //location.reload();

    }

    handleChange(event) {
        if (event.target.label == 'Exam Name') {
            console.log(event.target.label);
            this.ExamName = event.target.value;
        }
        if (event.target.label == 'Start Date') {
            console.log(event.target.label);
            this.StartDate = event.target.value;
        }
        if (event.target.label == 'End Date') {
            console.log(event.target.label);
            this.EndDate = event.target.value;
        }
    }

    saveHandler() {
        console.log('hiiii');
        insertExamsRec({
            ExamName: this.ExamName,
            StartDate: this.StartDate,
            EndDate: this.EndDate
        })

            .then((result) => {
                console.log(JSON.stringify(result));
                this.ShowToast();
                //location.reload();
            })
            .catch(error => {
               console.log(error);
            })
    }
}