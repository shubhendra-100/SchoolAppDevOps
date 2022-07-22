import { LightningElement,track } from 'lwc';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];
const columns = [
    { label: 'Date', fieldName: 'Date' },
    { label: 'No.', fieldName: 'No', type: 'tel' },
    { label: 'Customer', fieldName: 'Customer', type: 'text' },
    { label: 'Amount', fieldName: 'amount', type: 'currency' },
    { label: 'Status', fieldName: 'Status', type: 'date' },
    {
        type: 'action',
        label:'Actions',
        typeAttributes: { rowActions: actions },
    },
];

export default class InvoiceListView extends LightningElement {


    @track createInvoice=false; 
    columns=columns;
     @track data=[
        {Date:'date',No:'date',Customer:'date'},
        {Date:'date'},
        {Date:'date'}
    ]




    openCreateInvoice(){
        this.createInvoice=true;
    }

    closeCreateInvoice(){
        this.createInvoice=false;
    }

    data = [];
    columns = columns;


    Statusvalue="All";
    Datevalue="Last 12Months";


    get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }
    get options1() {
        return [
            { label: 'All', value: 'All' },
            { label: 'Unpaid', value: 'Unpaid' },
            { label: 'Paid', value: 'Paid' },
        ];
    }
    get options2() {
        return [
            { label: 'Last Week', value: 'Last Week' },
            { label: 'Last Month', value: 'Last Month' },
            { label: 'Last 12Months', value: 'Last 12Months' },
        ];
    }
}