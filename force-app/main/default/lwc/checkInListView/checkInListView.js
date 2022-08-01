import { LightningElement,wire,track,api } from 'lwc';
import getTeacherNames from '@salesforce/apex/admissionListViewController.getTeacherNames';
import updateRecords from '@salesforce/apex/admissionListViewController.updateRecords';
import delFields from '@salesforce/apex/admissionListViewController.deleteFieldValues';

import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Staff Name', fieldName: 'Staff_Name__c',type:'lookup'},
    { label: 'Checked In', fieldName: 'Check_In__c'},
    { label: 'Checked Out', fieldName: 'Check_Out__c'},
    { label: 'Status',fieldName: 'Status__c', option:'options'},
    { label: 'Date', fieldName: 'Date__c'},

     
    {type: 'button', typeAttributes: {
        label:'Check_In',
        value:'Check In',
        variant:'success',
        disabled: { fieldName: 'disabledButton1' }
        
    }},
    {type: 'button', typeAttributes: {
        label:'Check_Out',
        value:'Check Out',
        variant:"brand", 
        disabled: { fieldName: 'disabledButton2' }
    }},

    {type: 'button', typeAttributes: {
        label:'Cancel_Check',
        value:'Cancel Check', 
        variant:"destructive",  
        disabled: { fieldName: 'disabledButton3' }
    }}

];

export default class CheckInListView extends LightningElement {
    @track columns = columns;
   searchData='';
   @track checkInData=[];
   @track sortBy;
   @track sortDirection;
   recordId=[];
   dataRecords;
   @track attendance;
   @track deleteFields;
    
   
   absent=5;

   get options(){
    return [
        {label:'--None--', value:'--None--'},
        { label: 'Present', value: 'Present' },
        { label: 'Swipe In Missing', value: 'Swipe In Missing' },
        { label: 'Swipe Out Missing', value: 'Swipe Out Missing' },
        { label: 'Absent', value: 'Absent' }
    ];
   }

   present=9;

   @wire(getTeacherNames,{keySearch: '$searchData'})
   fetchRecords(result){
        this.dataRecords=result;
            if(result.data){
                 let obj=JSON.parse(JSON.stringify(result.data))        
                 for(let x of obj){
            
                    x['Staff_Name__c'] = x.Staff_Name__r.Teacher_Name__c;
                    x['Status__c']= x.Status__c;
                    x['Date__c']= x.Date__c;
                    x['Check_In__c'] = x.Check_In__c;
                    x['Check_Out__c'] = x.Check_Out__c;
                    if(x['Check_In__c']!=null && x['Check_Out__c']!=null ){
                        x.disabledButton1=true;
                        x.disabledButton2=true;
                        x.disabledButton3=true;
                    }
                    if(x['Check_In__c']!=null && x['Check_Out__c']==null ){
                        x.disabledButton1=true;
                    }
                 }
                 this.checkInData=obj;
                }
            if(result.error){
                console.log(result.error)
            }
   }   
   
   getsearchRecords(event) {
    this.searchData = event.detail.value;
    this.getTimes();
    this.getDate();
    }

    getTimes(){
        var today = new Date().toLocaleTimeString( { timeZone: 'UTC' });
        //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        console.log(today)
        return today;
    }
    

    btnIndex(name){
        let i;
        let data = JSON.parse(JSON.stringify(this.checkInData));
        data.map((item, index)=>{
            if(item.Staff_Name__r.Teacher_Name__c == name){
                console.log('Nameeeeeee',item.Staff_Name__r.Teacher_Name__c)
                i = index;  
            } 
        })
        return i;
    }

    refreshData() {
        console.log('Refresh',this.checkInData)
        return refreshApex(this.checkInData);
    }

    handleRowAction(event){
        
        if(event.detail.action.label==='Check_In'){
            location.reload();
            let row = event.detail.row;
            let data=JSON.parse(JSON.stringify(this.checkInData));

            let time= this.getTimes();
            
            let index;
          
            for(let x = 0; x <= data.length; x++){
                if(x == this.btnIndex(row.Staff_Name__r.Teacher_Name__c)){
                    console.log('Insedxx',x)

                        data[x].Check_In__c = time;
                        data[x].Status__c='Present';
                        index=x;
                        if(data[x].Check_In__c!=null){
                            data[x].disabledButton1=true;
                        }
                  
                }

            }
            console.log('Data',data[index])
            this.checkInData=data; 
            console.log('Alllllllllllllllll',JSON.stringify(this.checkInData));
            let value={...data[index]};
            value['Staff_Name__c'] = value.Staff_Name__r.Id;
            console.log('alll Result',value);
            
             
             updateRecords({attendance:JSON.stringify(value)})
            .then((result) => {
                console.log('Resulttt',result)
            })
        }

        if(event.detail.action.label==='Check_Out' ){
            
                location.reload();    
            
           let row = event.detail.row;
            let data=JSON.parse(JSON.stringify(this.checkInData));
            let time=this.getTimes();
            let index;
            for(let x = 0; x <= data.length; x++){
                if(x == this.btnIndex(row.Staff_Name__r.Teacher_Name__c) ){
                       
                        
                    
                    if((data[x].Status__c =='Present')){
                        data[x].Check_Out__c = time;
                        index=x;  
                    }
                    else{
                        data[x].Status__c = 'Swipe In Missing';  
                        index=x; 
                    }
                    if(data[x].Check_Out__c!=null){
                        data[x].disabledButton2=true;
                        
                    }   
                }
           }
            this.checkInData=data;

           let value = {...data[index]};
           value['Staff_Name__c'] = value.Staff_Name__r.Id;
            console.log('alll Result12345',value);
            
             
             updateRecords({attendance:JSON.stringify(value)})
            .then((result) => {
                console.log('Resulttt',result)
            })


        }

        if(event.detail.action.label==='Cancel_Check'){
            if(Check_In__c=='' || Check_Out__c==''){
                console.log('No reload')
            }
            else{
                location.reload();    
            }
            let index;
            let data=JSON.parse(JSON.stringify(this.checkInData));
            let row = event.detail.row;
            for(let x = 0; x <= data.length; x++){
                if(x == this.btnIndex(row.Staff_Name__r.Teacher_Name__c)){
                    data[x].Check_In__c = '';
                    data[x].Check_Out__c = '';
                    data[x].Status__c='';
                    index=x;
                }
           }
            this.checkInData=data;

            let value = {...data[index]};
           value['Staff_Name__c'] = value.Staff_Name__r.Id;
            console.log('alll Result1234566',value);
             
            delFields({deleteFields:JSON.stringify(value)})
            .then((result) => {
                console.log('Resulttt',result)
            })
            .catch(error => {
                     console.log('errorrrrr' + JSON.stringify(error));
                 });
         }
    }

showData(){
    console.log('Checkinggg')
    console.log('AllData'+JSON.stringify(this.checkInData))
    this.checkInData;
    location.reload();
}

doSorting(event) {
    this.sortBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    this.sortData(this.sortBy, this.sortDirection);
}

sortData(fieldname, direction) {
    let parseData = JSON.parse(JSON.stringify(this.checkInData));
    // Return the value stored in the field
    let keyValue = (a) => {
        return a[fieldname];
    };
    // cheking reverse direction
    let isReverse = direction === 'asc' ? 1: -1;
    // sorting data
    parseData.sort((x, y) => {
        x = keyValue(x) ? keyValue(x) : ''; // handling null values
        y = keyValue(y) ? keyValue(y) : '';
        // sorting values based on direction
        return isReverse * ((x > y) - (y > x));
    });
    this.checkInData = parseData;
}

   connectedCallback(){
    console.log('Runnnnnn');
   }

}