import { LightningElement, track, wire, api } from 'lwc';
import createAdmissions from '@salesforce/apex/createAdmission.admissionName';
import fetchAcademicYear from '@salesforce/apex/createAdmission.fetchAcademicYear';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from "lightning/navigation";



export default class CreateSubject extends NavigationMixin(LightningElement) {
    value = 'Open';

    get options() {

        return [
            { label: 'Open', value: 'Open' },
            { label: 'Closed', value: 'Closed' },
        ];
    }

    @track monthName;
    @track isBoolean = true
    @track Year = [];
    @track Date;
    @track Status;
    @track Class;
    @track objIds = [];
    @track isError = false;
    @track isMultiError = false;

    @track isLoading = false;
    @track isModalOpen = true;
    @track openPopup = true;

    popup() {
        this.isModalOpen = true;
    }
    
    handleChange(event) {
        console.log('eventtttttttt3')
        this.value = event.detail.value;
        console.log('Status-------->' + this.value)
    }
    handleDate(event) {
        this.Date = event.target.value;

    }
    handleAccountSelection(event) {
        console.log('eventtttttttt1')
    
        this.Year = event.detail;
        console.log('handlerAccountSelection' + this.Year);
    }

    handleSelectValue(event) {
        console.log('Eventtttttttttttttttttt--->' + JSON.stringify(event.detail))
        this.objIds = event.detail
        
    }

    isInputValid() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.validate');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });
        console.log('Valid->' + isValid)
        return isValid;
    }


    handleClick() {
        console.log('Save')
        if (this.Year) {
            console.log('Check year')
            this.isError = true;
            
        }
        if (this.objIds) {
            console.log('Check year')
            this.isMultiError = true;
            console.log(this.isMultiError)
        }
        else{
            this.isMultiError=false;
        }

        this.isLoading = true;
        console.log('runCode');
        console.log(this.Year);
        console.log(this.Date);
        console.log(this.Status);
        console.log(this.objIds);

        if (this.isInputValid() && this.objIds.length>0) {
                    console.log('runCode2' + res);
                    
                    let obj = JSON.parse(res);
                    console.log('b4 if')
                    if (obj.isSuccess) {
                        console.log('Inside If ');
                        const toastEvent = new ShowToastEvent({
                            title: 'Success!',
                            message: 'Record Created Successfully',
                            variant: 'success'
                        });
                        this.dispatchEvent(toastEvent);

                        this.dispatchEvent(new CustomEvent('save', {
                            detail: false
                        }))
                        this.isLoading = false;
                        location.reload();

                    }
                    else {
                        this.dispatchEvent(new ShowToastEvent({
                            title: 'Error!',
                            message: 'This class has been created already in this Academic Year ',
                            variant: 'Error'
                        }))

                    }
                    
               

                }

                // .catch(error => {
                //     console.log('errorrrrr' + JSON.stringify(error));
                // });
            
        }


    closePopup() {
        // this.isModalOpen=false;
        this.dispatchEvent(new CustomEvent('close', {
            detail: false
        }))
    }


    connectedCallback() {
        console.log('check1111')

    }
}