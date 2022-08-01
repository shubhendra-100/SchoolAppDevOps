public with sharing class examSchedule {
    @AuraEnabled 
    public static string insertExamsRec(string ExamName, date StartDate, date EndDate, List<string> ClassName){ 
        try {

            List<Exam_Scheduler__c> listExams = new List<Exam_Scheduler__c>();
            system.debug(ClassName);

            for(string str : ClassName){
                Exam_Scheduler__c exam = new Exam_Scheduler__c();
                exam.Name = ExamName;
                exam.Start_Date__c = StartDate;
                exam.End_Date__c = EndDate;
                exam.Class__c = str;
                listExams.add(exam);
            }
             if(listExams.size() > 0){
                insert listExams;
            }
            return '{ "success" : true , "message" : "Successfully created"}';
        } 
        catch(Exception e) {    
           throw new AuraHandledException(e.getMessage());
     }
    }

        @AuraEnabled(cacheable=true)
        public static List<Exam_Scheduler__c> getExamRecords(){
        return [SELECT Id, Name,End_Date__c, Start_Date__c,Class__r.Name FROM Exam_Scheduler__c order by CreatedDate Desc];
        // return [Select Name, Start_Date__c, End_Date__c  FROM ExamClass__c]; //ClassName__r.Name
     }

     @AuraEnabled(cacheable=true)
     public static List<Exam_Scheduler__c> editExamRecord(String id){
           return [ Select Id, Name, Class__r.Name,Start_Date__c, End_Date__c from Exam_Scheduler__c where Id = :id ];
     }

     @AuraEnabled
     public static void updateExamRecords(sObject newExamRecord){
        try {
            update newExamRecord;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
     }
}