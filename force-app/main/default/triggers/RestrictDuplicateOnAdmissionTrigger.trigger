trigger RestrictDuplicateOnAdmissionTrigger on Admission__c (before insert ) {
    List<Admission__c> admObj= [select id,Assign_Classes__c,Academic_Year__c From Admission__c];
    Map<id,List<id>> mapVal= new Map<id,List<id>>();
    for(Admission__c adms : admObj ){
        if(mapVal.containsKey(adms.Academic_Year__c)){
            mapVal.get(adms.Academic_Year__c).add(adms.Assign_Classes__c);
            continue;
        }
        mapVal.put(adms.Academic_Year__c,new List<Id>{adms.Assign_Classes__c});
    }
    for(Admission__c admission:Trigger.New){
        if(mapVal.containsKey(admission.Academic_Year__c)){
            if(mapVal.get(admission.Academic_Year__c).contains(admission.Assign_Classes__c)){
                admission.addError('');
            }
        }
    }
    
}