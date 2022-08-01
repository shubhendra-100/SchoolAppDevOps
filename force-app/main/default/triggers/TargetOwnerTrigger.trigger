trigger TargetOwnerTrigger on Target_Owner__c (before insert,before update) {
    for(Target_Owner__c to : Trigger.new){
          Opp_and_Target_Junction__c  oatj = OppAndTragetJunction.saveOppAndTargetJunction(to.Business_Division_Id__c, to.User__c,to.Target_year__c,to.Targeted_Quarter__c);
          to.Opp_and_Target_Junction__c = oatj.id;
         } 
}