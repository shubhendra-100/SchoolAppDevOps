public with sharing class promoteStudents {
    @AuraEnabled (cacheable=true)
    public static list<Academic_Year__c> fetchAcademicYear(){
        try {
            return [
                Select Id,From_Year__c,From_Month__c,To_Month__c,To_Year__c from Academic_Year__c	
            ];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // @AuraEnabled (cacheable=true)
    // public static list<Contact> fetchFilterResult(string AyId, string ClId, string SecId){
    //     try {
    //         return [
    //             Select Id,From_Year__c,From_Month__c,To_Month__c,To_Year__c from Academic_Year__c	
    //         ];
            
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }

    @AuraEnabled (cacheable=true)
            public static list<Class__c> fetchClassName(string AcYear){
                try {
                    list<Contact> listcon =[select Id,Class_Name__c, Academic_Year__c from Contact where Academic_Year__c=:AcYear ];
                    list<String> listcls = new list<String>();
                    for(Contact c: listcon){
                        listcls.add(c.Class_Name__c);
                    }
                     return [
                        Select Id,Name from Class__c where Id IN :listcls	
                    ];
                    
                } catch (Exception e) {
                    throw new AuraHandledException(e.getMessage());
                }
            }   
    
            @AuraEnabled
            public static list<section__c> fetchSectionName(String recId){
                try {
                    // system.debug(recId);
                    list<section__c> listSec = [Select Class__r.Id, Id,Name from section__c where Class__r.Id =:recId ORDER BY Name ASC];
                    system.debug(listSec);
                    return [
                        Select Class__r.Id, Id,Name from section__c where Class__r.Id =:recId ORDER BY Name ASC
                    ];
                    
                } catch (Exception e) {
                    throw new AuraHandledException(e.getMessage());
                }
            }

            // @AuraEnabled
            // public static list<Contact> fetchSectionName(String recId, string AcYear){
            //     try {
            //         // system.debug(recId);
            //         list<Contact> listSec = [Select Class_Name__r.Id, Id, Class_Section__r.Name, Class_Section__r.Id, Academic_Year__r.Id from Contact where RecordType.Name= 'Students/Parents' AND Class_Name__r.Id =:recId AND Academic_Year__r.Id=:AcYear ORDER BY Name ASC];
            //         system.debug(listSec);
            //         return listSec;
                    
            //     } catch (Exception e) {
            //         throw new AuraHandledException(e.getMessage());
            //     }
            // }

            @AuraEnabled

            public static list<Contact> fetchStudents(String classId, string sectionId, string acYear){

                try {

                    list<Contact> listStudents = [SELECT Id, Name, Class_Section__r.Name, Class_Name__r.Name,Academic_Year__r.From_Year__c, Academic_Year__r.From_Month__c,
                             Academic_Year__r.To_Year__c,Academic_Year__r.To_Month__c

                                                FROM Contact WHERE RecordType.Name= 'Students/Parents'

                                                AND Class_Name__c =:classId AND Class_Section__c=:sectionId AND Academic_Year__c=:acYear
                                                ORDER BY Name ASC];

                    system.debug(listStudents);

                    return listStudents;

                   

                } catch (Exception e) {

                    throw new AuraHandledException(e.getMessage());

                }

            }  

            
            @AuraEnabled
            public static list<Contact> promote(list<string> idToUpdate,String toClassId, string toSectionId, string toAcYear){
                try {
                    system.debug('idToUpdate'+idToUpdate);

                    list<Contact> listStudents = [SELECT Id, Name, Class_Section__c, Class_Name__c, Academic_Year__c
                                                FROM Contact WHERE RecordType.Name= 'Students/Parents' AND Id IN: idToUpdate 
                                                ];
                                                for(Contact student : listStudents){
                                                  student.Class_Section__c = toSectionId;
                                                  student.Class_Name__c = toClassId;
                                                  student.Academic_Year__c = toAcYear;
                                                }
                    system.debug(listStudents);
                    update listStudents;
                    return listStudents;
                    
                } catch (Exception e) {
                    throw new AuraHandledException(e.getMessage());
                }
            }   
    
    }