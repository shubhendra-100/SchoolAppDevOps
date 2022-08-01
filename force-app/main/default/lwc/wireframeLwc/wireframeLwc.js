import { LightningElement, track, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccounts from '@salesforce/apex/wireframecls.getAccounts';
import getRelatedFilesByRecordId from '@salesforce/apex/wireframecls.getRelatedFilesByRecordId';

import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import submitScoreAction from '@salesforce/apex/wireframecls.submitScoreAction';


import Account_OBJECT from '@salesforce/schema/Account';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import SCHOOLTYPE_FIELD from '@salesforce/schema/Account.Shcool_Type__c';
import GRADEFROM_FIELD from '@salesforce/schema/Account.Grade_From__c';
import GRADETO_FIELD from '@salesforce/schema/Account.Grade_To__c';
import AFFILIATETOBOARD_FIELD from '@salesforce/schema/Account.Affiliate_to_Board__c';
import LANGUAGE_FIELD from '@salesforce/schema/Account.Language_of_Instruction__c';
import MEDIUM_FIELD from '@salesforce/schema/Account.Medium__c';
import PROMOTED_FIELD from '@salesforce/schema/Account.Promoted__c';
import SCHOOLFACILITIES_FIELD from '@salesforce/schema/Account.School_Facilities__c';
import BOARDTYPE_FIELD from '@salesforce/schema/Account.Board_Type__c';

import SCHOOL_FIELD from '@salesforce/schema/Account.Name';
import AFFILIATEID_FIELD from '@salesforce/schema/Account.Affiliate_Id__c';
import STREET_FIELD from '@salesforce/schema/Account.Street__c';
import STATE_FIELD from '@salesforce/schema/Account.State__c';
import CITY_FIELD from '@salesforce/schema/Account.City_Town__c';
import PINCODE_FIELD from '@salesforce/schema/Account.PinCode__c';
import COUNTRY_FIELD from '@salesforce/schema/Account.Country__c';

import GRADEFRM_FIELD from '@salesforce/schema/Account.Grade_From__c';
import GRADET_FIELD from '@salesforce/schema/Account.Grade_To__c';
import AFFILIATEBOARD_FIELD from '@salesforce/schema/Account.Affiliate_to_Board__c';
import LANGUAGEINSTRUCTION_FIELD from '@salesforce/schema/Account.Language_of_Instruction__c';
import SCHOOLSTATUS_FIELD from '@salesforce/schema/Account.Status_of_School_Affiliation__c';
import SCHOOLESTABLISHMENT_FIELD from '@salesforce/schema/Account.Year_of_School_Establishment__c';
import AFFILIATIONGRANTEDON_FIELD from '@salesforce/schema/Account.School_Affiliation_Granted_On__c';
import REGISTERWITH_FIELD from '@salesforce/schema/Account.School_Registered_With__c';
import TOTALSTUDENT_FIELD from '@salesforce/schema/Account.Total_Number_of_Students__c';
import BOARDTYPES_FIELD from '@salesforce/schema/Account.Board_Type__c';
import MEDIUMS_FIELD from '@salesforce/schema/Account.Medium__c';
import ADMISSION_FIELD from '@salesforce/schema/Account.Admission_Open__c';
import LANDNUMBER_FIELD from '@salesforce/schema/Account.Landline_Number__c';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import PROMOTEDS_FIELD from '@salesforce/schema/Account.Promoted__c';
import VERIFIED_FIELD from '@salesforce/schema/Account.Is_Verified__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Account.Description';
import FACILITIES_FIELD from '@salesforce/schema/Account.School_Facilities__c';

const fields = [SCHOOL_FIELD, AFFILIATEID_FIELD, SCHOOLTYPE_FIELD, STREET_FIELD, STATE_FIELD, CITY_FIELD, PINCODE_FIELD, COUNTRY_FIELD, GRADEFRM_FIELD,
    GRADET_FIELD, AFFILIATEBOARD_FIELD, LANGUAGEINSTRUCTION_FIELD, SCHOOLSTATUS_FIELD, SCHOOLESTABLISHMENT_FIELD, AFFILIATIONGRANTEDON_FIELD,
    REGISTERWITH_FIELD, TOTALSTUDENT_FIELD, BOARDTYPES_FIELD, MEDIUMS_FIELD, ADMISSION_FIELD, LANDNUMBER_FIELD, WEBSITE_FIELD, PROMOTEDS_FIELD,
    VERIFIED_FIELD, DESCRIPTION_FIELD, FACILITIES_FIELD];



export default class WireframeLwc extends LightningElement {


    @track value;
    @track allvalues = [];
    accordianSection = '';
    @track options;
    @track mapMarkers;
    @track address;
    @track city;
    @track street;
    @track country;
    @track province;
    @track postalcode;

    @track schoolName;
    @track affiliateId;
    @track schooltype;
    @track gradefrom;
    @track gradeto;
    @track affiliatetoboard;
    @track language;
    @track statusaffiliation = [];
    @track yse;
    @track sag;
    @track schoolregisteredwith;
    @track noofstudents;
    @track boardtype;
    @track medium;
    @track admissionopen;
    @track landlinenumber;
    @track website;
    @track promoted;
    @track isverified;
    @track describeschool;
    @track schoolfacilities;

    @api recordId;
    Id;
    accountId;
    datatableresp;
    @wire(getAccounts)
    wiredAccount(result) {
        this.datatableresp = result;
        if (result.data) {
            this.Id = result.data
            console.log('data==>', this.Id);
            this.accountId = this.Id[0].Id;
            console.log('account==>', this.accountId);
            this.recordId = this.Id[0].Id;
            console.log('recordId==>', this.recordId);
        } else {
            this.error = result.error
        }
    }
    filesList = [];
    @wire(getRelatedFilesByRecordId, { recordId: '$recordId' })
    wiredResult({ data, error }) {
        if (data) {
            console.log(data)
            this.filesList = Object.keys(data).map(item => {
                return {
                    "label": data[item],
                    "value": item,
                    "url": `/sfc/servlet.shepherd/document/download/${item}`,
                    // "src": img.style.visibility = (visible ? 'visible' : 'hidden')
                }
            })
            console.log("new updated: ", this.filesList)
        }
        if (error) {
            console.log(error)
        }
    }
    @track accounts;
    //fetching data into the form
    @wire(getRecord, { recordId: '$recordId', fields })
    fwtAccountDate({ data, error }) {
        if (data) {
            this.accounts = JSON.parse(JSON.stringify(data));
             console.log("---->>Acc", JSON.parse(JSON.stringify(this.accounts.fields.Name.value)));
            this.schoolname = this.accounts.fields.Name.value
            console.log("---->>Acc---->", this.schoolname);

            this.affiliateIds = JSON.parse(JSON.stringify(this.accounts.fields.Affiliate_Id__c.value))
            this.streets = JSON.parse(JSON.stringify(this.accounts.fields.Street__c.value))
            this.states = JSON.parse(JSON.stringify(this.accounts.fields.State__c.value))
            this.cities = JSON.parse(JSON.stringify(this.accounts.fields.City_Town__c.value))
            this.postalcodes = JSON.parse(JSON.stringify(this.accounts.fields.PinCode__c.value))
            this.countries = JSON.parse(JSON.stringify(this.accounts.fields.Country__c.value))
            this.schooltypes = JSON.parse(JSON.stringify(this.accounts.fields.Shcool_Type__c.value))
            this.gradefroms = JSON.parse(JSON.stringify(this.accounts.fields.Grade_From__c.value))
            this.gradetos = JSON.parse(JSON.stringify(this.accounts.fields.Grade_To__c.value))
            this.affiliateboards = JSON.parse(JSON.stringify(this.accounts.fields.Affiliate_to_Board__c.value))
            this.languages = JSON.parse(JSON.stringify(this.accounts.fields.Language_of_Instruction__c.value))
            this.statuss = JSON.parse(JSON.stringify(this.accounts.fields.Status_of_School_Affiliation__c.value))
            this.schoolestablishments = JSON.parse(JSON.stringify(this.accounts.fields.Year_of_School_Establishment__c.value))
            this.affiliationgranted = JSON.parse(JSON.stringify(this.accounts.fields.School_Affiliation_Granted_On__c.value))
            this.registerwiths = JSON.parse(JSON.stringify(this.accounts.fields.School_Registered_With__c.value))
            this.totalstudents = JSON.parse(JSON.stringify(this.accounts.fields.Total_Number_of_Students__c.value))
            this.boardtypes = JSON.parse(JSON.stringify(this.accounts.fields.Board_Type__c.value))
            this.mediums = JSON.parse(JSON.stringify(this.accounts.fields.Medium__c.value))
            this.admissions = JSON.parse(JSON.stringify(this.accounts.fields.Admission_Open__c.value))
            this.landnumbers = JSON.parse(JSON.stringify(this.accounts.fields.Landline_Number__c.value))
            this.websites = JSON.parse(JSON.stringify(this.accounts.fields.Website.value))
            this.promoteds = JSON.parse(JSON.stringify(this.accounts.fields.Promoted__c.value))
            this.verifieds = JSON.parse(JSON.stringify(this.accounts.fields.Is_Verified__c.value))
            this.descriptions = JSON.parse(JSON.stringify(this.accounts.fields.Description.value))
            console.log("---->>Acc", this.accounts);
            if(this.accounts.fields.School_Facilities__c.value != null || this.accounts.fields.School_Facilities__c.value!=""){
                this.accounts.fields.School_Facilities__c.value.split(';').map((item) => {
                    this.allvalues.push(item);
                });
            }
            // console.log(JSON.stringify(getFieldValue(this.accounts.data, FACILITIES_FIELD)));
        }
    };
    
    @track schoolname
    @track affiliateIds
    @track streets
    @track states
    @track cities
    @track postalcodes
    @track countries
    @track schooltypes
    @track gradefroms
    @track gradetos
    @track affiliateboards
    @track languages
    @track statuss
    @track schoolestablishments
    @track affiliationgranted
    @track registerwiths
    @track totalstudents
    @track boardtypes
    @track mediums
    @track admissions
    @track landnumbers
    @track websites
    @track promoteds
    @track verifieds
    @track descriptions



    // get schoolname() {
    //     console.log("Heieiie   ",JSON.stringify(this.accounts.fields.Name.value));
    //     return this.accounts.fields.Name.value;
    // }
    // get affiliateIds() {
    //     return this.accounts.fields.Affiliate_Id__c.value;
    // }
    // get streets() {
    //     return this.accounts.fields.Street__c.value;
    // }
    // get states() {
    //     return this.accounts.fields.State__c.value;
    // }
    // get cities() {
    //     return this.accounts.fields.City_Town__c.value;
    // }
    // get postalcodes() {
    //     return this.accounts.fields.PinCode__c.value;
    // }
    // get countries() {
    //     return this.accounts.fields.Country__c.value;
    // }
    // get schooltypes() {
    //     return this.accounts.fields.Shcool_Type__c.value;
    // }
    // get gradefroms() {
    //     return this.accounts.fields.Grade_From__c.value;
    // }
    // get gradetos() {
    //     return this.accounts.fields.Grade_To__c.value;
    // }
    // get affiliateboards() {
    //     return this.accounts.fields.Affiliate_to_Board__c.value;
    // }
    // get languages() {
    //     return this.accounts.fields.Language_of_Instruction__c.value;
    // }
    // get statuss() {
    //     return this.accounts.fields.Status_of_School_Affiliation__c.value;
    // }
    // get schoolestablishments() {
    //     return this.accounts.fields.Year_of_School_Establishment__c.value;
    // }
    // get affiliationgranted() {
    //     return this.accounts.fields.School_Affiliation_Granted_On__c.value;
    // }
    // get registerwiths() {
    //     return this.accounts.fields.School_Registered_With__c.value;
    // }
    // get totalstudents() {
    //     return this.accounts.fields.Total_Number_of_Students__c.value;
    // }
    // get boardtypes() {
    //     return this.accounts.fields.Board_Type__c.value;
    // }
    // get mediums() {
    //     return this.accounts.fields.Medium__c.value;
    // }
    // get admissions() {
    //     return this.accounts.fields.Admission_Open__c.value;
    // }
    // get landnumbers() {
    //     return this.accounts.fields.Landline_Number__c.value;
    // }
    // get websites() {
    //     return this.accounts.fields.Website.value;
    // }
    // get promoteds() {
    //     return this.accounts.fields.Promoted__c.value;
    // }
    // get verifieds() {
    //     return this.accounts.fields.Is_Verified__c.value;
    // }
    // get descriptions() {
    //     return this.accounts.fields.Description.value;
    // }
    // get schholFacilities() {
    //     let objList = [];
    //     getFieldValue(this.accounts.data, FACILITIES_FIELD) &&
    //         getFieldValue(this.accounts.data, FACILITIES_FIELD).split(';').map((item) => {

    //             objList.push(item);

    //         });
    //     console.log(objList);
    //     // console.log(JSON.stringify(getFieldValue(this.accounts.data, FACILITIES_FIELD)));
    //     return objList;
    // }

    // connectedCallback(){
    //     this.schholFacilities();
    // }

    // schoolfac;
    /*get facilities(){
        console.log('facilities==>',getFieldValue(this.accounts.data, FACILITIES_FIELD).split(';'));
        return getFieldValue(this.accounts.data, FACILITIES_FIELD).split(';');
    }*/


    //passing values from input
    schoolnameChangeVal(event) {
        this.schoolName = event.target.value;
        console.log('schname===>' + this.schoolName);
    }
    affiliateChangeVal(event) {
        this.affiliateId = event.target.value;
        console.log('affid===>' + this.affiliateId);
    }
    schooltypeChangeVal(event) {
        this.schooltype = event.target.value;
        console.log('school type===>' + this.schooltype);
    }
    gradefromChangeVal(event) {
        this.gradefrom = event.target.value;
        console.log('gradefrom===>' + this.gradefrom);
    }
    gradetoChangeVal(event) {
        this.gradeto = event.target.value;
        console.log('gradeto===>' + this.gradeto);
    }
    affiliatetoboardChangeVal(event) {
        this.affiliatetoboard = event.target.value;
        console.log('affboard===>' + this.affiliatetoboard);
    }
    languageChangeVal(event) {
        this.language = event.target.value;
        console.log('language===>' + this.language);
    }
    Affiliationstatuschangeval(event) {
        this.statusaffiliation = event.target.checked;
        console.log('status====>' + this.statusaffiliation)
        const element = this.template.querySelector('[data-id="toggle1"]');
        console.log('element: ', element.checked);
        console.log('element: ', element.label);
        element.setAttribute('checked', true);
        element.setAttribute('unchecked', false);
        console.log('element: ', element.checked);
    }

    yseChangeVal(event) {
        this.yse = event.target.value;
        console.log('yse===>' + this.yse);
    }
    sagChangeVal(event) {
        this.sag = event.target.value;
        console.log('sag===>' + this.sag);
    }
    schoolregisteredwithChangeVal(event) {
        this.schoolregisteredwith = event.target.value;
        console.log('regwith===>' + this.schoolregisteredwith);
    }
    noofstudentsChangeVal(event) {
        this.noofstudents = event.target.value;
        console.log('nostudents===>' + this.noofstudents);
    }
    boardtypeChangeVal(event) {
        this.boardtype = event.target.value;
        console.log('boardtype===>' + this.boardtype);
    }
    mediumChangeVal(event) {
        this.medium = event.target.value;
        console.log('medium===>' + this.medium);
    }
    admissionopenChangeval(event) {
        this.admissionopen = event.target.checked;
        console.log('admission====>' + this.admissionopen);
        const element = this.template.querySelector('[data-id="toggle2"]');
        console.log('element: ', element.checked);
        console.log('element: ', element.label);
        element.setAttribute('checked', true);
        element.setAttribute('unchecked', false);
        console.log('element: ', element.checked);
    }
    landlinenumberChangeVal(event) {
        this.landlinenumber = event.target.value;
        console.log('landlinenumber===>' + this.landlinenumber);
    }
    websiteChangeVal(event) {
        this.website = event.target.value;
        console.log('website===>' + this.website);
    }
    promotedChangeVal(event) {
        this.promoted = event.target.value;
        console.log('promoted===>' + this.promoted);
    }
    isverifiedChangeval(event) {
        this.isverified = event.target.checked;
        console.log('verified===>' + this.isverified)
        const element = this.template.querySelector('[data-id="toggle3"]');
        console.log('element: ', element.checked);
        console.log('element: ', element.label);
        element.setAttribute('checked', true);
        element.setAttribute('unchecked', false);
        console.log('element: ', element.checked);
    }
    describeschoolChangeVal(event) {
        this.describeschool = event.target.value;
        console.log('describe===>' + this.describeschool);
    }

    //multiselect picklist value
    schoolfacilitiesChangeVal(event) {
        console.log('value===>', typeof(this.allvalues));
        if (!this.allvalues.includes(event.target.value)) {
            this.allvalues.push(event.target.value);
        }

    }
    handleremove(event) {
        console.log("---> event  ", JSON.stringify(event.target.name), JSON.stringify(this.allvalues));
        const valueremoved = event.target.name;
        this.allvalues.splice(this.allvalues.indexOf(valueremoved), 1);
        console.log(this.allvalues.indexOf(valueremoved));
    }
    //allfac=[];
    /*handleremoves(event){
        if(!this.allfac.includes(event.target.name)){
            this.allfac.push(this.facilities);
            console.log('value===>'+this.allfac);
        }
        console.log('facilities===>',event.target.name);
        console.log('index===>',this.facilities.indexOf(event.target.name),1);
        this.allfac.splice(this.allfac.indexOf(event.target.name),1);
        console.log('dtata==>',event.target.name)
        console.log('fac==>',this.allfac)
    }*/
    //map location
    addressChangeVal(event) {
        this.street = event.target.street;
        console.log('Street => ', event.target.street);
        this.city = event.target.city;
        console.log('City => ', event.target.city);
        this.province = event.target.province;
        console.log('Province => ', event.target.province);
        this.country = event.target.country;
        console.log('Country => ', event.target.country);
        this.postalcode = event.target.postalCode;
        console.log('postal Code => ', event.target.postalCode);
    }

    /*mapMarkers = [
         {
             location: {
                 
                 Street: this.street,
                 City: this.city,
                 State:this.province,
                 postalcode:this.postalcode,
             },
 
             title: 'i am here',
             description:
                 'this is test school location.',
         },
         
     ];*/

    /*uploadedFilesUrl = [];
    uploadedFiles = []; file; fileContents; fileReader; content; fileName
    handleUploadFinished(event){
        this.uploadedFiles = event.detail.files;
        console.log(this.uploadedFiles) 
        this.file = this.uploadedFiles[0];
        console.log('file==>',this.file)  
        this.fileName = this.uploadedFiles[0].name;
        console.log('filename====>',this.fileName)    
        if(this.uploadedFiles && this.uploadedFiles.length > 0){
            this.uploadedFiles.forEach(element => {
                this.uploadedFilesUrl.push({
                    id : '/sfc/servlet.shepherd/version/download/' + element.contentVersionId,
                })
            });
        }
        /*this.fileReader = new FileReader();
            this.fileReader.onload = () => {  
            console.log('reader===>',this.fileReader.result)
            this.fileContents = this.fileReader.result;  
            let base64 = 'base64,';  
            this.content = this.fileContents.indexOf(base64) + base64.length;  
            this.fileContents = this.fileContents.substring(this.content); 
            this.submitDetails();
            }
            this.fileReader.readAsDataURL(this.file);
    }*/

    frame;
    uploadedFiles = []; file; fileContents; fileReader; content; fileName
    fileupload(event) {
        this.frame = []
        this.filesList = []
        this.frame = URL.createObjectURL(event.target.files[0]);
        console.log('file==>', event.target.files[0])
        this.uploadedFiles = event.detail.files;
        this.fileName = event.target.files[0].name;
        this.file = this.uploadedFiles[0];
        console.log(this.file)
        this.fileReader = new FileReader();
        this.fileReader.onload = () => {
            console.log('reader===>', this.fileReader.result)
            this.fileContents = this.fileReader.result;
            let base64 = 'base64,';
            this.content = this.fileContents.indexOf(base64) + base64.length;
            this.fileContents = this.fileContents.substring(this.content);
            this.submitScoreAction();
        }
        this.fileReader.readAsDataURL(this.file);
    }






    //accordion section
    handleToggleSection(event) {
        if (this.accordianSection.length === 0) {
            this.accordianSection = ''
        }
    }

    //fetching data from Objectapi
    @wire(getObjectInfo, { objectApiName: Account_OBJECT })
    accountMetadata;

    // now get the industry picklist values
    @wire(getPicklistValues, { recordTypeId: '0126s000000CsgVAAS', fieldApiName: CITY_FIELD })
    cityPicklist;
    @wire(getPicklistValues, { recordTypeId: '0126s000000CsgVAAS', fieldApiName: COUNTRY_FIELD })
    countryPicklist;
    @wire(getPicklistValues, { recordTypeId: '0126s000000CsgVAAS', fieldApiName: STATE_FIELD })
    statePicklist;

    @wire(getPicklistValues, { recordTypeId: '0126s000000CsgVAAS', fieldApiName: SCHOOLTYPE_FIELD })
    schooltypePicklist;
    @wire(getPicklistValues, { recordTypeId: '0126s000000CsgVAAS', fieldApiName: GRADEFROM_FIELD })
    gradefromPicklist;
    @wire(getPicklistValues, { recordTypeId: '0126s000000CsgVAAS', fieldApiName: GRADETO_FIELD })
    gradetoPicklist;
    @wire(getPicklistValues, { recordTypeId: '0126s000000CsgVAAS', fieldApiName: AFFILIATETOBOARD_FIELD })
    affiliatetoboardPicklist;
    @wire(getPicklistValues, { recordTypeId: '0126s000000CsgVAAS', fieldApiName: LANGUAGE_FIELD })
    languagePicklist;
    @wire(getPicklistValues, { recordTypeId: '0126s000000CsgVAAS', fieldApiName: MEDIUM_FIELD })
    mediumPicklist;
    @wire(getPicklistValues, { recordTypeId: '0126s000000CsgVAAS', fieldApiName: PROMOTED_FIELD })
    promotedPicklist;
    @wire(getPicklistValues, { recordTypeId: '0126s000000CsgVAAS', fieldApiName: SCHOOLFACILITIES_FIELD })
    schoolfacilitiesPicklist;
    @wire(getPicklistValues, { recordTypeId: '0126s000000CsgVAAS', fieldApiName: BOARDTYPE_FIELD })
    boardtypePicklist;

    //inline edit account record   

    @track isModalOpen = false;
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }

    Updatedetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        console.log('recordId===>', this.recordId);
        // this.schoolfac = this.facilities + ';' + this.allvalues.join(';');
        // console.log('fac==>', this.schoolfac)

        const isInputsCorrect = [
            ...this.template.querySelectorAll("lightning-input")
        ].reduce((validSoFar, inputField) => {
            inputField.reportValidity();
            return validSoFar && inputField.checkValidity();
        }, true);
        if (isInputsCorrect) {
            var fields = {
                //accountname:this.accountname,
                schoolName: this.schoolName,
                //uploadedFiles: this.uploadedFiles
            };
        }

        //file insertion  
        console.log('ABCD===>', this.file)

        //console.log('accname=====>'+this.street)

        var acc = {
            'sobjectType': 'Account', 'Id': this.recordId, 'Name': this.schoolName, 'Country__c': this.country, 'Street__c': this.street, 'State__c': this.province, 'City_Town__c': this.city, 'PinCode__c': this.postalcode, 'Affiliate_Id__c': this.affiliateId, 'Shcool_Type__c': this.schooltype,
            'Grade_From__c': this.gradefrom, 'Grade_To__c': this.gradeto, 'Affiliate_to_Board__c': this.affiliatetoboard,
            'Language_of_Instruction__c': this.language, 'Status_of_School_Affiliation__c': this.statusaffiliation, 'Year_of_School_Establishment__c': this.yse,
            'School_Affiliation_Granted_On__c': this.sag, 'School_Registered_With__c': this.schoolregisteredwith, 'Total_Number_of_Students__c': this.noofstudents, 'Board_Type__c': this.boardtype,
            'Medium__c': this.medium, 'Admission_Open__c': this.admissionopen, 'Landline_Number__c': this.landlinenumber, 'Website': this.website,
            'Promoted__c': this.promoted, 'Is_Verified__c': this.isverified, 'Description': this.describeschool, 'School_Facilities__c': this.allvalues.join(';')
        }
        // console.log('facili==', this.schoolfac);
        console.log('acc==>', acc)
        submitScoreAction({
            accountRec: acc,
            file: encodeURIComponent(this.fileContents),
            fileName: this.fileName

        })
            .then(result => {
                //refreshApex(this.datatableresp);
                console.log('file-======>' + this.file)
                console.log('obj-======>' + this.schoolName)
                if (this.recodId == null) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Profile Updated Successfully',
                            variant: 'success',
                        }),
                    );
                }
                this.isModalOpen = false;
                location.reload();
            })



    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        console.log('recordId===>', this.recordId);

        const isInputsCorrect = [
            ...this.template.querySelectorAll("lightning-input")
        ].reduce((validSoFar, inputField) => {
            inputField.reportValidity();
            return validSoFar && inputField.checkValidity();
        }, true);
        if (isInputsCorrect) {
            var fields = {
                //accountname:this.accountname,
                schoolName: this.schoolName,
                //uploadedFiles: this.uploadedFiles
            };
        }

        //file insertion  
        console.log('ABCD===>', this.file)

        //console.log('accname=====>'+this.street)

        var acc = {
            'sobjectType': 'Account', 'Id': this.recordId, 'Name': this.schoolName, 'Country__c': this.country, 'Street__c': this.street, 'State__c': this.province, 'City_Town__c': this.city, 'PinCode__c': this.postalcode, 'Affiliate_Id__c': this.affiliateId, 'Shcool_Type__c': this.schooltype,
            'Grade_From__c': this.gradefrom, 'Grade_To__c': this.gradeto, 'Affiliate_to_Board__c': this.affiliatetoboard,
            'Language_of_Instruction__c': this.language, 'Status_of_School_Affiliation__c': this.statusaffiliation, 'Year_of_School_Establishment__c': this.yse,
            'School_Affiliation_Granted_On__c': this.sag, 'School_Registered_With__c': this.schoolregisteredwith, 'Total_Number_of_Students__c': this.noofstudents, 'Board_Type__c': this.boardtype,
            'Medium__c': this.medium, 'Admission_Open__c': this.admissionopen, 'Landline_Number__c': this.landlinenumber, 'Website': this.website,
            'Promoted__c': this.promoted, 'Is_Verified__c': this.isverified, 'Description': this.describeschool, 'School_Facilities__c': this.allvalues.join(';')
        }

        console.log('acc==>', acc)
        submitScoreAction({
            accountRec: acc,
            file: encodeURIComponent(this.fileContents),
            fileName: this.fileName

        })
            .then(result => {
                console.log('file-======>' + this.file)
                console.log('obj-======>' + this.schoolName)
                if (this.recodId == null) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Profile Created Successfully',
                            variant: 'success',

                        }),
                    );
                }
                this.isModalOpen = false;
                window.location.reload();

            })

    }
}