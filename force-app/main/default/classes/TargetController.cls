public with sharing class TargetController {
   @AuraEnabled
    public static void saveTargets(List<Target__C> ListTarget){
        upsert ListTarget;
    }
    @AuraEnabled
    public static Map<String, String> getBusinessDivisions(){
        Map<String, String> divisionMap = new Map<String, String>(); 
        for(Business_Division__c  division: [Select id,Name From Business_Division__c])
        {
            divisionMap.put(division.id, division.Name);
        }
        return divisionMap;
    }
    @AuraEnabled
    public static Map<String,Target__C> searchTargets(List<String> uniqueName){
        List<Target__C> targets = [select id,Name,Target_Amount__c,Unique_Name__c,Targeted_Quarter__c,End_Date__c,Start_Date__c from Target__C where Unique_Name__c IN : uniqueName ];        
       Map<String,Target__C> uniqueNameMap = new Map<String,Target__C>();
        for(Target__C taregt : targets){
            uniqueNameMap.put(taregt.Unique_Name__c,taregt);
        }        
       return  uniqueNameMap;
    }
    @AuraEnabled
    public static Map<String,Period> getPeriod(){
        List<Period> periods = [SELECT FullyQualifiedLabel,StartDate,EndDate,Id FROM Period where Type='Quarter'];
        Map<String,Period> periodMap = new Map<String,Period>();
        for(Period p : periods){
            periodMap.put(p.FullyQualifiedLabel,p);
        }
        return periodMap;
    }
}