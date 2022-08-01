import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import editRecord from '@salesforce/apex/getTeacherId.editRecord';
import updateRecords from '@salesforce/apex/getTeacherId.updateRecords';

export default class EditTeacher extends LightningElement {

    @track TeacherName;
    @track DepartmentName;
    @track PrimaryEmail;
    @track Mobile;
    @track StaffId;
    @track Status;
    @track EmployeeType;
    @track DateOfJoining;
    @track contactid;
    @track error;
    @track dataList;
    @track updateTeacherRecord;
    @api editRecordsId;

    get options() {
        return [
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
        ];
    }

    get EmployeeOptions() {
        return [
            { label: 'Permanent', value: 'Permanent' },
            { label: 'Contract', value: 'Contract' },
        ];
    }

      @api getModalValue;

     closeModal() {
        this.getModalValue = false;
        this.dispatchEvent(new CustomEvent('modalchange', { detail: this.getModalValue }));
    }


    ShowToast() {
        const toastEvent = new ShowToastEvent({
            title: 'Success!',
            message: 'Teacher updated successfully',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }

    handleSelectValue(event) {
       
        let ids = event.detail && JSON.parse(JSON.stringify(event.detail));
        console.log(ids);
        this.allDeptIds = ids;
    }
    
    @track prevDept = [];  //only to show pre-populated departments;
    @track prevDepartmentIds = []; //only dept Ids that are prev present;
    @track allDeptIds = [] //All Ids which are available to delete remaining dept;
    

    @wire(editRecord, { id: '$editRecordsId' })
    wiredData({ error, data }) {
        if (data) {
            let singleData = JSON.parse(JSON.stringify(data));
            this.dataList = singleData[0];

            this.dataList.Dept_Teachers__r && this.dataList.Dept_Teachers__r.map(item => {
                this.prevDept.push({
                    recId: item.Department__c,
                    recName: item.Department__r.Name
                });
                this.prevDepartmentIds.push(item.Department__c);
            })

            this.updateTeacherRecord = {
                Id: this.editRecordsId,
                Teacher_Name__c: this.dataList.Teacher_Name__c ? this.dataList.Teacher_Name__c : null,
                Primary_Email__c: this.dataList.Primary_Email__c ? this.dataList.Primary_Email__c : null,
                Mobile__c: this.dataList.Mobile__c ? this.dataList.Mobile__c : null,
                Staff_Id__c: this.dataList.Staff_Id__c ? this.dataList.Staff_Id__c : null,
                Status__c: this.dataList.Status__c ? this.dataList.Status__c : null,
                Employment_Type__c: this.dataList.Employment_Type__c ? this.dataList.Employment_Type__c : null,
                Date_of_Joining__c: this.dataList.Date_of_Joining__c ? this.dataList.Date_of_Joining__c : null
            };
            console.log(JSON.stringify(this.dataList));
        }
        if (error) {
            console.error('wiredPromise', error);
        }
    };

    connectedCallback() {
        console.log(this.editRecordsId);
    }

    handleChange(event) {
        this.updateTeacherRecord = { ...this.updateTeacherRecord, [event.target.name]: event.target.value };
        console.log(JSON.stringify(this.updateTeacherRecord));
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
        return isValid;
    }


     //onclick
    updateHandler() {
         if (this.isInputValid()) {
            console.log("new record Id ");
            let newLisToAdd = this.allDeptIds.filter(x => !this.prevDepartmentIds.includes(x));
            updateRecords({ newRecord: this.updateTeacherRecord, department: newLisToAdd, conId: this.editRecordsId, depIds : this.allDeptIds })
            .then(() => {
                this.ShowToast();
                setTimeout(() => {
                    location.reload();
                }, 1500);
                this.ShowToast();
            })
            .catch(error => {
                console.log(error);
            });
        }
        
    }
}