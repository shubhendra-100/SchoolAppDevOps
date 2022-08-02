public with sharing class listClass {
    @AuraEnabled(cacheable=true)
    public static List<Section__c> listClass(){
        try {
           //List<Class__c> classes = [SELECT Id, Name, Class_Section__c, (SELECT Name FROM Sections__r), LastModifiedBy.Name FROM Class__c ORDER by CreatedDate DESC];
           List<Section__c> Sectionss = [SELECT Name, Class__r.Name, LastModifiedBy.Name FROM Section__c ORDER by CreatedDate DESC];
           system.debug(Sectionss);
           return Sectionss;
           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Class__c> delClass(List<String> recId){
        try {
            delete [SELECT Id FROM Section__c WHERE Id IN:recId];
            return [SELECT Class_Section__c,Name,LastModifiedBy.Name FROM Class__c ];
            
         } catch (Exception e) {
             throw new AuraHandledException(e.getMessage());
         }
    }

    @AuraEnabled(cacheable=true)
    public static integer noOfClassRec(){
        try {
            integer count= database.countQuery('select count() from section__c');
            return count;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<string> editClasss(List<String> recId){
        Section__c SelectedSec =[SELECT Id, Name, Class__r.Department__c, Class__r.Name FROM section__c WHERE Id IN: recId];
        string SelRecId = SelectedSec.Class__r.Department__c;
        Class__c ClsWithDept = [SELECT Department__r.Name FROM Class__c WHERE Id =: SelRecId];
        List<string> ReturnList = new List<string>();

        try {
            System.debug('selRec------->'+SelectedSec);
            System.debug('SelRecId------->'+SelRecId);
            System.debug('ClsWithDept------->'+ClsWithDept);

            string Name = SelectedSec.Name;
            string classsName = SelectedSec.Class__r.Name;
            String SelectedDept = ClsWithDept.Department__r.Name;
            ReturnList.add(Name);
            ReturnList.add(classsName);
            ReturnList.add(SelectedDept);
            
            return ReturnList; 
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}