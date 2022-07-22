import { LightningElement, api, track, wire } from 'lwc';
import badgeCounter from '@salesforce/apex/BadgeController.badgeCounter';
import { NavigationMixin } from 'lightning/navigation';

export default class DefaultCard extends NavigationMixin(LightningElement) {
    @track counter;
    @api objApiName;
    @api header;
    @api step;
    @api headerLine;
    @api exampleTag;
  //  @api counter;

    connectedCallback(){
        console.log("Card Page Loaded");
    }


    @wire(badgeCounter, { objApiName : '$objApiName' }) 
    wiredobjList({ error, data }) {
        if (data) {
            this.error = undefined;
            this.counter = data.length;
        } else if (error) {
            this.error = error;
            this.counter = undefined;
        }
    }
    navigateHandler(event){
        
        if(this.objApiName == 'Exam_Scheduler__c'){
            this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
                attributes: {
                    apiName: 'ExamListView'
                },
            });
        }else  if(this.objApiName == 'Subject_Course__c'){
            this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
                attributes: {
                    apiName: 'Subject'
                },
            });
        }else  if(this.objApiName == 'Admission__c'){
            this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
                attributes: {
                    apiName: 'AdmissionListView'
                },
            });
        }else  if(this.objApiName == 'ContactStudent'){
            this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
                attributes: {
                    apiName: 'Student_List_View'
                },
            });
        }else  if(this.objApiName == 'ContactTeacher'){
            this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
                attributes: {
                    apiName: 'Teacher_List_View'
                },
            });
        }else  if(this.objApiName == 'Class__c'){
            this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
                attributes: {
                    apiName: 'class'
                },
            });
        }else  if(this.objApiName == 'Department__c'){
            this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
                attributes: {
                    apiName: 'department'
                },
            });
        }else  if(this.objApiName == 'Academic_Year__c'){
            this[NavigationMixin.Navigate]({
                type: "standard__navItemPage",
                attributes: {
                    apiName: "Create_Academic_Years",
    
                },
            });
        }else  if(this.objApiName == 'Invoice__c'){
            this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
                attributes: {
                    apiName: 'Invoice'
                },
            });
        }
    }
    
}