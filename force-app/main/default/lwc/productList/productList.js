import { LightningElement , api} from 'lwc';
import allProducts from '@salesforce/apex/MatrixProducts.allProducts';
export default class ProductList extends LightningElement {

    @api products;
    connectedCallback()
    {
         allProducts()
         .then(result => {
            console.log('result-->',result);
            this.products = JSON.parse(JSON.stringify(result));
            console.log('products in matrix--->',this.products);
        })
        .catch(error => {
            this.error = error;
        });
    }
}