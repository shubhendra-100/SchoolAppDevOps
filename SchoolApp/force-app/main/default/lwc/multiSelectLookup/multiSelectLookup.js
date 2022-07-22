import { LightningElement, api, track } from 'lwc';
import getResults from '@salesforce/apex/MultiLookUpController.getResults';

export default class MultiSelectLookup extends LightningElement {
    @api objectName;
    @api fieldName;
    @api filterField = ''; //used to provide filter field in where clause
    @api filterFieldValue = '';//used to provide filter field value in where clause
    @api useFilterCriteria = false; // used to toggle the where clause in soql query
    @api singleSelection = false; // used to toggle between single select and multi select
    @track disableInputField = false;

    @api label;

    @track className;

    @track searchRecords = [];
    @track selectedIds = [];
    @track selectedRecords = [];
    @api selectedRecords = [];
    @api selectedFromParent = [];
    @api required = false;
    @api iconName = 'action:new_user'
    @api LoadingText = false;
    @track dynamiClassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    @track messageFlag = false;

    @api
    get throwError() {

    }

    set throwError(value) {
        if (value && this.selectedRecords) {
            let inputfields = this.template.querySelectorAll("lightning-input");
            console.log('dsfdsfds=>' + JSON.stringify(inputfields))
            inputfields.forEach(item => {
                if (!item.checkValidity()) {
                    item.reportValidity();
                }
            })
        }
        console.log('vallluee' + value)
    }

    connectedCallback() {
        console.log('valuee' + this.className)
        console.log('LookuoComponentinserted')
        console.log(this.selectedFromParent);
        if (this.selectedFromParent != undefined) {
            this.selectedRecords = [...this.selectedFromParent];
            if (this.singleSelection) {
                this.disableInputField = true;
            }
        }
    }
    searchField(event) {
        this.className = '';
        var currentText = event.target.value;
        var selectRecId = [];
        for (let i = 0; i < this.selectedRecords.length; i++) {
            selectRecId.push(this.selectedRecords[i].recId);
        }
        this.LoadingText = true;
        getResults({ ObjectName: this.objectName, fieldName: this.fieldName, value: currentText, selectedRecId: selectRecId, useFilterCriteria: this.useFilterCriteria, filterField: this.filterField, filterFieldValue: this.filterFieldValue })
            .then(result => {
                this.searchRecords = result;
                this.LoadingText = false;

                //
                this.dynamiClassname = result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
                if (currentText.length > 0 && result.length == 0) {
                    this.messageFlag = true;
                }
                else {
                    this.messageFlag = false;
                }

                if (this.selectRecordId != null && this.selectRecordId.length > 0) {
                    this.iconFlag = false;
                    this.clearIconFlag = true;
                }
                else {
                    this.iconFlag = true;
                    this.clearIconFlag = false;
                }
            })
            .catch(error => {
                console.log('-------error-------------' + JSON.stringify(error));
                console.log(error);
            });

    }

    handleClick() {
        var currentText = '';
        var selectRecId = [];
        for (let i = 0; i < this.selectedRecords.length; i++) {
            selectRecId.push(this.selectedRecords[i].recId);
        }
        getResults({ ObjectName: this.objectName, fieldName: this.fieldName, value: currentText, selectedRecId: selectRecId, useFilterCriteria: this.useFilterCriteria, filterField: this.filterField, filterFieldValue: this.filterFieldValue })
            .then(result => {
                this.searchRecords = result;
                this.LoadingText = false;

                //
                this.dynamiClassname = result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
                if (currentText.length > 0 && result.length == 0) {
                    this.messageFlag = true;
                }
                else {
                    this.messageFlag = false;
                }

                if (this.selectRecordId != null && this.selectRecordId.length > 0) {
                    this.iconFlag = false;
                    this.clearIconFlag = true;
                }
                else {
                    this.iconFlag = true;
                    this.clearIconFlag = false;
                }
            })
            .catch(error => {
                console.log('-------error-------------' + JSON.stringify(error));
                console.log(error);
            });
        this.className = ' '
    }

    setSelectedRecord(event) {

        var recId = event.currentTarget.dataset.id;
        var selectName = event.currentTarget.dataset.name;
        //console.log(recId);
        //console.log(selectName);
        let newsObject = { 'recId': recId, 'recName': selectName };
        this.selectedIds.push(recId);
        this.selectedRecords.push(newsObject);
        // console.log(this.selectedIds);
        this.dynamiClassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        //let selRecords = this.selectedRecords;
        this.template.querySelectorAll('lightning-input').forEach(each => {
            each.value = '';
        });

        let selectedFromParent;
        if (this.selectedIds.length == 1) {
            selectedFromParent = this.selectedFromParent.map(each => {
                return this.selectedIds.push(each.recId);
            })
        }

        // console.log('event dispatch');
        //console.log(this.selectedIds);
        let ids = this.selectedIds.toString();
        //console.log(ids);
        const selectedEvent = new CustomEvent("userselected", {
            detail: this.selectedIds
        });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
        if (this.singleSelection) {
            this.disableInputField = true;

        }
        this.className = '--Select--'
    }

    removeRecord(event) {
        let selectRecId = [];
        let selectedIds1 = [];
        for (let i = 0; i < this.selectedRecords.length; i++) {
            if (event.detail.name !== this.selectedRecords[i].recId) {
                selectRecId.push(this.selectedRecords[i]);
                selectedIds1.push(this.selectedRecords[i].recId)
            }
        }
        this.selectedRecords = [...selectRecId];
        this.selectedIds = [...selectedIds1];
        let selRecords = this.selectedRecords;

        let ids = this.selectedIds.toString();
        if (this.singleSelection && selectRecId.length <= 0) {
            this.disableInputField = false;
        }
        const selectedEvent = new CustomEvent('userselected', {
            detail: this.selectedIds
        });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
}