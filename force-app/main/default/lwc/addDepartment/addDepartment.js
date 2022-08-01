import { LightningElement,track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

import department_object from '@salesforce/schema/Department__c';
import NAME_FIELD from '@salesforce/schema/Department__c.Name';
import deptid from '@salesforce/schema/Department__c.Department_ID__c';

export default class LdsCreateRecord extends NavigationMixin (LightningElement){
    
    RecordId;
    name = '';

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


    handleNameChange(event) {
        this.RecordId = undefined;
        this.name = event.detail.value.trim();
        console.log(this.name)

    }
    
    createAccount(event) {
        console.log('createAcc')
        const fields = {};

        fields[NAME_FIELD.fieldApiName] = this.name;
    
        console.log('feild')
        console.log(this.isInputValid())
        console.log('find')
        const recordInput = { apiName: department_object.objectApiName, fields };
        if(this.isInputValid()){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'please fill the department name',
                    variant: 'error',
                }),
            );
           return;
           
        }
        if(this.name.trim() == ''){
            return  this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: 'Department name should not be empty',
                    variant: 'error',
                }),
            );
        }
       
        createRecord(recordInput)
            .then(account => {
                console.log('account=====>'+JSON.stringify(account))
                this.result = account;
               // this.RecordId = Record.id;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Department Saved',
                        variant: 'success',
                    }),
                    
                );
                location.reload();
                console.log('testing')
                // this[NavigationMixin.Navigate]({
                //     type: 'standard__objectPage',
                //     attributes: {
                //         objectApiName: 'Department__c',
                //         actionName: 'list'
                //     },
                // });
                console.log('testing2')
            })
            .catch(error => {
                console.log('error=====>'+JSON.stringify(error))

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: 'record already exist. please enter new name',
                        variant: 'error',
                    }),
                );
            });
            
           
             
    }
    isInputValid() {
        console.log('find')
        
        let isValid = true;
        console.log('find1')

        let inputFields = this.template.querySelectorAll('.validate');
        console.log('find2')

        inputFields.forEach(inputField => {
            console.log('find3')

            if(inputField.checkValidity()) {
                console.log('find4')

                inputField.reportValidity();
                console.log('find5')

                isValid = false;
                console.log('find6')

            }

            this.createAccount[inputField.name] = inputField.value;
            console.log('find7')

        });

        return isValid;
        
        

       

     }
    

    

}