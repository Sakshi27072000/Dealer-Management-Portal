import { LightningElement } from 'lwc';
import myInvoices from '@salesforce/apex/MatrixProducts.myInvoices';

const columns = [
    { label:'Id', fieldName:'Id'},
    { label: 'Invoice', fieldName: 'Name' },
    { label: 'Amount', fieldName: 'total_amount__c' },
    { label: 'Date', fieldName: 'Invoice_date__c' },
    { label: 'Status', fieldName: 'Status__c' },
];
export default class InvoiceList extends LightningElement {
    data = [];
    columns = columns;
    connectedCallback(){
        myInvoices().then((data)=>{
            this.data = data;
            console.log('DATAAA',JSON.stringify(data));
        }).catch((err)=>{
            console.log(JSON.stringify(err));
        })
    }
}