public with sharing class getTeacherId {
      @AuraEnabled(cacheable=true)
      public static List<Contact> editRecord(String id){
            return [ Select Id, Teacher_Name__c, Primary_Email__c, Mobile__c, Status__c, 
                Staff_Id__c, Date_of_Joining__c, Employment_Type__c, ( Select Id, Department__c, Contact__c, Department__r.Name from Dept_Teachers__r where Contact__c = :id ) from Contact where Id = :id ];
      }

      @AuraEnabled
      public static void updateRecords(Contact newRecord, List<Id> department, String conId, List<String> depIds){
            try{
                  system.debug(newRecord);
                  //system.debug(newRecord.Id);
                  update newRecord;
                  String contId = newRecord.Id;

                  List< Dept_Teacher__c> listDelDTC = [SELECT Id, Department__c, Contact__c FROM Dept_Teacher__c WHERE Contact__c=: conId AND Department__c NOT IN:depIds];
                  if(listDelDTC.size() > 0){
                        delete listDelDTC;
                  }

                  List< Dept_Teacher__c> listDTC = new List< Dept_Teacher__c>();    
                  for(Integer i=0; i<department.size(); i++){
                        Dept_Teacher__c DTC = new Dept_Teacher__c();
                        DTC.Contact__c = conId;
                        DTC.Department__c = department[i];
                        listDTC.add(DTC);    
                  } 

                  system.debug('listDTC'+listDTC);
                  
                  if(listDTC.size() > 0){
                      insert listDTC;
                  }
            }
            catch(Exception e) {    
                        system.debug(e.getMessage());
                  throw new AuraHandledException(e.getMessage());
                  // return '{ "success" : false , "message" : "Something went wrong !"}';
              }
      }

//       @AuraEnabled
//         public static void removeDepts(List<Id> deptIds){
//          if(deptIds.size() > 0 ){
//         delete [SELECT Id, Department__c FROM Dept_Teacher__c WHERE Id in: deptIds];
//     }
//}
}