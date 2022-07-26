import { LightningElement, track, wire } from 'lwc';
import addschool from '@salesforce/apex/addschool.addschool';



import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import department_object from '@salesforce/schema/Department__c';

import school_type from '@salesforce/schema/School_Type__c';

import School_name from '@salesforce/schema/School_Type__c.DepartmentClass__c'
import s_name from '@salesforce/schema/School_Type__c.Name'
import save from '@salesforce/apex/addschool.save';

export default class AddSchoolType extends LightningElement {
    @track isAddSchool = false;
    @track options =[];
    

    addSchoolModal(){
        // to open modal set isModalOpen tarck value as true
        this.isAddSchool = true;
    }
    closeSchoolModal() {
        // to close modal set isModalOpen tarck value as false
        this.isAddSchool = false;
    }

    value = ['option1'];
    
    
    

    get selectedValues() {
        return this.value.join(',');
    }

    handleChange(e) {
        this.value = e.detail.value;
        this.listClass = e.detail.value
        // this.departmentId = e.detail.value;
        // this.listClass = e.detail.value.split('[')[1].split(',').map(item=>{
        //  if (item !=']'){
        //   return item;
        //    }        }
        //    );
        // this.listClass = e.detail.value;
        console.log('chech',this.value);
        console.log('chase',this.listClass);
        // console.log('*id'+this.departmentId);
    }

    
    // @wire(addschool)
    // wiredaddschol({ data, error }) {
    //     console.log('enemy'+JSON.stringify(data))
    //     if (data) {
    //          console.log( 'this'+ JSON.stringify(data) );
    //         // this.options = data;
    //         // console.log( 'this1'+ JSON.stringify(data) );
    //         // this.error = undefined;
    //        let obj=[];
    //        for(let x of data){
            
    //         console.log('implementation'+JSON.stringify(x));
    //         if(x.Classes__r== undefined){
    //             continue;
    //         }
    //         obj.push({'label':`${x.Name} [${x.Classes__r.map(el=>el.Name)}]`,'value':x.Id});
    //        }
    //        this.options = obj;
    //        console.log('how'+this.options);
    //     } else if (error) {
    //         console.log('this2'+ JSON.stringify(error) );
    //         this.error = error;
    //         console.log( 'this3'+ JSON.stringify(data) );
    //         this.options = undefined;
    //     }
    // }
    @wire(addschool)
    wiredaddSchool({ data, error }) {
        console.log('tttttttdata=========>'+JSON.stringify(data));
        if (data) {
            console.log('ttttttttttt=========>'+JSON.stringify(data))
            console.log( 'this'+ JSON.stringify(data) );
            this.options = data.map(el=>{
                return{
                    label : el.Name, value : el.Name
                }
            });
            console.log( 'this1'+ JSON.stringify(data) );
            this.error = undefined;
        } 
        // else if (error) {
        //     console.log('this2', error );
        //     this.error = error;
        //     console.log( 'this3'+ JSON.stringify(data) );
        //     this.options = undefined;
        // }
    }
    @track departmentId;
    @track listClass;

    createAccountdsf(event) {
        console.log('tell me'+JSON.stringify(this.listClass));
        save({listcls: this.listClass[0]})
            .then(account => {
                console.log('listclass=====>'+JSON.stringify(account))
                //this.result = account;
               // this.RecordId = Record.id;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Department Saved',
                        variant: 'success',
                    }),
                    
                );
                location.reload();
                console.log('testing');
                // this[NavigationMixin.Navigate]({
                //     type: 'standard__objectPage',
                //     attributes: {
                //         objectApiName: 'Department__c',
                //         actionName: 'list'
                //     },
                // });
                console.log('testing2');
            })
            .catch(error => {
                console.log('error=====>'+JSON.stringify(error));

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: 'record already exist. please enter new name',
                        variant: 'error',
                    }),
                );
            });
            
           
             
    }
}