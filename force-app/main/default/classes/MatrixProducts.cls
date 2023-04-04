public with sharing class MatrixProducts {
    
    @auraEnabled(cacheable=true)
    public static list<Pricebookentry> allProducts()
    {
        list<Pricebookentry> list1=[SELECT Id,Name,Product2.Id,Product2.Image_Url__c,Product2.Family,UnitPrice  FROM Pricebookentry];
        system.debug(list1);
        return list1;
    }
    

  
      
    @auraEnabled(cacheable=true)
    public static List<Pricebookentry> getProducts(FilterWrapper filtersData) {
	
		String query = 'SELECT Id,Name,Product2.Id,Product2.Image_Url__c,Product2.Family,UnitPrice  FROM Pricebookentry WHERE IsActive=true';

		
		System.debug('filtersData ' + filtersData);
		if (filtersData != null) {

			if (filtersData.minPrice != null) {
				Decimal minPrice = filtersData.minPrice;
				query += ' AND UnitPrice >= :minPrice';
			}

			if (filtersData.maxPrice != null) {
				Decimal maxPrice = filtersData.maxPrice;
				query += ' AND UnitPrice <= :maxPrice';
			}

			if (String.isNotBlank(filtersData.category)) {
				String category = filtersData.category;
				query += ' AND Product2.Family = :category';
			}

		
		}
        system.debug(query);
		return (List<Pricebookentry>) Database.query(query);
	}
    
    @AuraEnabled
	public static String createOrder(object data){
        system.debug(data);
		List<ProductOrderWrapper> productData = (List<ProductOrderWrapper>) JSON.deserialize(JSON.serialize(data), List<ProductOrderWrapper>.class);
        system.debug(productData);
        string usr=UserInfo.getName();
        list <Account> accList=[select Id,ShippingCity,ShippingCountry,ShippingPostalCode ,ShippingState,ShippingStreet,BillingCity,BillingCountry,BillingPostalCode,BillingState,BillingStreet,name, Contract_Number__c from account where name=:usr];
		system.debug(accList);
        Order ord = new Order();
        ord.ContractId=accList[0].Contract_Number__c;
        ord.Pricebook2Id='01s2w00000TiiAYAAZ';
        ord.AccountId=accList[0].Id;
        ord.EffectiveDate=system.today();
        ord.Status='Draft';
            // shipping address
          //ord.ShippingAddress =accList[0].ShippingAddress;
          ord.ShippingCity =accList[0].ShippingCity;
          ord.ShippingCountry =accList[0].ShippingCountry;
          ord.ShippingPostalCode =accList[0].ShippingPostalCode;
          ord.ShippingState = accList[0].ShippingState;
          ord.ShippingStreet= accList[0].ShippingStreet;
        //Billing address
        
          ord.BillingCity =accList[0].BillingCity;
          ord.BillingCountry =accList[0].BillingCountry;
          ord.BillingPostalCode =accList[0].BillingPostalCode;
          ord.BillingState = accList[0].BillingState;
          ord.BillingStreet= accList[0].BillingStreet;

		  
        
        try{
            insert ord;
        }
        catch(exception e)
        {
            system.debug(e.getMessage());
        }
        system.debug(ord);
		List<OrderItem> oliList = new List<OrderItem>();

		for(ProductOrderWrapper product : productData){
			OrderItem oli = new OrderItem();
			oli.OrderId = ord.Id;
			oli.Product2Id = product.Id;
			oli.UnitPrice = product.totalPrice/product.quantity;
			oli.Quantity = product.quantity;
			oliList.add(oli);
		}

        try{
            insert oliList;
        }
        catch(exception e)
        {
            system.debug(e.getMessage());
        }

		ord.Status = 'Ready for Approval';
		try{
			update ord;
        }
        catch(exception e)
        {
            system.debug(e.getMessage());
        }

		system.debug('OrderId'+ ord.Id);
		return ord.Id;
		
	}
	@AuraEnabled
    public static list<Invoice__c> myInvoices()
    {
        string usr=UserInfo.getUserId();
        list<Invoice__c> invList=[Select Id ,Name,Total_Amount__c, Status__c , Invoice_date__c from Invoice__c where Order_Owner__c=:usr  ];
        return invList;
    }
    
    public  class FilterWrapper {
		@AuraEnabled
		public Decimal minPrice { get; set; }

		@AuraEnabled
		public Decimal maxPrice { get; set; }

		@AuraEnabled
		public String category { get; set; }

		
	}

	public class ProductOrderWrapper {
		@AuraEnabled
		public String Id;

		@AuraEnabled
		public Decimal price;

		@AuraEnabled
		public Decimal totalPrice;

		@AuraEnabled
		public Integer quantity;

		@AuraEnabled
		public String Name;
	}

}