public with sharing class TeachSubTrigger {
    public static void TeachSubTrigger(List<Class_Sub_Teach__c> newTeachSub) {
        List<Class_Sub_Teach__c> allRecords = [SELECT Id, Teacher_Name__c, Subject_Course__c, section__c FROM Class_Sub_Teach__c];

        for(Class_Sub_Teach__c record: newTeachSub){
            for (Integer i = 0; i < allRecords.size(); i++){
            if(record.Teacher_Name__c==allRecords[i].Teacher_Name__c 
                && record.Subject_Course__c==allRecords[i].Subject_Course__c 
                && record.Teacher_Name__c==allRecords[i].Teacher_Name__c){
                    record.addError('Selected teacher and subject already assigned to the class');
                }
            }
        }
    }
}