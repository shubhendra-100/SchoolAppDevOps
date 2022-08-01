import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class EditSubject extends LightningElement {
    @api recordsId;

    @api ModalRes;



    closeModal() {

        this.ModalRes = false;

        this.dispatchEvent(new CustomEvent('modalchange', { detail: this.ModalRes }));

    }

   


        // Handleedit(){
        //     // if (this.name.trim() == '') {
        //     //     //console.log('saveButn:', this.name);
        //     //     this.showError('Subject Name Should Not be Blank!');
        //     //     return;
        //     // }
            
            
            
            
       



    handleSuccess(event){
        // const lwcInputFields = this.template.querySelectorAll(
        //     'lightning-input-field'
        //      );
        //     if (this.lwcInputFields.trim() == '') {
        //         console.log('saveButn:', this.lwcInputFields);
        //         this.showError('Subject Name Should Not be Blank!');
        //         return;
        //     }
        this.dispatchEvent(new ShowToastEvent({

            title: "SUCCESS!",

            message: "Subject has been updated successfully.",

           variant: "success",

        }),  

        );    

        location.reload();

    }
}