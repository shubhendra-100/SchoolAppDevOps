public with sharing class createAdmission {
            @AuraEnabled
            public static string admissionName(string admYear,Date admDate,string admStatus,List<String> adminClasses){
                try {
                    List<Admission__c> admissionList = new List<Admission__c>();
                        for(String adminCls:adminClasses){
                            Admission__c admission =new Admission__c();
                            admission.Academic_Year__c=admYear;
                            admission.Admission_Close_Date__c=admDate;
                            admission.Admission_Status__c=admStatus;
                            admission.Assign_Classes__c=adminCls;
                            system.debug(adminCls);
                            admissionList.add(admission);
                        }    
                    system.debug(admissionList);
                    if(admissionList.size()>0){
                        insert admissionList;
                    }
                    return '{\"isSuccess\":true,\"message\":\"Saved Successfully\",\"data\": null}';
                    
                } catch (Exception e) {
                    return '{\"isSuccess\":false,\"message\":\"'+e.getMessage()+'\",\"data\":null}';

                }
            }

            @AuraEnabled (cacheable=true)
            public static list<Academic_Year__c> fetchAcademicYear(){
                try {
                    return [
                        Select id,From_Year__c,From_Month__c,To_Month__c,To_Year__c from Academic_Year__c	
                    ];
                    
                } catch (Exception e) {
                    throw new AuraHandledException(e.getMessage());
                }
            }

            @AuraEnabled (cacheable=true)
            public static list<Class__c> fetchClassName(){
                try {
                    return [
                        Select id,Name from Class__c ORDER BY Name ASC	
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

        }