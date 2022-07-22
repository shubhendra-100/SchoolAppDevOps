import { LightningElement,track } from 'lwc';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];
const columns = [
    { label: 'Service Date', fieldName: 'Service_Date' },
    { label: 'Product/Service', fieldName: 'Product_Service'},
    { label: 'Description', fieldName: 'Description'},
    { label: 'Quantity', fieldName: 'Quantity'},
    { label: 'Rate', fieldName: 'Rate'},
    { label: 'Amount', fieldName: 'Amount' },
    {
        type: 'action',
        label:'Actions',
        typeAttributes: { rowActions: actions },
    },
];

export default class CreateInvoice extends LightningElement {

    @track payment = {data:[{Id: '001'}]};
    @track data = [{Service_Date:'date',Product_Service:'date',Description:'date'},
    {Quantity:'date'},
    {Rate:'date'}]


    handleClick(){
        this.payment.data.push({ Id: +this.payment.data[this.payment.data.length - 1].Id++});
    }

    removeResource(){
    if(this.payment.data.length > 1){
        this.payment.data.pop();
    }
    }

    data = [];
    columns = columns;

    @track invoiceNo;
    @track purchaseNo;

    get options() {
        return [
            { label: 'Immediate', value: 'Immediate' },
            { label: 'Net 5', value: 'Net 5' },
            { label: 'Net 10', value: 'Net 10' },
            { label: 'Net 15', value: 'Net 15' },
            { label: 'Net 30', value: 'Net 30' }
        ];
    }

    
    get TermOptions(){
        return [
            { label: 'Immediate', value: '0' },
            { label: 'Net 5', value: '5' },
            { label: 'Net 10', value: '10' },
            { label: 'Net 15', value: '15' },
            { label: 'Net 30', value: '30' } 
        ];
    }

    get options1(){
        return [
            { label: 'Card', value: 'Card' },
            { label: 'Bank Trasnfer', value: 'Bank Trasnfer' }, 
        ];
    }

    
    addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.getFullYear() + "-" + `${Number(result.getMonth())+1}` + "-" + result.getDate();
    }

    @track term;

    handleTermChange(event){
        this.term= event.detail.value;

        if(this.invoiceDate==null || this.invoiceDate==undefined){
            this.dueDate = undefined;
        }
        else{
        this.dueDate = this.addDays(this.invoiceDate, Number(this.term));
        }
    }

    @track invoiceDate;
    @track dueDate;

    handleDateChange(event){
        this.invoiceDate = event.target.value;

        if(this.term==null || this.term==undefined || this.invoiceDate==null || this.invoiceDate==undefined){
            this.dueDate = undefined;
        }
        else{
        this.dueDate = this.addDays(this.invoiceDate, Number(this.term));
        }
    }

    handleChange(event){
        if(event.target.name=="Invoice no"){
            this.invoiceNo =event.target.value;
            console.log('inv'+this.invoiceNo);
        } if(event.target.name=="Purchase No"){
            this.purchaseNo =event.target.value;
            console.log('purch'+this.purchaseNo);
        }
    }
}