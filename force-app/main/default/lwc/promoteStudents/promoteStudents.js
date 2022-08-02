import { LightningElement,wire,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import fetchAcademicYear from '@salesforce/apex/createAdmission.fetchAcademicYear';
import From_Academic_Year_Month from '@salesforce/schema/Admission__c.Academic_Year__r.From_Month__c';
import From_Academic_Year from '@salesforce/schema/Admission__c.Academic_Year__r.From_Year__c';
import To_Academic_Year_Month from '@salesforce/schema/Admission__c.Academic_Year__r.To_Month__c';
import To_Academic_Year from '@salesforce/schema/Admission__c.Academic_Year__r.To_Year__c';
import fetchClassName from "@salesforce/apex/createAdmission.fetchClassName";
import fetchSectionName from "@salesforce/apex/promoteStudents.fetchSectionName";
import fetchStudents from "@salesforce/apex/promoteStudents.fetchStudents";
import promote from "@salesforce/apex/promoteStudents.promote";
import { cancelRecord } from 'lightning/uiRecordApi';

const columns = [
    { label: 'STUDENT NAME', fieldName: 'Name'},
    { label: 'FROM CLASS', fieldName: 'FROM_CLASS' },
    { label: 'FROM SECTION', fieldName: 'FROM_SECTION' },
    { label: 'CURRENT ACADEMIC YEAR', fieldName: 'CURRENT_ACADEMIC_YEAR'},
];

export default class PromoteStudents extends NavigationMixin(LightningElement) {
    columns=columns;
    @track data;

    @track fromYear;
    @track toYear;
    @track AYoptions;
    // @track getClass;
    @track fromClass;
    @track toClass;
    @track ClassOptions;
    @track fromSection;
    @track toSection;
    @track FromSectionOptions;
    @track ToSectionOptions;

    showSuccess(promotestudent) {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: `students should be promoted successfully`,
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
    showError(msg) {
        const evt = new ShowToastEvent({
            title: 'Error Alert',
            message: msg,
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

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
            console.log('Dataaaaaaaaaaaaaaaaaaa'+data)
            console.log('academiccc'+this.academicYear)
            let obj=[];
            for( let x of data){
                obj.push({'label': x.From_Year__c +'/'+ this.academicYear(x.From_Month__c) + '-' + x.To_Year__c+'/'+ this.academicYear(x.To_Month__c), 
                // 'value': x.From_Year__c +'/'+ this.academicYear(x.From_Month__c) + '-' + x.To_Year__c+'/'+ this.academicYear(x.To_Month__c)
            'value': x.Id})
            }
            this.AYoptions = obj;
            // this.options = data.map(item=>{
            //     return 
            //          {label: item.From_Year__c, value: item.From_Year__c};
            // })
            console.log('Optionssss->' +JSON.stringify(this.AYoptions));

        } 
        else{
            console.log(error);
        }
    }

    // @wire(fetchClassName,{AyYear:this.fromYear}) 
    // wiredFetchClass({error, data}){
    //     if(data){
    //         console.log(data)
    //         let obj=[];
    //         for( let x of data){
    //             obj.push({'label': x.Name, 'value': x.Id })
    //         }
    //         this.ClassOptions = obj;
    //         console.log('ClassName' +JSON.stringify(this.ClassOptions));

    //     } 
    //     else{
    //         console.log(error);
    //     }
    // }
    
        handleFromAY(event){
        this.fromYear=event.detail.value;
            console.log(this.fromYear);
            fetchClassName({AcYear:this.fromYear})
            .then((data)=>{
                let obj=[];
            for( let x of data){
                obj.push({'label': x.Name, 'value': x.Id })
            }
            this.ClassOptions = obj;
            })
             .catch((error)=>{
                console.error(error)
             })
             }


    handleFromClass(event){
        this.fromClass=event.detail.value;
        console.log('stringify'+JSON.stringify(event.detail.value));     
        
        fetchSectionName({recId: this.fromClass})
        .then(res =>{console.log('res'+res);
                let obj=[];
                for( let x of res){
                    obj.push({'label': x.Name, 'value': x.Id })
                }
                this.FromSectionOptions = obj;
                console.log('SectionOptions' +JSON.stringify(this.FromSectionOptions));
        })
        .catch(err =>console.log(err));

}

    handleFromSection(event){
    this.fromSection=event.detail.value;
    console.log(this.fromSection);

    fetchStudents({classId: this.fromClass, sectionId:this.fromSection, acYear:this.fromYear})
    .then(result =>{console.log(result);
        this.data = result.map(item => {
            console.log(item)
            return {
                Id: item.Id,
                Name: item.Name,
                FROM_CLASS: item.Class_Name__r.Name,
                FROM_SECTION: item.Class_Section__r.Name,
                CURRENT_ACADEMIC_YEAR: item.Academic_Year__r.From_Year__c +'/'+ this.academicYear(item.Academic_Year__r.From_Month__c) + '-' + item.Academic_Year__r.To_Year__c+'/'+ this.academicYear(item.Academic_Year__r.To_Month__c), 
            }
        });
    })

}   
    handleToAY(event){
    this.toYear=event.detail.value;
            console.log(this.toYear)
              }

     handleToClass(event){
    this.toClass=event.detail.value;
    console.log('stringify'+JSON.stringify(event.detail.value));     
    
    fetchSectionName({recId: this.toClass})
    .then(res =>{console.log('res'+res);
            let obj=[];
            for( let x of res){
                obj.push({'label': x.Name, 'value': x.Id })
            }
            this.ToSectionOptions = obj;
            console.log('SectionOptions' +JSON.stringify(this.ToSectionOptions));
    })
    .catch(err =>console.log(err));

}

handleToSection(event){
    this.toSection=event.detail.value;
    console.log(this.toSection);
}   
   

navigateToTabPage() {
    // Navigate to a specific CustomTab.
    this[NavigationMixin.Navigate]({
        type: 'standard__navItemPage',
        attributes: {
            apiName: 'Home_Page'
        }
    });
}

@track selectedStudents = [];
@track idList=[];

handleSelectedRows(event){
    this.selectedStudents = event.detail.selectedRows;
    console.log('selectedStudents'+JSON.stringify(this.selectedStudents));
    this.idList = this.selectedStudents.map(row => { return row.Id });
    console.log('idList'+this.idList);
    }

promoteStudentss(){
    if(this.fromClass !=null && this.fromSection !=null && this.fromYear !=null && this.toClass !=null&& this.toSection !=null && this.toYear !=null) {

    if(this.idList.length==0){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error While promoting student',
                message: 'Please select student to promote',
                variant: 'error',
            }),
        )}
      else {
       promote({idToUpdate:this.idList, toClassId:this.toClass, toSectionId:this.toSection, toAcYear:this.toYear})
       .then(res => {console.log("success");

       const toastEvent = new ShowToastEvent({
        title:'Promoted!',
        message:'Selected students has been promoted successfully',
        variant: 'success',
        mode: 'dismissable'
    });
    this.dispatchEvent(toastEvent); 


    location.reload();
})
       .catch(err => console.log(err))
}
    }
    else {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Cannot promote students',
                message: 'Please fill the details',
                variant: 'error',
            })
        )
    }
}

}