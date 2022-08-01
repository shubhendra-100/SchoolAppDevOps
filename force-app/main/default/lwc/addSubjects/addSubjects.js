import { LightningElement, track } from 'lwc';
// import Subject_Name from '@salesforce/schema/Account';
import addSubjects from '@salesforce/apex/addSubjects.addSubjects';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class AddSubjects extends LightningElement {

    //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
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

    @track name;
    @track openPopup = true;
    popup() {
        this.openPopup = true;
    }
    closePopup() {
        this.openPopup = false;
    }
    handleNameChange(event) {
        this.name = event.target.value;
        console.log(this.name);
    }

    showSuccess(subName) {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: `Subject is created successfully`,
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
    showError(msg) {
        const evt = new ShowToastEvent({
            title: 'Error Alert',
            message: msg,
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    handleClick() {
        if (this.name.trim() == '') {
            //console.log('saveButn:', this.name);
            this.showError('Subject Name Should Not be Blank!');
            return;
        }
        addSubjects({ subName: this.name })
            .then(result => {
                // this.result = res;
                this.error = undefined;
                this.showSuccess(result);
                console.log(JSON.stringify(result));
                this.closeModal();
                console.log("result", this.res);
                setTimeout(() => {
                    location.reload();
                }, 1500)
            })
            .catch(error => {
                this.result = undefined;
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: 'Subject with same name already exist',
                        variant: 'error',
                    }),
                );
                console.log("error", JSON.stringify(this.error));
            });
      
    }
}