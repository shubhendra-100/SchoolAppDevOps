import LightningDatatable from 'lightning/datatable';

// export default class CaseTablewithPicklist extends LightningDatatable {}

// import customName from './customName.html';
// import customNumber from './customNumber.html';

export default class MyTypes extends LightningDatatable {
    static customTypes = {
        customText: {
            template: customName,
            standardCellLayout: true,
            typeAttributes: ['accountName'],
        },
        customNumber: {
            template: customNumber,
            standardCellLayout: false,
            typeAttributes: ['status'],
        }
        // Other types here
    }
}