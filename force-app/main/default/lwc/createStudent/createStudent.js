import { LightningElement,track, api, /* wire */ } from 'lwc';
//student/parent
/* import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi'; */
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FirstName from '@salesforce/schema/Contact.FirstName';
import MobilePhone from '@salesforce/schema/Contact.MobilePhone';
import DateofJoining from '@salesforce/schema/Contact.Date_of_Joining__c';
import Address1 from '@salesforce/schema/Contact.Address1__c';
import Address2 from '@salesforce/schema/Contact.Address2__c';
import LastName from '@salesforce/schema/Contact.LastName';
//import EnrollmentId from '@salesforce/schema/Contact.Enrollment_Id__c';
import MiddleName from '@salesforce/schema/Contact.Middle_Name__c';
import Email from '@salesforce/schema/Contact.Email';
import ClassName from '@salesforce/schema/Contact.Class_Name__c';
import ClassSection from '@salesforce/schema/Contact.Class_Section__c';
import Year from '@salesforce/schema/Contact.Academic_Year__c';
//import RollNumber from '@salesforce/schema/Contact.Roll_Number__c';
import DateofBirth from '@salesforce/schema/Contact.Date_of_Birth__c';
import Gender from '@salesforce/schema/Contact.Gender__c';
import BloodGroup from '@salesforce/schema/Contact.Blood_Group__c';
import Country from '@salesforce/schema/Contact.Nationality__c';
import State from '@salesforce/schema/Contact.State__c';
import Pincode from '@salesforce/schema/Contact.Pincode__c';
import City from '@salesforce/schema/Contact.City_Town__c';
import Status from '@salesforce/schema/Contact.Status__c';
import FatherContactNumber from '@salesforce/schema/Contact.Father_s_Contact_Number__c';
import FatherName from '@salesforce/schema/Contact.Father_s_Name__c';
import FatherOccupation from '@salesforce/schema/Contact.Father_s_Occupation__c';
import MotherContactNumber from '@salesforce/schema/Contact.Mother_s_Contact_Number__c';
import MotherName from '@salesforce/schema/Contact.Mother_s_Name__c';
import MotherOccupation from '@salesforce/schema/Contact.Mother_s_Occupation__c';
import GuardianContactNumber from '@salesforce/schema/Contact.Guardian_s_Contact_Number__c';
import GuardianName from '@salesforce/schema/Contact.Guardian_s_Name__c';
import GuardianOccupation from '@salesforce/schema/Contact.Guardian_s_Occupation__c';
import { createRecord } from 'lightning/uiRecordApi'; //student/parent
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class CreateStudent extends LightningElement {

    activeSections = ['A', 'B', 'C', 'D', 'E'];
    activeSectionsMessage = '';

    handleSectionToggle(event) {
        const openSections = event.detail.openSections;

        if (openSections.length === 0) {
            this.activeSectionsMessage = 'All sections are closed';
        } else {
            this.activeSectionsMessage =
                'Open sections: ' + openSections.join(', ');
        }
    }

    FirstName = '';
    LastName = '';
    MobilePhone = '';
    DateofJoining = '';
    //EnrollmentId = '';
    Address1 = '';
    Address2 = '';
    MiddleName = '';
    ClassName = '';
    ClassSection = '';
    From_Academic_Year = '';
    To_Academic_Year = '';
    Email = '';
    //RollNumber = '';
    DateofBirth = '';
    Gender = '';
    BloodGroup = '';
    Country = '';
    State = '';
    Pincode = '';
    City = '';
    Address3 = '';
    Address4 = '';
    Country1 = '';
    State1 = '';
    City1 = '';
    Pincode1 = '';
    FatherContactNumber='';
    FatherName = '';
    FatherOccupation = '';
    MotherContactNumber = '';
    MotherName = '';
    MotherOccupation = '';
    GuardianContactNumber = '';
    GuardianName = '';
    GuardianOccupation = '';
    @track filter='';
    @track Year;

    @track isModalOpen = false;

    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
        this.newFileWasUploaded = false;
    }

    @api recordId;
    newFileWasUploaded = false;
    uploadedFilesUrl = [];

    get acceptedFormats() {
        return ['.jpg', '.png'];
    }

    /* connectedCallback(){
        console.log('Codeeerun'+JSON.stringify(this.dataeditObj));
        } */


    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        if (uploadedFiles /* && uploadedFiles.length > 0 */) {
            this.newFileWasUploaded = true;
            uploadedFiles.forEach(element => {
                this.uploadedFilesUrl.push({
                    id: '/sfc/servlet.shepherd/version/download/' + element.contentVersionId
                })
            });
        }
    }

    
    handleCheckBox(event) {
        //console.log("hello");
        if(event.target.checked == true) {
            this.Address3 = this.Address1;
            this.Address4 = this.Address2;
            this.Country1 = this.Country;
            this.State1 = this.State;
            this.City1 = this.City;
            this.Pincode1 = this.Pincode;
        }
        else {
            this.Address3 = "";
            this.Address4 = "";
            this.Country1 = "";
            this.State1 = "";
            this.City1 = "";
            this.Pincode1 = "";
        }
    }

    @track Disabled = false;
    @track disabled = true;
    /* @track valueSelected = true; */

    classInpChange(event) {
        this.ClassName = event.detail;
        this.filter = ' Class__c ='+'\''+ event.detail+'\'';
        /* if(this.filter != ' Class__c ='+'\''+ event.detail+'\'') {
            this.disabled = false;
        } 
        else {
            this.disabled = true;
        } */
        this.disabled = event.detail ? false : true
        console.log(JSON.stringify(event.detail));
    }

    classSecInpChange(event) {
        this.ClassSection = event.detail;
        //this.disabled = event.detail;
    }

    handleAccountSelection(event) {
        console.log('eventtttttttt1')
    
        this.Year = event.detail;
        console.log('handlerAccountSelection' + this.Year);
    }

    disableSec(event) {
        this.disabled = event.detail;
    }

    handleInputChange(event) {
        //console.log("hello");
        if (event.target.label == "First Name") {
            this.FirstName = event.target.value;
        }
        if (event.target.label == "Last Name") {
            this.LastName = event.target.value;
        }
        if (event.target.label == "Date of Admission") {
            this.DateofJoining = event.target.value;
            //console.log(this.DateofJoining + JSON.stringify(this.DateofJoining))
        }
        /* if (event.target.label == "Enrollment Id") {
            this.EnrollmentId = event.target.value;
        } */
        if (event.target.label == "Mobile Number") {
            if(event.target.value.length==10){
                this.MobilePhone = event.target.value;
                this.Disabled = true;
            }else{
                event.target.Disabled;
            }
            console.log(this.MobilePhone + JSON.stringify(this.MobilePhone))
        }
        if (event.target.label == "Address 1") {
            this.Address1 = event.target.value;
        }
        if (event.target.label == "Address 2") {
            this.Address2 = event.target.value;
        }
        if(event.target.label == "Email Address") {
            this.Email = event.target.value;
            //console.log(this.Email + JSON.stringify(this.Email))
        }
        /* if(event.target.label == "Roll Number") {
            this.RollNumber = event.target.value;
            console.log(this.RollNumber + JSON.stringify(this.RollNumber))
        } */
        if(event.target.label == "Date of Birth") {
            this.DateofBirth = event.target.value;
        }
        if(event.target.label == "Gender") {
            this.Gender = event.detail.value;
            console.log(this.Gender + JSON.stringify(this.Gender))
        }
        if(event.target.label == "State") {
            this.State = event.target.value;
        }
        if(event.target.label == "Pincode") {
            this.Pincode = event.target.value;
        }
        if(event.target.label == "City/Town") {
            this.City = event.target.value;
        }
        if(event.target.label == "Middle Name") {
            this.MiddleName = event.target.value;
        }
        /* if(event.target.label == "ClassName") {
            this.ClassName =  event.detail.value;
        } */
        if(event.target.label == "Blood Group") {
            this.BloodGroup = event.detail.value;
            console.log(this.BloodGroup + JSON.stringify(this.BloodGroup))
        }
        if(event.target.label == "Country") {
            this.Country = event.detail.value;
        }
        if(event.target.label == "Father's Contact Number") {
            this.FatherContactNumber = event.detail.value;
        }
        if(event.target.label == "Father's Name") {
            this.FatherName = event.detail.value;
        }
        if(event.target.label == "Father's Occupation") {
            this.FatherOccupation = event.detail.value;
        }
        if(event.target.label == "Mother's Contact Number") {
            this.MotherContactNumber = event.detail.value;
        }
        if(event.target.label == "Mother's Name") {
            this.MotherName = event.detail.value;
        }
        if(event.target.label == "Mother's Occupation") {
            this.MotherOccupation = event.detail.value;
        }
        if(event.target.label == "Guardian's Contact Number") {
            this.GuardianContactNumber = event.detail.value;
        }
        if(event.target.label == "Guardian's Name") {
            this.GuardianName = event.detail.value;
        }
        if(event.target.label == "Guardian's Occupation") {
            this.GuardianOccupation = event.detail.value;
        }
    }

    isInputValid() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.validate');
        inputFields.forEach(inputFiel1d => {
            if(!inputFiel1d.checkValidity()) {
                inputFiel1d.reportValidity();
                isValid = false;
            }
        });      
        //console.log("hello====........."); 
        return isValid;
    }

    ShowToast() {
        const toastEvent = new ShowToastEvent({
            title: 'Success!',
            message: 'Student created successfully',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }

    showErrorToast(msg) {
        const evt = new ShowToastEvent({
            title: 'Toast Error',
            message: msg,
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    saveChangeHandler(event) {
        event.preventDefault();
        //console.log("hello=========>>>>>>>>>>>>>");
        const fields = {};
        fields[Status.fieldApiName] = 'Active';
        fields[FirstName.fieldApiName] = this.FirstName;
        fields[MobilePhone.fieldApiName] = this.MobilePhone;
        fields[DateofJoining.fieldApiName] = this.DateofJoining;
        fields[Address1.fieldApiName] = this.Address1;
        fields[Address2.fieldApiName] = this.Address2;
        fields[LastName.fieldApiName] = this.LastName;
        //fields[EnrollmentId.fieldApiName] = this.EnrollmentId;
        fields[MiddleName.fieldApiName] = this.MiddleName;
        fields[ClassName.fieldApiName] = this.ClassName;
        console.log(this.ClassName);
        fields[ClassSection.fieldApiName] = this.ClassSection;
        fields[Year.fieldApiName] = this.Year;
        fields[Email.fieldApiName] = this.Email;
        //fields[RollNumber.fieldApiName] = this.RollNumber;
        fields[DateofBirth.fieldApiName] = this.DateofBirth;
        fields[Gender.fieldApiName] = this.Gender;
        //console.log("hi=====>>>"+this.Gender);
        fields[BloodGroup.fieldApiName] = this.BloodGroup;
        //console.log("hey====>" + this.BloodGroup);
        fields[Country.fieldApiName] = this.Country;
        fields[State.fieldApiName] = this.State;
        fields[Pincode.fieldApiName] = this.Pincode;
        fields[City.fieldApiName] = this.City;
        fields[FatherContactNumber.fieldApiName] = this.FatherContactNumber;
        fields[FatherName.fieldApiName] = this.FatherName;
        fields[FatherOccupation.fieldApiName] = this.FatherOccupation;
        fields[MotherContactNumber.fieldApiName] = this.MotherContactNumber;
        fields[MotherName.fieldApiName] = this.MotherName;
        fields[MotherOccupation.fieldApiName] = this.MotherOccupation;
        fields[GuardianContactNumber.fieldApiName] = this.GuardianContactNumber;
        fields[GuardianName.fieldApiName] = this.GuardianName;
        fields[GuardianOccupation.fieldApiName] = this.GuardianOccupation;
        fields['RecordTypeId'] = '0126s000000CsnlAAC';
        const recordInput = { apiName: CONTACT_OBJECT.objectApiName,  fields };
        //fields[Id.fieldApiName] = this.recordId;
        console.log(JSON.stringify(recordInput));
        if(this.isInputValid()) {
        createRecord(recordInput)
            .then(result => {
                this.contactId = result.id;
                this.ShowToast();
                this.newFileWasUploaded = false;
                //console.log("hello" + JSON.stringify(result));
                setTimeout(() => {
                    location.reload();
                }, 1500);
            })
            .catch(error => {  
                //this.showErrorToast(error); 
                console.log(JSON.stringify(error.body.output.errors[0].duplicateRecordError.matchResults[0].matchRule));
                 const err2 = "StudentMatchingRule";
                 /* const err3 = "Enrollment_Matching_Rule";  */
                //console.log(JSON.stringify(error.body.output.errors[0].duplicateRecordError.matchResults[0].matchRule)); 
                const err = "Email_Duplicate_Rule";
                if(error.body.output.errors[0].duplicateRecordError.matchResults[0].matchRule === err) {
                    this.showErrorToast('Duplicate Email alert');
                }
                if(error.body.output.errors[0].duplicateRecordError.matchResults[0].matchRule === err2) {
                    this.showErrorToast('Duplicate MobileNumber alert');
                } 
                /* if(error.body.output.errors[0].duplicateRecordError.matchResults[0].matchRule === err3) {
                    this.showErrorToast('Duplicate Enrollment Id alert');
                } */
            })
        }
        else {
            this.showErrorToast('Student cannot be created');
        }
    }


    /* get options1() {
        return [
            { label: 'SSLC', value: 'SSLC' },
            { label: 'HSC', value: 'HSC' },
            { label: 'College', value: 'College' },
        ];
    } */
    get options2() {
        return [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
            { label: 'Others', value: 'Others' },
        ];
    }
    get options3() {
        return [
            { label: 'A-positive (A+)', value: 'A-positive (A+)' },
            { label: 'A-negative (A-', value: 'A-negative (A-)' },
            { label: 'B-positive (B+', value: 'B-positive (B+)' },
            { label: 'B-negative (B-)', value: 'B-negative (B-)' },
            { label: 'AB-positive (AB+)', value: 'AB-positive (AB+)' },
            { label: 'AB-negative (AB-)', value: 'AB-negative (AB-)' },
            { label: 'O-positive (O+)', value: 'O-positive (O+)' },
            { label: 'O-negative (O-)', value: 'O-negative (O-)' },
        ];
    }
    get options4() {
        return [
            { label: 'India', value: 'India' },
            { label: 'USA', value: 'USA' },
            { label: 'Canada', value: 'Canada' },
            { label: 'UK', value: 'UK' }
        ];
    }
}