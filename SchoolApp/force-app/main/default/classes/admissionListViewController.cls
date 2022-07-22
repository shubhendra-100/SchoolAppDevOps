public with sharing class admissionListViewController {
    @AuraEnabled (cacheable='true')
    public static list<Admission__c> listViewAdmission(){ 
        try {
            return[
            SELECT id,Assign_Classes__c,Assign_Classes__r.Name,Total_No_of_Seats__c,Seats_Filled__c,No_of_Seats_Available__c,
            Admission_Status__c,Starting_Fee__c,LastModifiedById,LastModifiedDate,Admission_Available_on_Website__c	
            FROM Admission__c
        ];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteAdmission(list<id> admissionIds){

        try {
            if(admissionIds.size()>0){
                DELETE[SELECT id FROM Admission__c WHERE id in:admissionIds ];
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Admission__c> searchBarRecords(String keySearch ){
        try{
       
        if(keySearch==''){
        
        return[SELECT id,Assign_Classes__c,Assign_Classes__r.Name,Total_No_of_Seats__c,
        Seats_Filled__c,No_of_Seats_Available__c,
        Admission_Status__c,Starting_Fee__c,LastModifiedById,LastModifiedDate,
        Admission_Available_on_Website__c 
        FROM Admission__c ORDER BY CreatedDate DESC ];
        }
        List<string> searchKeyword = keySearch.split('-');

        string searchKeyword123 = '%' + searchKeyword[0] + '%';
        string searchKeyword456 = '%' + searchKeyword[1] + '%';

           return[SELECT id,Assign_Classes__c,Assign_Classes__r.Name,Total_No_of_Seats__c,
            Seats_Filled__c,No_of_Seats_Available__c,
            Admission_Status__c,Starting_Fee__c,LastModifiedById,LastModifiedDate,
            Admission_Available_on_Website__c	
            FROM Admission__c WHERE Academic_Year__r.From_Year__c  LIKE : searchKeyword123 AND Academic_Year__r.To_Year__c LIKE : searchKeyword456 ORDER BY CreatedDate DESC];  

    }
    catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
 }


@AuraEnabled (cacheable=true)
public static list<Contact> getTeacherNames(String keySearch){
    try {
        if(keySearch==''){
            return[Select id,Teacher_Name__c from Contact WHERE RecordType.Name='Teacher'];
        }
        string searchKeyword = '%' + keySearch + '%';

        return[Select id,Teacher_Name__c From Contact 
        where RecordType.Name='Teacher' AND Teacher_Name__c like:searchKeyword ];

        
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}

@AuraEnabled
public static String  updateRecords(String attendance){
    try {
        System.debug('Before'+attendance);
        Attendance__c n = (Attendance__c)JSON.deserialize(
            attendance, Attendance__c.class);
            System.debug('After'+n);
            //n.Date__c = Date.valueOf('2022-07-22');
            update n;

            System.debug('Dataaa'+n);
      return'';


    } catch (Exception e) {
        System.debug('Errrror'+e.getMessage());
        throw new AuraHandledException(e.getMessage());
    }
}


}