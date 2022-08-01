public with sharing class insertNewClass {
    @AuraEnabled
    public static string insertNewClass(string ClassName, string DeptID, string ClassSection){

        try{

        List<string> ClsSections = ClassSection.split(',');

        List<Section__c> SectionsToInsert = new List<Section__c>();

        List<Class__c> listCls = [SELECT Id, Name FROM Class__c WHERE Name LIKE: ClassName];

        if(listCls.isEmpty()){
            
        Class__c newClass = new Class__c(Department__c= DeptID, Name= ClassName);
        insert newClass;
        
        for(String sec : ClsSections){
            Section__c newSections = new section__c(Class__c=newClass.Id, Name=sec);
            SectionsToInsert.add(newSections);
        }
            insert SectionsToInsert;
            //return newClass;
        }

        else{
            for(String sec : ClsSections){
                for (Class__c clsss : listCls){
                Section__c newSections = new section__c(Class__c=clsss.Id, Name=sec);
                SectionsToInsert.add(newSections);
                }
            }
                insert SectionsToInsert;
        }

        return 'success';

    }

        catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

    }
    
    public static void classDelete(section__c sec){
            integer count= database.countQuery('SELECT count() FROM section__c WHERE Class__c=sec.Class__c');
            if (count==0){
                Class__c selectedClass =[SELECT Id FROM Class__c WHERE Id=:sec.Class__c];
                delete selectedClass;
            }
        }
}