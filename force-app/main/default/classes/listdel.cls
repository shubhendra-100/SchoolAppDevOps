public with sharing class listdel {

    @AuraEnabled

    public static List<Department__c> retrieveAccounts(List<String> arr) {

    List<Department__c> str = [SELECT Id from Department__c WHERE
                                Id IN: arr ];
     delete str;

        return  [SELECT Id,Name from Department__c];

    }
    @AuraEnabled(cacheable=true)
    public static Department__c getSingleContact() {
        return [
            SELECT Id, Name
            FROM Department__c];
    }

}