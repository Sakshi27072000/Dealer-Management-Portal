public with sharing class JestAssessmentClass {
    
    @AuraEnabled
    public static List<Account> getAccounts(){
        List<Account> accList = new List<Account>();
        try {
            accList = [SELECT Id,Name FROM Account LIMIT 10];
        } catch (Exception e) {
            System.debug(e.getMessage());
        }
        return accList;
    }
}