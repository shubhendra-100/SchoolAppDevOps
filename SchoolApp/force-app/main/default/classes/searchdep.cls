public with sharing class searchdep {    
    @AuraEnabled(cacheable=true)
    public static List<Department__c> findDepartment(String searchKey) {
        String key = '%' + searchKey + '%';
        return [
            SELECT Id, Name,Department_ID__c
            FROM Department__c
            WHERE Name LIKE :key 
        ];
    }
}