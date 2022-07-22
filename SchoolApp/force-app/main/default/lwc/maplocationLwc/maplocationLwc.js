import { LightningElement,api,wire,track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const fieldsArray = [
    "Account.Name",
    "Account.Country__c",
    "Account.City_Town__c",
    "Account.State__c",
    "Account.Street__c",
    "Account.PinCode__c"
];

export default class MaplocationLwc extends LightningElement {
    @api recordId;
    @track mapMarkers = [];

    accountName;
    country;
    citytown;
    state;
    street;
    pincode;

    @wire(getRecord,{recordId: "$recordId", fields: fieldsArray})
    wireRecord({error, data}){
        if(data){
             JSON.stringify('data from account by wire::',data)  
             this.country = data.fields.Country__c.value;
             this.citytown = data.fields.City_Town__c.value;
             this.state = data.fields.State__c.value;
             this.street = data.fields.Street__c.value;
             this.pincode = data.fields.PinCode__c.value;
             this.accountName = data.fields.Name.value;
             const marker = {
                location : {
                    Street: this.street,
                    City : this.citytown ,
                    State: this.state ,
                    PostalCode : this.pincode ,
                    Country : this.country 
                },
                title: this.accountName ? this.accountName : ""
             };

             this.mapMarkers = [marker];
             this.error = undefined;             
            }else if(error){
                this.mapMarkers = undefined;
                this.error = error;
            }

    }

}