public with sharing class listSubject {
    @AuraEnabled(cacheable=true)
    public static List<Subject_Course__c> listSubject(){
        try {
           List<Subject_Course__c> Li = [SELECT Id,Name,Lastmodifiedby.Name,LastModifiedDate FROM Subject_Course__c order by CreatedDate desc ];
           return Li;
           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


@AuraEnabled
public static List<Subject_Course__c> deleteAclistTable(List<String> arr) {
    List<Subject_Course__c> str = [SELECT Id FROM Subject_Course__c WHERE Id IN: arr ];
    delete str; 
    return [Select Id, Name,LastModifiedById,LastModifiedDate From Subject_Course__c ];
}


 @AuraEnabled

 public static void deleteSubject(List<String> Ids){

    if(Ids.size() > 0 ){

        delete [Select Id  From Subject_Course__c WHERE Id in: Ids];

        }

    }
}