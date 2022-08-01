import { LightningElement, wire, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import getRecords from '@salesforce/apex/studentRecord.getRecords';
/* import getCases from '@salesforce/apex/getContacts.contactController';  */
import deleteStudents from '@salesforce/apex/studentRecord.deleteStudents';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
/* import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import Contact_object from '@salesforce/schema/Contact';
import Status_field from '@salesforce/schema/Contact.Status__c';
 */
import modal from "@salesforce/resourceUrl/popUpWidth";
import { loadStyle } from "lightning/platformResourceLoader";



const actions = [
    {
        label: 'Edit', name: 'edit', iconName: "utility:edit",
        alternativeText: "Edit",
        title: "Edit"
    },
    {
        label: 'Delete', name: 'delete', iconName: "utility:delete",
        alternativeText: "Delete",
        title: "Delete"
    }
    
];

const statuss = [
    {
        label: 'Status', name: 'Status', iconName: "action:update_status",
        alternativeText: "status",
        title: "Status", type: "picklist"
    }

];


const columns = [
    { label: 'Student Name', fieldName: 'FirstName', editable: "true" },
    { label: 'DOB', fieldName: 'Date_of_Birth__c',type:'date-local',typeAttributes:{
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit"
    }, editable: "true" },
    { label: 'Registration Date', fieldName: 'Date_of_Joining__c', type:'date-local', editable:'true'},
    { label: 'Class', fieldName: 'Class_Name__c', editable: "true" },
    { label: 'Class Section', fieldName: 'Class_Section__c', editable: "true" },
    /* { label: 'Classroom', fieldName: 'Classroom', editable: "true" }, */
    { label: 'Contacts', fieldName: 'Email', editable: "true" },

//     {

//         label: 'Status', fieldName: 'Status__c', type: 'statusPicklist', wrapText:true, editable: "true",
//        typeAttributes: {
//            options: { fieldName: 'pickListOptions' },

//            value: { fieldName: 'Status__c' },

//            placeholder: 'choose status',
//        }

//    },


{
    label: 'Status', fieldName: 'Status__c', type: 'picklist',editable:"true",wrapText: true, typeAttributes: {
        placeholder: 'Choose rating', options: [
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
        ], value: { fieldName: 'Status__c' } // default value for picklist
        , context: { fieldName: 'Id' } // binding account Id with context variable to be returned back
    }
},

    /* {
        label: 'Status', fieldName: 'Status__c', type: 'customPickList', wrapText: true,

        typeAttributes: {
            options: { fieldName: 'pickListOptions' },
            value: { fieldName: 'Status__c' },
            placeholder: 'choose status'
        }
    },
 */
    { type: 'action', typeAttributes: { rowActions: actions } }

];

export default class StudentListView extends NavigationMixin(LightningElement) {
    fldsItemValues = [];
    total = 0;
    active;
    allList;
    activeList;
    Inactive;
    InactiveList;
    //contactStatus=[];
    columns = columns;
    @track array=[];
    // isLoaded=false;
    @track className;

    connectedCallback() {
        loadStyle(this, modal);
      }

    @track deleteId = [];
    @track dataList;
    wiredRecordList;
    selectedStudents;
    wiredStudents;

    @track recordId
    @track isModalOpen = false;
    @track isPopOpen = false;

    openModal() {
        this.isModalOpen = true;
        //this.isPopOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
        //this.isPopOpen = false;
    }
    submitDetails() {
        this.isModalOpen = false;
    }
    handleModalChange(event) {
        this.isModalOpen = event.detail;
        this.isPopOpen = event.detail;
    }


    ShowToast() {
        const toastEvent = new ShowToastEvent({
            title: 'Student Record Deleted!',
            message: 'Record Deleted successfully',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(toastEvent);
    }

    @wire(getRecords)
    wiredStudents(result) {
        //console.log('Helloo==================>'+JSON.stringify(result))
        this.wiredRecordList = result
        if (JSON.stringify(result) != '{}' && result.data) {
            this.dataList = JSON.parse(JSON.stringify(result.data));
            for(let x of this.dataList){
                console.log('x=====>'+JSON.stringify(x))   ///==>> this one is for taking parent name...
                x.Class_Name__c= x.Class_Name__c == null?null:x.Class_Name__r.Name;
                x.Class_Section__c = x.Class_Section__c == null?null:x.Class_Section__r.Name;
            }
                
            //console.log("dataList",result.data)
            this.total = this.dataList.length;
            this.allList = result.data;
            //console.log("allList",this.allList)
            this.activeList = this.allList.filter((list) => {
                console.log(list, "list")
                return list.Status__c === "Active"
            })
            this.InactiveList = this.allList.filter((list) => {
                console.log(list, "list")
                return list.Status__c === "Inactive"
            })
            //console.log("------",this.activeList)
            this.active = this.activeList.length;
            this.Inactive = this.InactiveList.length;
            //console.log(this.total);
            //console.log("testing001", this.dataList);
            //console.log("testing002", this.columns);
        }
        else if (JSON.stringify(result) != '{}' && result.error) {
            console.log(error);
        }
    }
    columns = columns;

    handleRowSelection(event) {
        this.selectedStudents = event.detail.selectedRows;
        //console.log(this.selectedStudents);
    }

    handleRowAction(event) {
        //console.log(JSON.stringify(event.detail.action));
        if (event.detail.action.label === 'Delete') {
            this.deleteId = event.detail.row.Id;
            this.isPopOpen = true;
            /* deleteStudents({ contactIds: [event.detail.row.Id] }).then(() => {
                
                this.ShowToast();
                setTimeout(() => {
                    location.reload()
                }, 1500);
            }) */
        }
        if (event.detail.action.label === 'Edit') {
            this.recordID = event.detail.row.Id;
            //console.log(event.detail.row.Id);
            this.isModalOpen = true;
            this.className = this.dataList.find((x)=>x.Id==event.detail.row.Id).Class_Name__c
            this.classSection = this.dataList.find((x) => x.Id == event.detail.row.Id).Class_Section__c;
            //console.log(JSON.stringify(this.dataList.find((x)=>x.Id==event.detail.row.Id)));
        }
    }

    getSelectedStudent() {
        var selectedStuds =  this.template.querySelector("lightning-datatable").getSelectedRows();
        let len = selectedStuds.length;
        if(len > 0){
            //console.log('selectedStuds are '+JSON.stringify(selectedStuds));
            selectedStuds.forEach(Item => {
                //console.log('it is working fine ====>>>>>>')
                this.array.push(Item.Id);
                //console.log('it is working ====>>>>>')
            }); 
        }  
        return len;
      }


    deleteStudents() {
        if(this.getSelectedStudent()>0){ 
            this.isPopOpen = true; 
            // this.deleteId = JSON.parse(JSON.stringify(this.selectedStudents.map(row => { return row.Id })));
            for(let x of this.selectedStudents){
                this.deleteId.push(x.Id);
            }
            //console.log("hey",JSON.stringify(this.deleteId));
            
/*          const idList = this.selectedStudents.map(row => { return row.Id })
 */        /* deleteStudents({ contactIds: idList }).then(() => {
            //location.reload();
            this.ShowToast();
        })
        this.template.querySelector('lightning-datatable').selectedRows = [];
        this.selectedStudents = undefined; 
        }*/
    }
        else if(this.getSelectedStudent()==0){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error While Deleting Record',
                    message: 'Please select a record to Delete',
                    variant: 'error',
                }),
            );
        } 
    }

    saveHandleAction(event) {
        this.fldsItemValues = event.detail.draftValues;
        const inputsItems = this.fldsItemValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });


        const promises = inputsItems.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated Successfully!!',
                    variant: 'success'
                })
            );
            this.fldsItemValues = [];
            /* location.reload(); */
            return this.refresh();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An Error Occured!!',
                    variant: 'error'
                })
            );
        }).finally(() => {
            this.fldsItemValues = [];
        });
        setTimeout(() => {
            location.reload()
        }, 1500);
    }
    async refresh() {
        await refreshApex(this.dataList);
    }


    /* popup() {
        this.dispatchEvent(new CustomEvent('edit',{
            detail:true
        }))
    }

    closePopUp(event){
        this.dispatchEvent(new CustomEvent('close',{
            detail:true
        }))

    } */

}