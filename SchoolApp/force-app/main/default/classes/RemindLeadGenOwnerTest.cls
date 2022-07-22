@isTest
private class RemindLeadGenOwnerTest {
    
     public static String CRON_EXP = '0 11 19 ? * WED';
        static testmethod void testScheduledJob() {
            LeadGen__c leadgen = new LeadGen__c(Business_Division__c = 'EAM',Technology__c = 'EAM360 Mobile App',Email_Sent_Date__c=System.today()-1,No_of_Emails_Sent__c=7,No_of_Unique_companies__c=39,Geography__c='North America',Lead_Agent__c='Hajira');
           
            insert leadgen;
            String jobId = System.schedule('ScheduledApexTest',
                                           CRON_EXP, 
                                           new RemindLeadGenOwner());
            system.debug('jobId'+jobId);
        }

}