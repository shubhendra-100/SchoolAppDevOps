public with sharing class assignTeacher {
    @AuraEnabled(cacheable=true)
    public static section__c getValuess(string recId) {
    try{
        
        // Teacher_Name__c, Subject__c 
        return [SELECT Id, Name, Class__r.Name, CreatedDate, CreatedBy.Name FROM section__c WHERE Id =: recId];
        
    }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string teachSubAdder(string recId, string teachId, string subId){
        try {
            Class_Sub_Teach__c ClsTeachSub = new Class_Sub_Teach__c(Teacher_Name__c=teachId, Subject_Course__c=subId, section__c=recId);
            insert ClsTeachSub;
            system.debug(ClsTeachSub);
            return 'success';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Class_Sub_Teach__c> tableValues(string recId){
        try {
            List<Class_Sub_Teach__c> ClsTeachSub = [SELECT Teacher_Name__r.Name, Subject_Course__r.Name FROM Class_Sub_Teach__c WHERE section__r.Id=: recId];
            return ClsTeachSub;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Class_Sub_Teach__c> delClsTeachSub(List<string> recId){
        try {
            List<Class_Sub_Teach__c> ClsTeachSub = [SELECT Teacher_Name__r.Name, Subject_Course__r.Name FROM Class_Sub_Teach__c WHERE section__r.Id IN: recId];
            delete ClsTeachSub;
            return ClsTeachSub;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}