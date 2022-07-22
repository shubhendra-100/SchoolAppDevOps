public with sharing class TeacherRecordList {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getTeacherRecords(){
    return [Select Teacher_Name__c, Staff_Id__c, Departments__c, Status__c, LastModifiedById, LastModifiedDate From Contact];

}

@AuraEnabled
public static void deleteTeachers(List<Id> contactIds){
    if(contactIds.size() > 0 ){
        delete [SELECT Id FROM Contact WHERE Id in: contactIds];
    }
}
}