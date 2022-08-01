global class RemindLeadGenOwner implements Schedulable {
    global void execute(SchedulableContext ctx) {
        List<LeadGen__c> leadGenRecords = [SELECT Email_Sent_Date__c FROM LeadGen__c where Email_Sent_Date__c = this_week];
        set<Date> emailUnSentDate = new set<Date>();
        set<Date> emailSentDate = new set<Date>();
         system.debug(leadGenRecords);
        for(LeadGen__c leadgen : leadGenRecords){
           emailSentDate.add(leadgen.Email_Sent_Date__c);
            system.debug(leadgen.Email_Sent_Date__c);
        }
        Date myDate = date.today();
        for(Integer i=5;i>0;i--){
            if(!emailSentDate.contains(myDate-i)){
            emailUnSentDate.add(myDate-i);
                system.debug(myDate-i);
            }
        }
        if(emailUnSentDate.size() > 0)
        {
            RemindLeadGenOwner.sendMail(emailUnSentDate);
        }
    }
    
    public static void sendMail( set<Date> emailUnSentDate ) {
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(RemindLeadGenOwner.getMailAddresses());
        mail.setSubject('Notification : LeadGen Not Created');
        String body = 'Lead Generation not created for the below days of the week.\n\n';
        for(Date mailUnSentDate : emailUnSentDate){
            body=  body+String.valueOf(mailUnSentDate).removeEnd('00:00:00')+'\n';
        }
        body = body+'\n thanks, \n System Admin';
        mail.setPlainTextBody(body);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }
    public static List<String> getMailAddresses(){
        List<String> idList = new List<String>();
        List<String> mailToAddresses = new List<String>(); 
        Group gp = [SELECT (SELECT UserOrGroupId FROM GroupMembers) FROM Group WHERE DeveloperName = 'LeadGen_Notification'];
        for (GroupMember gm : gp.GroupMembers) {
            idList.add(gm.UserOrGroupId);
        }
        List<User> userList = [SELECT Email FROM User WHERE Id IN :idList];
        system.debug(userList);
        for(User u : userList) {
            mailToAddresses.add(u.email);
        } 
        return mailToAddresses;
    }
}