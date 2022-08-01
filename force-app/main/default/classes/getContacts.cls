public with sharing class getContacts {
  @AuraEnabled
  public static list<contact> contactController(){
    try {
        return[SELECT FirstName, Date_of_Birth__c, Date_of_Joining__c, Class__c, Email ,Status__c From Contact where recordType.Name = 'Students/Parents' LIMIT 5];
    } 
    catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
  }
}