import { LightningElement, track, wire, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

import getValuess from '@salesforce/apex/assignTeacher.getValuess';
import teachSubAdder from '@salesforce/apex/assignTeacher.teachSubAdder';
import tableValues from '@salesforce/apex/assignTeacher.tableValues';

import delClsTeachSub from '@salesforce/apex/assignTeacher.delClsTeachSub';

const actions = [
    {
        label: 'Delete', name: 'delete', iconName: "utility:delete",
        alternativeText: "Delete",
        title: "Delete"
    },
];

const columns = [
    { label: 'Teacher', fieldName: 'Teacher_Name__c'},
    { label: 'Subject', fieldName: 'Subject_Course__c'},
    { label: 'Is Admin'},
    //{ label: 'Last Modified By', fieldName: 'LastModifiedBy'},
    { type: 'action', typeAttributes: { rowActions: actions } }
];

export default class AssignTeacherToClass extends LightningElement {
    @api modalRes;
    @api recordsId;

    closeModal() {
        // Setting boolean variable to false, this will hide the Modal
        this.ModalRes = false;
        this.dispatchEvent(new CustomEvent('modalchanges', { detail: this.ModalRes }));
    }

    @track DelId = [];
    @track isDelete;

    @track dataa = [];

    @track error;
    @track Records = [];
    
    columns = columns;

    @track className;
    @track classSection;
    @track createdDate;
    @track createdBy;

    @track TeacherId;
    @track SubjectId;

    selectedTeacher(event){
        this.TeacherId = event.detail;
    }

    selectedSubject(event){
        this.SubjectId = event.detail;
    }

    recordsToDel;

    @wire(getValuess, ({recId: '$recordsId'}))
    wiredClasses({error,data}){
        if(data){
            this.className= data.Class__r.Name;
            this.classSection= data.Name;
            this.createdDate= data.CreatedDate.split('T')[0];
            this.createdBy = data.CreatedBy.Name;
            this.error = undefined;
        }
         else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    @wire(tableValues, ({recId: '$recordsId'}))
    wiredTable({error,data}){
        if(data){
            this.dataa = data.map((item) => {
                return {
                    Id: item.Id,
                    Teacher_Name__c: item.Teacher_Name__r.Name,
                    Subject_Course__c: item.Subject_Course__r.Name,
                }
            });
            this.error = undefined;
        }
    }

    handleSelectedRow(event){
        this.recordsToDel = event.detail.selectedRows;
    }

    handleRowAction(event) {
        const rowToDel = [];

        if (event.detail.action.name === "delete") {
            rowToDel.push(event.detail.row.Id);
            delClsTeachSub({ recId: rowToDel })
                .then((res) => {
                    const toastEvent = new ShowToastEvent({
                        title: 'Record Deleted',
                        message: 'Record deleted successfully',
                        variant: 'success'
                    });
                this.dispatchEvent(toastEvent);
                //location.reload();
            })
        }
    }

    @track isError= false;
    @track value;

    addTeachSub(){
        if(this.TeacherId!=null && this.TeacherId!= undefined && this.SubjectId!=null && this.SubjectId!= undefined){
        
        console.log('teach--->'+this.TeacherId);
        console.log('sub---->'+this.SubjectId);
        teachSubAdder({recId: this.recordsId, teachId: this.TeacherId, subId: this.SubjectId})
        .then(res=> {console.log(res)})
        .catch(err=> {console.log(err)})
        }
        else{
            console.log('error occured');
        }

        // let obj = [];

        // for(let x of this.Records){
        //     obj.push(x);
        // }
        // obj.push({
        //     Id : null,
        //     Teacher_Name__c : this.TeacherId,
        //     Subject_Course__c : this.SubjectId,
        // })
        // this.Records = obj;
    }
    
    submitHandler(){
        this.ModalRes = false;
        this.dispatchEvent(new CustomEvent('modalchanges', { detail: this.ModalRes }));
    }

    closemodaldelete(event){
        this.isDelete = event.detail;
    }

    TeacherNameHandler(event)
    {
        let index = event.target.dataset.index;
        this.Records[index].Teacher_Name__c = event.target.value;
    }

    SubjectNameHandler(event)
    {
        let index = event.target.dataset.index;
        this.Records[index].Subject_Course__c = event.target.value;
    }

}