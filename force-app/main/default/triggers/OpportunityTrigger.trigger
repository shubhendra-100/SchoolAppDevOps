trigger OpportunityTrigger on Opportunity (before insert,before update) {
    for(Opportunity opp : Trigger.new){
        if(opp.StageName == 'Closed Won'){
        Period period = [SELECT FullyQualifiedLabel,StartDate,EndDate,Id FROM Period where Type='Quarter' and StartDate<=:opp.CloseDate and EndDate>=:opp.CloseDate limit 1];
        Id userId = opp.User__c;  
        if(userId == null)
            userId = UserInfo.getUserId();
            String fullyQualifiedLabel = period.FullyQualifiedLabel;
            String year = fullyQualifiedLabel.substring(period.FullyQualifiedLabel.length()-4);
            Opp_and_Target_Junction__c  oatj = OppAndTragetJunction.saveOppAndTargetJunction(opp.Business_Division_Lookup__c,userId,year,period.FullyQualifiedLabel);
        opp.Opp_and_Target_Junction__c = oatj.id;
        }
    }
}