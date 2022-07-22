public with sharing class AddStudent {
    @AuraEnabled
   public static Contact insertStudentRecord(Contact contStudent){

      try {
            insert contStudent;
            return contStudent;
        } catch (Exception exp) {
            throw new AuraHandledException(exp.getMessage());
        }
    }
}