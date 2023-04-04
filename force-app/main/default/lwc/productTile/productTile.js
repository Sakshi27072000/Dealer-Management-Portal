import {LightningElement, api, wire, track} from "lwc";
// messageChannels
import { publish, MessageContext } from "lightning/messageService";
import CART_CHANNEL from "@salesforce/messageChannel/productAddRemoveCartChannel__c";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProductTile extends LightningElement {
	@api product;
    Name;
    
    connectedCallback()
    {
        console.log('products in tile 1--->',this.product)
		this.product=JSON.parse(JSON.stringify(this.product));
		console.log('after stringify-->',this.product)
        this.Name=this.product.Name;
    }
	@wire(MessageContext)
	messageContext;

	publishChange(cartData, cartAction) {
		const message = {
			cartData: cartData,
			action:{
				cartAction : cartAction
			}
		};
		publish(this.messageContext, CART_CHANNEL, message);
	}

	

	@api
	get addedToCart() {
		return this.isAddedToCart;
	}
	set addedToCart(value) {
		this.isAddedToCart = value;
	}

	@api
	get defaultQuantity() {
		return this.quantity;
	}

	set defaultQuantity(value) {
		this.quantity = value;
	}

	@track quantity = 1;
	isAddedToCart;

	handleReduceQuantity(){
		if(this.quantity == 0){
			return;
		}else{
			this.quantity-=1;
		}
	}

	handleIncreaseQuantity(){
		this.quantity+=1;
	}

	handleAddToCart() {
        if(!this.quantity && this.quantity<1)
        {
			console.log(this.quantity)
            this.showToast('Please insert quantity to add to cart','','warning');
        }
        else{

		this.isAddedToCart = true;
		let cartData = {
			productId: this.product.Id,
			Id : this.product.Id,
			quantity: this.quantity,
			Name : this.product.Name,
			price : this.product.UnitPrice,
			totalPrice : (this.quantity * this.product.UnitPrice),
		}
		this.publishChange(cartData, 'Add');
        this.showToast(`${this.product.Name} is  added to cart!`,'','Success')
    }
	}

	handleRemoveFromCart() {
		this.isAddedToCart = false;
		let cartData = {
			productId: this.product.Id,
		}
		this.publishChange(cartData, 'Remove');
		
	}

	handleChange(event) {
		this.quantity = event.target.value;
		console.log(this.quantity)
		//console.log(totalPrice);
	}

	get backgroundStyle() {
		console.log('image url------>',this.product.Product2);
		//let product2=JSON.parse(JSON.stringify(this.product.Product2))
		let url1=JSON.stringify(this.product.Product2.Image_Url__c);
		console.log(url1)
		//console.log(product2)

		return `background-image:url(${url1})`;
		
		// return `background-image:url('https://i.imgur.com/KLe3XF0.jpg')`;
		 }
	

	get totalPrice() {
		console.log(this.quantity * this.product.UnitPrice)
		return this.quantity * this.product.UnitPrice;
	}

    showToast(title1,message1,varient1) {
        const event = new ShowToastEvent({
            title: title1,
            message:message1,
            variant:varient1
  
        });
        this.dispatchEvent(event);
    }
}