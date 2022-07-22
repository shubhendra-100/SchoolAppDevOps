public with sharing class SalesManagerController {
    @AuraEnabled
    public static void saveSalesMangers(List<Target_Owner__c> ListSalesOwners){
        upsert ListSalesOwners;
    }
   
    @AuraEnabled
    public static MAP<String,String> getUsers()
    {
        List<User> lstUsers = [	SELECT Id, FirstName,LastName,UserRole.Name FROM User where UserRole.Name='Sales Manager' and IsActive=true ];      
        MAP<String,String> usersMAp = New MAP<String,String>();
        for(user u:lstUsers)
        {
            usersMAp.put(u.id,u.FirstName+' '+u.LastName);
        }
        return usersMAp;
    }
    @AuraEnabled
    public static Target__c getTarget(ID targetID)
    {
        Target__c target = [SELECT Id,Name,Assigned_Target_Amount__c,Target_Amount__c,End_Date__c,Start_Date__c FROM Target__c where id =: targetID];
        return target;
    }
    @AuraEnabled
    public static Map<String,Target_Owner__c> searchSalesManagers(id TargetId){
    
        List<Target_Owner__c> salesManagerList = [select id,Name,Unique_Name__c,Target_Amount__c,Target__c,User__c,Target__r.Target_Amount__c,Target__r.Assigned_Target_Amount__c from Target_Owner__c where Target__c=:TargetId ];
        Map<String,Target_Owner__c> uniqueNameMap = new Map<String,Target_Owner__c>();
        for(Target_Owner__c salesManager : salesManagerList){            
            uniqueNameMap.put(salesManager.User__c,salesManager);
        }
       return  uniqueNameMap;
    }
   
}