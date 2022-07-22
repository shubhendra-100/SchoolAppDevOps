public with sharing class delTeacher {
    @AuraEnabled
    
        public static List<Contact> deleteAclistTable(List<String> arr) {

            List<Contact> str = [SELECT Id from Contact WHERE
        
                                Id IN: arr ];
        
         delete str;
        
                return [Select Teacher_Name__c, Staff_Id__c, Status__c, LastModifiedById, LastModifiedDate From Contact];
        
            }
    }