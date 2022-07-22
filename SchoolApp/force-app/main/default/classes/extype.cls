public with sharing class extype {
    @AuraEnabled(cacheable=true)
    public static List<Department__c> getAccountDataToExport(){
        List<Department__c> lstContacts = [SELECT Id, Name
FROM Department__c];
        return lstContacts;
    }

}