import { LightningElement,wire,track,api } from 'lwc';
import getTeacherNames from '@salesforce/apex/admissionListViewController.getTeacherNames';
import updateRecords from '@salesforce/apex/admissionListViewController.updateRecords';

import { refreshApex } from '@salesforce/apex';
import Id from '@salesforce/schema/Account.Id';

const columns = [
    { label: 'Staff Name', fieldName: 'Staff_Name__c',sortable: "true",type:'lookup'},
    { label: 'Checked In', fieldName: 'Check_In__c'},
    { label: 'Checked Out', fieldName: 'Check_Out__c'},
    { label: 'Status',fieldName: 'Status__c', option:'options'},
    { label: 'Date', fieldName: 'Date__c'},

     
    {type: 'button', typeAttributes: {
        label:'Check_In',
        value:'Check In',
        variant:'success',
        disabled:false
        
    }},
    {type: 'button', typeAttributes: {
        label:'Check_Out',
        value:'Check Out',
        variant:"brand", 
        
    }},
    {type: 'button', typeAttributes: {
        label:'Cancel_Check',
        value:'Cancel Check',
        variant:"destructive",  
        
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
//    @track disable=false;

    
   //return this.dataListcopy.reduce((previousValue,currentValue) => Number(previousValue) + Number(currentValue.Total_No_of_Seats__c),0);

   
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

   get present(){

    


    // if(this.checkInData.length>0){
    //     return this.checkInData.reduce((acc,cur)=>{
    //         console.log('Statusssss'+Status__c)
    //     let status=cur.Status__c=='Present';
    //     if(acc[status]){
    //         acc[status]++;
    //     }
    //     else{
    //         acc[status]=1;
    //     }
    //     },{})
    // }
}
getDate(){
    let date=new Date();
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    let fullDate = `${day}/${month}/${year}`;
    return fullDate;
}

   @wire(getTeacherNames,{keySearch: '$searchData'})
   fetchRecords(result){
        this.dataRecords=result;
        let date=this.getDate();
        //console.log('Dataaaaaaaa'+JSON.stringify(this.dataRecords));
            if(result.data){
                 let obj=JSON.parse(JSON.stringify(result.data))        
                 for(let x of obj){
                    x['Staff_Name__c'] = x.Teacher_Name__c
                    x['Status__c']= '--None--';
                    x['Date__c']=date;
                 }
                 this.checkInData=obj;
                 //console.log('tfcvtfd'+JSON.stringify(this.checkInData))
                }
            if(result.error){
                console.log(result.error)
            }
   }

//    @wire(saveRecords)
//    assignValues(result){
//     this.dataRecords=result;
//     console.log('Alllll'+JSON.stringify(this.dataRecords))   
//    }    
   
   
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
            if(item.Teacher_Name__c == name){
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
        var timer;
        
        if(event.detail.action.label==='Check_In'){
            
            let row = event.detail.row;
            let data=JSON.parse(JSON.stringify(this.checkInData));

            let time= this.getTimes();
            
            let index;
          
            for(let x = 0; x <= data.length; x++){
                if(x == this.btnIndex(row.Teacher_Name__c)){
                    
                    if(data[x].Status__c='--None--'){
                        data[x].Check_In__c = time;
                        //data[x].Date__c = date;
            
                        data[x].Status__c='Present';
                        index=x;
                    } 
                }

            }
            console.log('Data',data[index])
            this.checkInData=data; 
            let value=JSON.stringify(data[index])
             
            updateRecords({attendance:value})
            .then((result) => {
                console.log('Resulttt',result)
            })








            
            timer= setTimeout(() => {
                    console.log('Intervallll',index)
                    if(this.checkInData[index].Status__c=='Present'  ){
                        this.checkInData[index].Status__c = 'Swipe Out Missing';
                    
                        this.refreshData(); 
                     }  
                }, 5000);
                
        //         this.interval = setInterval(() => {
        //             data[x].Status__c = 'Absent';
        //         }, 1000);

           
        }

        if(event.detail.action.label==='Check_Out' ){

           let row = event.detail.row;
            let data=JSON.parse(JSON.stringify(this.checkInData));
            let time=this.getTimes();
            let date=this.getDate();
            for(let x = 0; x <= data.length; x++){
                if(x == this.btnIndex(row.Teacher_Name__c) ){
                    
                    if((data[x].Status__c =='--None--')){
                        data[x].Status__c = 'Swipe In Missing';
                    }
                    else if((data[x].Status__c =='Present')){
                        data[x].Check_Out__c = time;
                        clearTimeout(timer);
                    }
                    
                }
           }
            this.checkInData=data;
        }

        if(event.detail.action.label==='Cancel_Check'){
            let data=JSON.parse(JSON.stringify(this.checkInData));
            let row = event.detail.row;
            for(let x = 0; x <= data.length; x++){
                if(x == this.btnIndex(row.Teacher_Name__c)){
                    data[x].Check_In__c = '';
                    data[x].Check_Out__c = '';
                    //data[x].Date__c = '';
                    data[x].Status__c = '--None--';
                }
           }
            this.checkInData=data;
        }
    }

    rowSelectionHandler(event){
        this.selectedData=event.detail.selectedRows;
    }

showData(){
    console.log('Checkinggg')
    console.log('AllData'+JSON.stringify(this.checkInData))
    this.checkInData;
    location.reload();
}

getSelectedRec() {

    var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
    let len =selectedRecords.length;
    if(selectedRecords.length > 0){
        console.log('selectedRecords are '+JSON.stringify(selectedRecords));
        selectedRecords.forEach(currentItem => {
            console.log('Selecteeeed')
            this.arr.push(currentItem.Id);
            console.log('Selecteeeed134')
        }); 
    }  
    return len;
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