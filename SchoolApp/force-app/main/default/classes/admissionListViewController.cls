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
public static list<Attendance__c> getTeacherNames(String keySearch){
    try {
        if(keySearch==''){
            return[Select id,Staff_Name__c,Staff_Name__r.Teacher_Name__c,Date__c,Check_In__c,Check_Out__c,Status__c from Attendance__c 
            WHERE createdDate=TODAY ];
        }
        string searchKeyword = '%' + keySearch + '%';

        return[Select id,Staff_Name__c,Staff_Name__r.Teacher_Name__c,Date__c
        ,Check_In__c,Check_Out__c,Status__c from Attendance__c
        WHERE createdDate=TODAY AND Staff_Name__r.Teacher_Name__c like:searchKeyword ];

        
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
            update n;

            System.debug('Dataaa'+n);
      return'';


    } catch (Exception e) {
        System.debug('Errrror'+e.getMessage());
        throw new AuraHandledException(e.getMessage());
    }
} 

@AuraEnabled
public static string deleteFieldValues(String deleteFields){
    try {
        Attendance__c n = (Attendance__c)JSON.deserialize(
            deleteFields, Attendance__c.class);
            n.Check_In__c='';
            n.Check_Out__c='';

            Update n;

            return '';
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
}