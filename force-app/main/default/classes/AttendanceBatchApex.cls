global class AttendanceBatchApex implements Database.Batchable<sObject>{
    global Database.QueryLocator start(Database.BatchableContext BC) {
        String strTeacher='Teacher';
        String query = 'Select id,Teacher_Name__c FROM Contact WHERE RecordType.Name=:strTeacher';
        return Database.getQueryLocator(query);
    }
   
    global void execute (Database.BatchableContext BC ,List<Contact> conList){
        List<Attendance__c> attndList = new List <Attendance__c>();

        for(Contact con : conList ){

            Attendance__c attnd = new Attendance__c();
            attnd.Staff_Name__c = con.Id;
            attnd.Date__c = System.today();
            attndList.add(attnd);      
        }
        try{
            insert attndList;
        }
        catch(Exception e){
            System.debug(e);
        }
    }

    global void finish(Database.BatchableContext BC){
        system.debug('Finish');
        // Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        // string address ='subish@sedintechnologies.com';
    
        // mail.setReplyTo(address);
        // mail.setSubject('Batch Process Completed');
        // mail.setPlainTextBody('Batch Process has completed');

        // Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        }
    }