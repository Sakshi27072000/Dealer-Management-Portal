trigger CreateInvoice on Order (after update) {
// 	//List<Invoice__c> invList = new List<Invoice__c>();
//     //for(Order o: Trigger.new){
//        // if(o.Approve_Status__c == 'Dispatched'){
//             Invoice__c i = new Invoice__c();
//             i.Invoice_Date__c = date.today();
//             i.Order__c = o.Id;
//             i.Total_Amount__c = o.TotalAmount;
//            	invList.add(i);
//         }
//       }
//     insert invList;
 }