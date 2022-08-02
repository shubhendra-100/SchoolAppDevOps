import LightningDatatable from 'lightning/datatable';
import CustomPicklist from './customPicklist.html';


export default class CustomTypesGlobal extends LightningDatatable {

    static customTypes={
        statusPicklist:{
                     template: CustomPicklist,
                     standardCellLayout: true,
                     typeAttributes : ['label', 'value', 'placeholder', 'options']
                 }
             }

    connectedCallback(){
        console.log('hello+')
    }
             
}