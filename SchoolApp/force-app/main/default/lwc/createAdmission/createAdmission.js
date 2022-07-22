import { LightningElement, api, wire,track } from "lwc";
import { getRecord, updateRecord, getFieldValue } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import fetchAcademicYear from '@salesforce/apex/createAdmission.fetchAcademicYear';
import fetchClassName from "@salesforce/apex/createAdmission.fetchClassName";

import From_Academic_Year_Month from '@salesforce/schema/Admission__c.Academic_Year__r.From_Month__c';
import From_Academic_Year from '@salesforce/schema/Admission__c.Academic_Year__r.From_Year__c';
import To_Academic_Year_Month from '@salesforce/schema/Admission__c.Academic_Year__r.To_Month__c';
import To_Academic_Year from '@salesforce/schema/Admission__c.Academic_Year__r.To_Year__c';


import Admission_Close_Date from '@salesforce/schema/Admission__c.Admission_Close_Date__c';
import Assign_Classes from '@salesforce/schema/Admission__c.Assign_Classes__r.Name';
import Assign_Classes_Id from '@salesforce/schema/Admission__c.Assign_Classes__c';
import Name from '@salesforce/schema/Admission__c.Assign_Classes__r.Name';

import No_of_Seats_Available from '@salesforce/schema/Admission__c.No_of_Seats_Available__c';
import Starting_Fee from '@salesforce/schema/Admission__c.Starting_Fee__c';
import Minimum_Age_limit from '@salesforce/schema/Admission__c.Minimum_Age_limit__c';
import Required_Proofs from '@salesforce/schema/Admission__c.Required_Proofs__c';
import Admission_Status from '@salesforce/schema/Admission__c.Admission_Status__c';
import Max_No_of_Applications from '@salesforce/schema/Admission__c.Max_No_of_Applications__c';
import no_of_Seats from '@salesforce/schema/Admission__c.Total_No_of_Seats__c';
import Seats_Filled from '@salesforce/schema/Admission__c.Seats_Filled__c';
import Admission_Available_on_Website from '@salesforce/schema/Admission__c.Admission_Available_on_Website__c';
import Maximum_Age_limit from '@salesforce/schema/Admission__c.Maximum_Age_limit__c';

export default class CreateAdmission extends LightningElement {
    @track openPopup = true;

    @track isLoading = false;

        popup() {
            this.openPopup = true;
        }
        closePopup() {
            this.openPopup = false;
        } 

    @track SearchOptions=[];
    @track getClass=[];
    @track getClasses;
    @track selectedName;
    @track selectedProofs=[];
    @track admission;
    
    @track rProof=[];

    @api recordId;
    disabled;
    @track assignClassId;
    @track assignClasses;

    @wire(getRecord, { recordId: "$recordId", fields: 
    [Assign_Classes_Id,From_Academic_Year_Month,From_Academic_Year,Name,To_Academic_Year_Month,To_Academic_Year, Admission_Close_Date, Assign_Classes,No_of_Seats_Available,Starting_Fee,
        Minimum_Age_limit,Required_Proofs,Admission_Status,Max_No_of_Applications,no_of_Seats,
        Seats_Filled,Admission_Available_on_Website,Maximum_Age_limit
    ]}
)
    admission;


    
    // this.selectedProofs.push(...['Address Proof', 'Identity Proof', 'TC Certificate',
    //     'Residence Proof','Birth Certificate','Transfer Certificate','Parent Aadhar Card',
    //     'Child Aadhar Card','Medical Reports','Photograph - Child','Photograph - Parents/Guardian',
    //     'Marksheet Report Card (if applicable)','Migration Certificate if any','Government Proof'
    // ]);


    academicYear(monthName){
       
        switch(monthName){
            case "Jan": return '01';
            
            case "Feb": return '02';
          
            case "Mar": return'03';
            
            case "Apr": return'04';
            
            case "May": return'05';
            
            case "June": return '06';
          
            case "July": return '07';

            case "Aug": return '08';
           
            case "Sep": return '09';
          
            case "Oct": return '10';

            case "Nov": return '11';
            
            case "Dec": return '12';
            
            default: console.log("Invalid Data.");

            
        }
    }
    

    @wire(fetchAcademicYear) 
    wiredFetchAY({error, data}){
        if(data){
            
            console.log('Numbbbber'+data)
            console.log('academicccSSSS'+this.academicYear)

            let obj=[];
            for( let x of data){
                obj.push({'label': x.From_Year__c +'/'+x.From_Month__c + '-' + x.To_Year__c+'/'+ x.To_Month__c, 
                'value': x.From_Year__c +'/'+ x.From_Month__c + '-' + x.To_Year__c+'/'+ x.To_Month__c})
            }
            this.searchOptions = obj
            // this.options = data.map(item=>{
            //     return 
            //          {label: item.From_Year__c, value: item.From_Year__c};
            // })
            console.log('Optionssss->' +JSON.stringify(this.searchOptions));

        } 
        else{
            console.log(error);
        }
    }
    @wire(fetchClassName) 
    wiredFetchAY({error, data}){
        if(data){
            console.log(data)
            let obj=[];
            for( let x of data){
                obj.push({'label': x.Name, 'value': x.Name })
            }
            this.getClass = obj
            console.log('ClassName' +JSON.stringify(this.getClass));

        } 
        else{
            console.log(error);
        }
    }

    options = [
        { "label": "Address Proof", "value": "Address Proof" },
        { "label": "Identity Proof", "value": "Identity Proof" },
        { "label": "TC Certificate", "value": "TC Certificate" },
        { "label": "Residence Proof", "value": "Residence Proof" },
        { "label": "Birth Certificate", "value": "Birth Certificate" },
        { "label": "Transfer Certificate", "value": "Transfer Certificate" },
        { "label": "Parent Aadhar Card", "value": "Parent Aadhar Card" },
        { "label": "Child Aadhar Card", "value": "Child Aadhar Card" },
        { "label": "Medical Reports	", "value": "Medical Reports" },
        { "label": "Photograph - Child", "value": "Photograph - Child" },
        { "label": "Photograph - Parents/Guardian", "value": "Photograph - Parents/Guardian	" },
        { "label": "Marksheet Report Card (if applicable)", "value": "Marksheet Report Card (if applicable)" },
        { "label": "Migration Certificate if any", "value": "Migration Certificate if any" },
        { "label": "Government Proof", "value": "Government Proof" }
    ];

    get selected() {
        return this._selected.length ? this._selected : 'none';
    }


    statusOptions = [
        { "label": "Open", "value": "Open" },
        { "label": "Closed", "value": "Closed" }
    ];

    handleAccountSelection(event){
        this.searchOptions=event.detail;
        console.log(this.searchOptions);  
        }

    handleSelectValue(event){
         console.log('Eventtttttttttttttttttt--->'+JSON.stringify(event.detail))
          this.assignClassId=event.detail
        //   this.assignClasses=event.detail
          console.log('Classssss'+this.assignClassId)
        }
        
    
    get Academic_Year() {

        return getFieldValue(this.admission.data, From_Academic_Year) +'/'+this.academicYear(getFieldValue(this.admission.data, From_Academic_Year_Month))+
        ' - '+getFieldValue(this.admission.data, To_Academic_Year)+'/'+this.academicYear(getFieldValue(this.admission.data, To_Academic_Year_Month));
    }
    get Admission_Close_Date() {
        return getFieldValue(this.admission.data, Admission_Close_Date);
    }


    get Assign_Classes() {
        this.assignClassId= getFieldValue(this.admission.data, Assign_Classes_Id);
        this.assignClasses= getFieldValue(this.admission.data, Assign_Classes);
        console.log('asssssignclaaaaassssId->'+this.assignClassId)
        console.log('asssssignclaaaaassssName->'+this.assignClasses)
        return (getFieldValue(this.admission.data, Name));
        
    }
    
    
    get No_of_Seats_Available() {
        return getFieldValue(this.admission.data, No_of_Seats_Available);
    }
    get Starting_Fee() {
        return getFieldValue(this.admission.data, Starting_Fee);
    }
    get Minimum_Age_limit() {
        return getFieldValue(this.admission.data, Minimum_Age_limit);
    }
    get Required_Proofs() {
        this.rProof = getFieldValue(this.admission.data, Required_Proofs) && getFieldValue(this.admission.data, Required_Proofs).split(';');
        return this.rProof && [...this.rProof];
    }
    get Admission_Status() {
        return getFieldValue(this.admission.data, Admission_Status);
    }
    get Max_No_of_Applications() {
        return getFieldValue(this.admission.data, Max_No_of_Applications);
    }
    get no_of_Seats() {
        return getFieldValue(this.admission.data, no_of_Seats);
    }
    get Seats_Filled() {
        return getFieldValue(this.admission.data, Seats_Filled);
    }
    get Admission_Available_on_Website() {
        return getFieldValue(this.admission.data, Admission_Available_on_Website);
    }
    get Maximum_Age_limit() {
        return getFieldValue(this.admission.data, Maximum_Age_limit);
    }

    handleChange(event) {
        if (!event.target.value) {
            event.target.reportValidity();
            this.disabled = true;
        } else {
            this.disabled = false;
        }

        // if(event.detail.data-field == 'Required_Proofs'){
            
    }

    handleChangeProof(event){
        this.selectedProofs = event.detail.value;
    }

    // handleChangeChecked(event){
    //     this.Admission_Available_on_Website=event.target.checked;
    // }

    isInputValid() {
        console.log('Line 1')
        let isValid = true;
        console.log('Line 2')

        let inputFields = this.template.querySelectorAll('.validate');
        console.log('Line 3')

        inputFields.forEach(inputField => {
            console.log('Line 4')

            if(!inputField.checkValidity()) {
                console.log('Line 5')

                inputField.reportValidity();
                isValid = false;
            }
            
            //this.result[inputField.name] = inputField.value;
            // console.log()
        });
        console.log('Valid->'+isValid)
        return isValid;
    }

    connectedCallback(){
        console.log('ConnectedCallBack')
    }

    updateAdmission(){
        this.isLoading = true;
       
        console.log('Checkk')
        const fields = {};
        console.log('Checkk123')

            fields.Id = this.admission.data.id;
            console.log('Iddddd->'+fields.Id)
            // fields[Academic_Year.fieldApiName] = this.template.querySelector(
            //     "[data-field='Academic_Year']"
            // ).value;
            // console.log('Checkk123----->>'+fields[Academic_Year.fieldApiName])

            fields[Admission_Close_Date.fieldApiName] = this.template.querySelector(
                "[data-field='Admission_Close_Date']"
            ).value;
        
            fields[Assign_Classes_Id.fieldApiName] = this.assignClassId;
            console.log('CloseDate1')
            // fields[No_of_Seats_Available.fieldApiName] = this.template.querySelector(
            //     "[data-field='No_of_Seats_Available']"
            // ).value;
            fields[Starting_Fee.fieldApiName] = this.template.querySelector(
                "[data-field='Starting_Fee']"
            ).value;
            fields[Minimum_Age_limit.fieldApiName] = this.template.querySelector(
                "[data-field='Minimum_Age_limit']"
            ).value;
            fields[Required_Proofs.fieldApiName] = this.template.querySelector(
                "[data-field='Required_Proofs']"
            ).value.join(';');
            fields[Admission_Status.fieldApiName] = this.template.querySelector(
                "[data-field='Admission_Status']"
            ).value;
            fields[Max_No_of_Applications.fieldApiName] = this.template.querySelector(
                "[data-field='Max_No_of_Applications']"
            ).value;
            fields[no_of_Seats.fieldApiName] = this.template.querySelector(
                "[data-field='no_of_Seats']"
            ).value;
            fields[Seats_Filled.fieldApiName] = this.template.querySelector(
                "[data-field='Seats_Filled']"
            ).value;
            fields[Admission_Available_on_Website.fieldApiName] = this.template.querySelector(
                "[data-field='Admission_Available_on_Website']"
            ).checked;
            
            fields[Maximum_Age_limit.fieldApiName] = this.template.querySelector(
                "[data-field='Maximum_Age_limit']"
            ).value;

                console.log('hellllllo ')
            const recordInput = { fields };
                console.log('b4 if------>'+JSON.stringify(recordInput))
            if(this.isInputValid()) {
                console.log('If part')
            updateRecord(recordInput)
                .then((result) => {
                    
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Success",
                            message: "Admission Record Updated Successfully",
                            variant: "success"
                            
                        })
                    );
                    this.isLoading = false;
                   setTimeout(()=>{
                    location.reload();
                   },1500) 
                })
                .catch((error) => {
                    console.log(JSON.stringify(error))
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Error while updating a record",
                            message: "Please enter all the required fields",
                            variant: "error"
                        })
                    );
                });
            }
            else {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Error while updating a record",
                        message: "Please enter all the required fields",
                        variant: "error"
                    })
                );
            }
        }

        closePopup(){
                    this.dispatchEvent(new CustomEvent('close',{
                        detail:false
                    }))
                }
    
            
    }