import { LightningElement, wire, api, track } from "lwc";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
// messageChannels
import { publish, MessageContext } from "lightning/messageService";
import PRODUCT_OBJECT from '@salesforce/schema/Product2';
import FILTER_CHANNEL from "@salesforce/messageChannel/productFilterChannel__c";

import CATEGORY_FIELD from "@salesforce/schema/Product2.Family";

export default class ProductFilters extends LightningElement {
	@track showModal=false;
    @track showLoading = false;
	minPrice;
	maxPrice;
	categoryList;
	

	@wire(getObjectInfo, { objectApiName: PRODUCT_OBJECT })
    objectInfo({error,data})
	{
		if(data)
		{
			console.log('objectinfo data',data);
		}
		else
		{
			console.log(error);
		}
	}

  
	// categoryList=['Laptop','Mobile','Refrigerator'];

	@wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName:CATEGORY_FIELD})
	categoryPicklistValues({error,data})
	{
		if(data)
		{
			console.log('category data',data);
			console.log(data.values);
			this.categoryList=data.values;
			console.log('category list--->',this.categoryList)
		}
		else
		{
			console.log('error in getpixklist',error);
		}
	}

	@wire(MessageContext)
	messageContext;

	handleChange(event) {
		this[event.target.name] = event.detail.value;
		console.log(event.detail.value);
	}

	publishChange() {
		const message = {
			filtersData: {
				category: this.category,
				minPrice: this.minPrice,
				maxPrice: this.maxPrice,
				
			}
		};
		publish(this.messageContext, FILTER_CHANNEL, message);
	}

	@api openModal() {
       // console.log('products from master',products);
      //  this.products = products;
        this.showModal = true;
    }

    closeModal(){
        this.showModal = false;
    }

	handleApplyFilter(){
		this.publishChange();
		this.closeModal();
	}
}