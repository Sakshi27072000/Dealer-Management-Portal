@isTest
public class MatrixProductsTest {

 @TestSetup
 static void getData()
 {

 //Account record
         Account acc1=new Account();
         acc1.Name='Abhijeet D';
         acc1.ShippingCity='Pune';
         acc1.ShippingCountry='India';
         acc1.ShippingPostalCode='411 234';
         acc1.ShippingState='Maharastra';
         acc1.ShippingStreet='Hinjewadi Road';
         acc1.BillingCity='Pune';
         acc1.BillingCountry='India';
         acc1.BillingPostalCode='411 033';
         acc1.BillingState='Maharastra';
         //acc1.BillingStreet='Paud Road'; 

         Insert acc1;
        
         //contract record
         Contract cont1=new Contract();
         cont1.AccountId=acc1.id;
         cont1.Status='Draft';
         cont1.ContractTerm=24;
         cont1.StartDate=system.today();
         insert cont1;
         //product2 record1
         Product2 p1=new Product2();
         p1.Name='1Ton 3 Star Window AC';
         p1.Family='Air Conditioners';
         p1.Image_Url__c='https://vijayenterprises.com/wp-content/uploads/2022/08/3wae081ydf-window-ac-4.png';
         insert p1;
         //Pricebookentry record1
         Pricebookentry entry1=new Pricebookentry();
         entry1.Product2Id=p1.id;

         //product2 record2
         Product2 p2=new Product2();
         p2.Name='Oven Toaster';
         p2.Family='Kitchen Appliances';
         p2.Image_Url__c='https://image3.mouthshut.com/images/imagesp/926095368s.jpg';
         insert p2;

         //Pricebookentry record2
        Pricebookentry entry2=new Pricebookentry();
        entry2.Product2Id=p2.id;
       
     Invoice__c inv=new Invoice__c();
     inv.total_amount__c=50000;
     inv.status__c='sent';
     inv.Invoice_date__c=system.today();
     insert inv;

 }
     @isTest
     static void allProductsTest()
     {
         Test.startTest();
         List<Pricebookentry> list1=MatrixProducts.allProducts();
         Test.stopTest();
         system.assertNotEquals(null, list1);
    }

 @isTest
 static void getProductsTest()
 {
         MatrixProducts.FilterWrapper f1=new MatrixProducts.FilterWrapper();
          f1.category='Air Conditioners';
          f1.minPrice=5000;
          f1.maxPrice=100000;
         
     

        Test.startTest();
        List<Pricebookentry> list2=MatrixProducts.getProducts(f1);
        Test.stopTest(); 
        system.assertNotEquals(null, list2); 
		}

    @isTest
 static void createOrderTest()
 {
      list<MatrixProducts.ProductOrderWrapper> pwList=new  list<MatrixProducts.ProductOrderWrapper>();
     list<product2> pList=[select id , Name from Product2];
     MatrixProducts.ProductOrderWrapper pw1 =new MatrixProducts.ProductOrderWrapper();
     pw1.Id=pList[0].id;
     pw1.Name=pList[0].Name;
     pw1.price=50000;
     pw1.quantity=10;
     pw1.totalPrice=500000;
     
     pwList.add(pw1);
     
  
      
     // object acc = (object)pwList;
      //system.debug(acc); 
     Test.startTest();
     MatrixProducts.createOrder(pwList);
     Test.stopTest(); 
     
 }
    
  @isTest
 static void myInvoicesTest()
 {
     Test.startTest();
     List<invoice__c> list3=MatrixProducts.myInvoices();
     Test.stopTest();
     system.assertNotEquals(null, list3);
 }

}