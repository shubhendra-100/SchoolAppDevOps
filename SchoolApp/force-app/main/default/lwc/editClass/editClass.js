import { LightningElement,api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class EditClass extends LightningElement {

    @api recordsId;

    @track error;

    classSection;

    @api ModalRes;

    closeModal() {
        this.ModalRes = false;
        this.dispatchEvent(new CustomEvent('modalchange', { detail: this.ModalRes }));
    }

    handleChange(event){
        this.classSection = event.detail.value;
    }

    handleSuccess(event){
        if(this.isInputValid()){
        this.dispatchEvent(new ShowToastEvent({
            title: "SUCCESS!",
            message: "Class has been updated successfully.",
           variant: "success",
        }),  
        );    
        location.reload();
    }

    else{
        this.showError();
    }
    
    }

    isInputValid() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.validate');
        inputFields.forEach(inputField => {
            if(!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }

    showError(){
        this.dispatchEvent(new ShowToastEvent({
            title: "Error!",
            message: "Class details not updated.",
            variant: "error"
        })
    )}
}