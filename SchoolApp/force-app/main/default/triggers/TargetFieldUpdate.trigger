trigger TargetFieldUpdate on Target__c (before delete) {
    Map<Id, Target__c> mapTarget = new Map<Id, Target__c>([SELECT Id, (SELECT Id FROM Sales_Managers__r LIMIT 1) FROM Target__c WHERE Id IN: trigger.old]);
    for(Target__c objTarget : trigger.old)
    {
        if(mapTarget.containsKey(objTarget.Id) && mapTarget.get(objTarget.Id).Sales_Managers__r.isEmpty()) continue;
        objTarget.adderror('Cannot Delete Target Because It Has Related Target Assignements');
    }
}