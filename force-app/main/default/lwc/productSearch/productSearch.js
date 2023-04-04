import { LightningElement, wire, track } from "lwc";

// messageChannels
import {
	subscribe,
	unsubscribe,
	MessageContext
} from "lightning/messageService";
import FILTER_CHANNEL from "@salesforce/messageChannel/productFilterChannel__c";

// apex
import getProducts from "@salesforce/apex/MatrixProducts.getProducts";

export default class ProductSearch extends LightningElement {
	searchKey = "";
	subscription = null;
	receivedMessage;
	@track showLoading = true;
	@track wiredProducts;
	
	@track filtersData = {};
	
	/*@wire(getProducts, { name: "$searchKey", filtersData: "$filtersData" })
	wiredProducts;*/


	@wire(getProducts, {  filtersData: "$filtersData" })
    wiredData( { error, data } ) {
        if(data) {

            console.log('data from get product method:',data);
            this.wiredProducts = data;
			this.showLoading = false;
        } else if (error) {
            console.log(error);
			this.showLoading = false;
        }
    }


	@wire(MessageContext)
	messageContext;

	connectedCallback() {
		this.subscribeMC();
	}

	disconnectedCallback() {
		this.unsubscribeMC();
	}

	// handleSearch(event) {
	// 	this.searchKey = event.detail.searchKey;
	// 	console.log('inside handlesearch--->',this.searchKey)
	// }

	subscribeMC() {
		if (this.subscription) {
			return;
		}
		this.subscription = subscribe(
			this.messageContext,
			FILTER_CHANNEL,
			(message) => {
				this.showLoading = true;
				console.log("message " + JSON.stringify(message));
				this.filtersData = message.filtersData;
			}
		);
	}

	unsubscribeMC() {
		unsubscribe(this.subscription);
		this.subscription = null;
	}
}