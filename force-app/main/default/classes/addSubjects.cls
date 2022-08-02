public with sharing class addSubjects {
    @AuraEnabled
    public static void addSubjects(String subName){
        try {
            Subject_Course__c sub = new Subject_Course__c();
            sub.Name = subName;
            insert sub;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}