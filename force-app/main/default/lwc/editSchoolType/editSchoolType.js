import { LightningElement,api,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class EditSchoolType extends LightningElement {

    @api recordsId;
    @track error;
    // @api ModalValue;
    @api getModalValue;
    

    closeModal() {

        this.getModalValue = false;

        this.dispatchEvent(new CustomEvent('modalchange', { detail: this.getModalValue }));

    }
    handleSuccess(event){
        
       
        
     
        this.dispatchEvent(new ShowToastEvent({

            title: "SUCCESS!",

            message: "Department has been updated successfully.",

        variant: "success",
        

        })); 
        

        location.reload();
    }   
    
   
}