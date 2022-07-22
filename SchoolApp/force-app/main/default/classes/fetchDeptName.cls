public with sharing class fetchDeptName {
    @auraEnabled(cacheable=true)
    public static  List<Department__c> fetchDeptName() {
            List<Department__c> fieldValues = [SELECT Name FROM Department__c];
    return fieldValues;
    }
}