public with sharing class subjectCreation {
    @AuraEnabled
    public static void createSubject(String subjectName){
        try {
            Subject_Course__c subject =new Subject_Course__c();
            subject.Name = subjectName;
            insert subject;
            //return subjectName;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}