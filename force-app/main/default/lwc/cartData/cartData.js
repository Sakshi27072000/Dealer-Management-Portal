import { LightningElement, track, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import createOrder from '@salesforce/apex/MatrixProducts.createOrder';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class CartData extends NavigationMixin(LightningElement) {
    @track showModal = false;
    @track showLoading = false;
    @track products;
    @track totalPrice = 0;
    quantity;

  
    @api openModal(products) {
        console.log(products);
        this.totalPrice = 0;
        products.forEach(currentItem => {
            console.log('Product in cart',currentItem)
            this.totalPrice = this.totalPrice + (currentItem.totalPrice);
        });

        this.products = products;
        this.showModal = true;
    }

    handleQuantity(event)
	{
        console.log()
		this.quantity=event.target.label;
		let id=event.target.value;

		console.log(this.quantity,'     ',id);
	}
   
    closeModal(){
        
        this.showModal = false;
        
    }

    get isDisable(){
        return !(this.products.length > 0) || this.showLoading;
    }

    handleOrder(){
         
        console.log(this.quantity);
        if(this.quantity<1)
        {
            this.showToast('','Please Enter the quantity', 'Error', 'dismissable');
        }
        else
        {
        this.showLoading = true;
         console.log('products inncart----->',JSON.parse(JSON.stringify(this.products)))
        createOrder({data:this.products})
        .then(result=>{
            let title = 'Order Created Successfully!!';
            this.showToast('', title, 'success', 'dismissable');
          //  this.isDisable=true;
            console.log('orderid-->',result)
           this.navigateToOrderPage(result);
           //window.location.reload(true);
        }).catch(err=>{
            
            console.log('errorrrrrrrr',err.body.message)
            this.showToast('Error!!', err.body.message, 'error');
        }).finally(() => {
            this.showLoading = false;
        })
      }
    }

    navigateToOrderPage(recordId) {
        console.log('navigate to record page')
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Order',
                actionName: 'view'
            },
        });
    }
  
    showHideSpinner() {
        // Setting boolean variable show/hide spinner
        this.showLoading = !this.showLoading;
    }

    showToast(title, message, variant, mode){
        const evt = new ShowToastEvent({
            title: title,
            message:message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    } 
}