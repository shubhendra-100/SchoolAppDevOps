import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import insertExamsRec from '@salesforce/apex/examSchedule.insertExamsRec';
//import retrieveClassName from '@salesforce/apex/examSchedule.retrieveClassName';
export default class ScheduleExam extends LightningElement {

    @track error;
    @track ClassName;
    @track ExamName;
    @track StartDate;
    @track EndDate;
    @track getClass = [];

    @api recordFalse;
    
    get btnShow(){
        if(this.recordFalse == false) {
            return false;
        }
        return true;
    }

    @track getExamRecord = {
        Name: null,
        Start_Date__c: null,
        End_Date__c: null,
    };

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
    handleClick() {
        this.isModalOpen = true;
    }

    // isInputValid() {
    //     let isValid = true;
    //     let inputFields = this.template.querySelectorAll('lightning-input');
    //     console.log(JSON.stringify(inputFields));
    //     inputFields.forEach(inputField => {
    //         // if (!inputField.checkValidity()) {
    //             inputField.reportValidity();
    //             isValid = false;
    //         // }
    //     }); 
    //     return isValid;
    // }


    ShowToast() {
        const toastEvent = new ShowToastEvent({
            title: 'Success!',
            message: 'Exam Scheduled successfully',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
        //location.reload();

    }

    showErrorToast(err) {
        const evt = new ShowToastEvent({
            variant: 'error',
            title: 'Error',
            message: err,
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }


   

   

    // @wire(insertExamsRec)
    // wiredFetchName({ data, error }) {
    //     if (data) {
    //         console.log(data)
    //         let obj = [];
    //         for (let x of data) {
    //             obj.push({
    //                 id: x.Id,
    //                 label: x.Name,
    //                 value: x.Id
    //             })
    //         }
    //         this.getClass = obj
    //         console.log('ClassName' + JSON.stringify(this.getClass));
    //     }
    //     else {
    //         console.log(error);
    //     }
    // }

    handleChange(event) {
        if (event.target.label == 'Exam Name') {
            console.log(event.target.value);
            this.ExamName = event.target.value;
        }
        if (event.target.label == 'Start Date') {
            console.log(event.target.value);
            this.StartDate = event.target.value;
        }
        if (event.target.label == 'End Date') {
            console.log(event.target.value);
            this.EndDate = event.target.value;
        }
    }

    handleSelectValue(event) {
        this.ClassName = JSON.stringify(event.detail);
    }

    saveHandler() {
        
        console.log('hiiii', {
            ExamName: this.ExamName,
            StartDate: this.StartDate,
           // EndDate: this.EndDate,
            ClassName: this.ClassName
        });

        if (this.ExamName && this.StartDate && this.EndDate && this.ClassName) {
       
            insertExamsRec({
                ExamName: this.ExamName,
                StartDate: this.StartDate,
                EndDate: this.EndDate,
                ClassName: this.ClassName
            })

                .then((result) => {
                    console.log(JSON.stringify(result));
                    this.ShowToast();
                location.reload();
                })
                .catch(error => {
                    console.log(error);
                })
        }
        else{
            console.log("errorToast")
            this.showErrorToast('Please fill the fields!');
        }
    }
}