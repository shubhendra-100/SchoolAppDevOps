public with sharing class studentRecord {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getRecords(){
    return [Select FirstName, Date_of_Birth__c, Date_of_Joining__c, Class_Name__r.Name, Class_Section__r.Name, Email ,Status__c From Contact where recordType.Name = 'Students/Parents' order by LastModifiedDate desc LIMIT 10 ];//where Date_of_Joining__c != null order by LastModifiedDate desc

}


    @AuraEnabled
    public static void deleteStudents(List<Id> contactIds){
        if(contactIds.size() > 0 ){
            delete [SELECT Id FROM Contact WHERE Id in: contactIds];
        }
    }
}