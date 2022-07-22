@isTest
public class OppAndTargetOwnerTest {
    static testMethod void ValidateOpportunity() {
        opportunity opp = new Opportunity();
        Account acc = new Account();
        acc.Name='TestAccount';
        //acc.CurrencyIsoCode = 	'USD';
        insert acc;
        opp.Name = 'Test1';
        opp.AccountId = acc.id;
        opp.CloseDate = System.today();
        opp.StageName = 'Closed Won';
        Business_Division__c bd = new Business_Division__c();
        bd.Name='ECM';
        insert bd;
        opp.Business_Division_Lookup__c = bd.id;
        opp.Lead_Agent__c = 'yousuf';
        opp.Amount = 1000;
        opp.WonReason__c = 'Reason';
        insert opp;
        opp.Amount=1001;
        update opp;
        
    }
}