public class OppAndTragetJunction {
    public static Opp_and_Target_Junction__c saveOppAndTargetJunction(id bussinessDivisionId,id userId,String targetYear,String targetQuarter){
        List<Opp_and_Target_Junction__c> oatjList=[select id,Business_Division__c,User__c from Opp_and_Target_Junction__c where Business_Division__c=:bussinessDivisionId and User__c=:userId and Target_year__c=:targetYear and Targeted_Quarter__c=:targetQuarter];
        Opp_and_Target_Junction__c oatj = new Opp_and_Target_Junction__c();
        if(oatjList.size() ==0)
        {
            oatj.Business_Division__c = bussinessDivisionId;
            oatj.User__c=userId;
            oatj.OwnerId=userId;
            oatj.Target_year__c = targetYear;
            oatj.Targeted_Quarter__c = targetQuarter;
            insert oatj;
            return oatj;
        }
        else{
            return oatjList.get(0);
        }
    }

}