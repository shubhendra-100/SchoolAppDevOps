public with sharing class getStudent {
    @AuraEnabled(cacheable=true)
      public static List<Contact> editStudent(String id){
            return [ Select Id, FirstName, MobilePhone, Date_of_Joining__c, Address1__c,Roll_Number__c,
            Address2__c, LastName, Middle_Name__c, Email,Date_of_Birth__c,Gender__c,Blood_Group__c,Nationality__c,
            State__c,Pincode__c,City_Town__c,Status__c,Father_s_Contact_Number__c,Father_s_Name__c,Father_s_Occupation__c,
            Mother_s_Contact_Number__c,Mother_s_Name__c,Mother_s_Occupation__c,Guardian_s_Contact_Number__c,Guardian_s_Name__c,Guardian_s_Occupation__c,
            Class_Name__r.Name, Class_Section__r.Name from Contact where Id = :id ];
      }

      @AuraEnabled
      public static void updateStudents(Contact newRecord, String conId){
            try{
                  update newRecord;
            }
            catch(Exception e) {    
     
                  throw new AuraHandledException(e.getMessage());
                  // return '{ "success" : false , "message" : "Something went wrong !"}';
              }
      }
}