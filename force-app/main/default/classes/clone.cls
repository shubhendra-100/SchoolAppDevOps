public with sharing class clone {
    @AuraEnabled (cacheable=true)
    public static list<Department__c> getFormTemplateName(String salesId){
    
        List<Department__c> originalList = [Select Id, Name From Department__c];

         List<Department__c> cloneList = originalList.deepClone();
    
        return originalList;
    }
}