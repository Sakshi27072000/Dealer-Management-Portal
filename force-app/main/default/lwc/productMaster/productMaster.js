import { LightningElement, track, wire } from 'lwc';
// messageChannels
import {
	subscribe,
	unsubscribe,
	MessageContext
} from "lightning/messageService";
import CART_CHANNEL from "@salesforce/messageChannel/productAddRemoveCartChannel__c";

export default class ProductMaster extends LightningElement {
    @track totalInCart = 0;
    @track cartData = [];
	openFilter=false;
    

    @wire(MessageContext)
	messageContext;

	connectedCallback() {
		this.subscribeMC();
	}

	disconnectedCallback() {
		this.unsubscribeMC();
	}

	subscribeMC() {
		if (this.subscription) {
			return;
		}
		this.subscription = subscribe(
			this.messageContext,
			CART_CHANNEL,
			(message) => {
				console.log("message " + JSON.stringify(message));
				let cartData = message.cartData;
                let cartAction = message.action.cartAction;
                
                if(cartAction =='Add'){
                    this.cartData.push(cartData);
                    this.totalInCart++;
                } else if(cartAction =='Remove'){
                    let productId = cartData.productId;
                    let cartFilterData = this.cartData.filter(ele => ele.productId != productId);
                    this.cartData = cartFilterData;
                    this.totalInCart--;
                }

                console.log('inside subscribe mc -->',this.cartData);
                console.log('total In cart',this.totalInCart)
			}
		);
	}

	handleDownload(event)
	{
		window.open("https://drive.google.com/file/d/1w9Mrra18jWnLXNDNwUGp9jdRgP0By6KF/view?usp=drivesdk", '_blank');
		//https://drive.google.com/file/d/1w9Mrra18jWnLXNDNwUGp9jdRgP0By6KF/view?usp=drivesdk
	}

	unsubscribeMC() {
		unsubscribe(this.subscription);
		this.subscription = null;
	}

	handleOpenCart(){
		let child = this.template.querySelector('c-cart-data');
		child.openModal(this.cartData);
	}

	handleOpenFilter(){
		let child1 = this.template.querySelector('c-product-filters');
		child1.openModal();
         this.openFilter=true;
	}
}