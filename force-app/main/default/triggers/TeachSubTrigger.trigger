trigger TeachSubTrigger on Class_Sub_Teach__c (before insert, before update) {
      TeachSubTrigger.TeachSubTrigger(trigger.new);
}