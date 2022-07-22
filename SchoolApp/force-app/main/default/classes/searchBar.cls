public with sharing class searchBar {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getRecords(String keySearch){
        string searchKeyword = '%' + keySearch + '%';
        return [Select Id, Name, Teacher_Name__c, Staff_Id__c, Status__c, LastModifiedBy.Name, Departments__r.Name,
             LastModifiedDate from Contact where Teacher_Name__c like:searchKeyword order by CreatedDate desc];
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getAllRecords(){
        try {
            return [Select Id, Name, Teacher_Name__c, Staff_Id__c, RecordType.Name,  
 Status__c,LastModifiedBy.Name, LastModifiedDate from Contact where RecordType.Name='Teacher' order by CreatedDate desc];
            
        } 
          catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}

//Departments__r.Name,