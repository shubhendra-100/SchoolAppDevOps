public with sharing class updateStudent {
    @AuraEnabled(cacheable=true)
    public static List<Contact> editStudentRecord(String id){
        return [Select FirstName, Date_of_Birth__c, Date_of_Joining__c, Class__c, Email ,Status__c From Contact where Id=:id];
      }
      
      @AuraEnabled
      public static void updateStudentRecords(Contact newRec){
      update newRec;
        
      }
}