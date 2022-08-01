import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import academicyearsession from '@salesforce/apex/AcademicYear.academicyearsession';
export default class AcademicYear extends LightningElement {


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


    @track fromMonth;
    @track fromYear;
    @track toMonth;
    @track toYear;
    // @track fromDate;
    // @track toDate;

    handleInput(event) {
        const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if (event.target.name == 'fromDate') {
            this.fromDate = event.target.value;
            console.log("Year: ", event.target.value.split("-")[0], "Month: ", monthArr[+event.target.value.split("-")[1] - 1]);
            this.fromMonth = monthArr[+event.target.value.split("-")[1] - 1];
            this.fromYear = event.target.value.split("-")[0];
        }

        else {
            // console.log(event.target.value);
            this.toDate = event.target.value;
            this.toMonth = monthArr[+event.target.value.split("-")[1] - 1];
            this.toYear = event.target.value.split("-")[0];
        }
    }

    
    showSuccessToast() {
        const evt = new ShowToastEvent({
            title: 'Record Created',
            message: 'This record has been created',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Provide Detail',
            message: 'Fields can not be empty',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    saveHandler() {
        // console.log(this.fromMonth);
        // console.log(this.fromYear);
        // console.log(this.toMonth);
        // console.log(this.toYear);

        if(this.fromMonth == null || this.fromMonth == '' || this.toMonth == null || this.toMonth == '' ){
            this.showErrorToast();
            return;
        }

        academicyearsession({ fromMonth: this.fromMonth, fromYear: this.fromYear, toMonth: this.toMonth, toYear: this.toYear })
            .then((res) => {
                console.log("success");
                this.showSuccessToast();
                this.closeModal();

            })
            .catch(err => console.error(err));


    }
}