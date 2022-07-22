import { LightningElement, api, track, wire } from 'lwc';
import insertNewClass from '@salesforce/apex/insertNewClass.insertNewClass';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateClass extends LightningElement {

    @track isError = false;
    @track value;

    handleChange(event) {
        this.value = event.detail.value;
    }

    @track className;
    @track classSection;

    @track showModal=false;

    // @api objectName = 'Department__c';
    // @api fieldName = 'Name';
    // @track fieldLabel;
    // @api recordTypeId;
    // @api value;
    // @track options;
    // apiFieldName;

    // @wire(getObjectInfo, { objectApiName: '$objectName' })
    // getObjectData({ error, data }) {
    //     if (data) {
    //         if (this.recordTypeId == null)
    //             this.recordTypeId = data.defaultRecordTypeId;
    //         this.apiFieldName = this.objectName + '.' + this.fieldName;
    //         this.fieldLabel = data.fields[this.fieldName].label;
            
    //     } else if (error) {
    //         // Handle error
    //         console.log('==============Error  ');
    //         console.log(error);
    //     }
    // }

    // @wire(getPicklistValues, { recordTypeId: '$recordTypeId', fieldApiName: '$apiFieldName' })
    // getPicklistValues({ error, data }) {
    //     if (data) {
    //         // Map picklist values
    //         this.options = data.values.map(plValue => {
    //             return {
    //                 label: plValue.label,
    //                 value: plValue.value
    //             };
    //         });

    //     } else if (error) {
    //         // Handle error
    //         console.log('==============Error  ' + error);
    //         console.log(error);
    //     }
    // }

    @track deptId;

    selectedName(event){
        this.deptId = event.detail;
    }

    openModal() {
        // Setting boolean variable to true, this will show the Modal
        this.showModal = true;
    }

    closeModal() {
        // Setting boolean variable to false, this will hide the Modal
        this.showModal = false;
        this.className = null;
        this.classSection = null;
    }

    handleClassName(event){
        this.className= event.detail.value;
    }

    handleClassSection(event){
        this.classSection= event.detail.value;
    }

    handleClick(){
        console.log(this.deptId);
        if(this.deptId==null || this.deptId == undefined){
            this.isError = true;
            // return;
        }

        if(this.isInputValid()){

            insertNewClass({DeptID: this.deptId, ClassName: this.className, ClassSection: this.classSection})
            .then((res)=>{this.showToast();
            //this.showModal = false;
            location.reload()})
            .catch(err=> this.showDuplicateError())

        }
        else{
            this.showError();
        }
    }

    showToast() {
        const evt = new ShowToastEvent({
            variant: 'Success',
            title: 'Class created',
            message: 'New class has been created',
        });
        this.dispatchEvent(evt);
    }

    showError(){
        const evt = new ShowToastEvent({
            variant: 'Error',
            title: 'Error',
            message: 'Class not created',
        });
        this.dispatchEvent(evt);
    }

    showDuplicateError(){
        const evt = new ShowToastEvent({
            variant: 'Error',
            title: 'Error',
            message: 'Class and section already exist',
        });
        this.dispatchEvent(evt);
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

    // @wire(insertNewClass,{DeptID: '$this.deptId', ClassName: '$this.className', ClassSection: '$this.classSection'}) 
    // wiredDept({error,data}){
    //     if (data) {
    //         this.record = data;
    //         this.error = undefined;
    //     } else if (error) {
    //         this.error = error;
    //         this.record = undefined;
    //     }
    // }

    // navigateToRecordViewPage(RecID) {
    //     // View a standard object record.
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__recordPage',
    //         attributes: {
    //             recordId: RecID,
    //             objectApiName: 'Contact',
    //             actionName: 'view'
    //         }
    //     });
    // }
}