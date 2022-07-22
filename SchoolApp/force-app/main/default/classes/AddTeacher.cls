public with sharing class AddTeacher {
    @AuraEnabled
    public static string insertTeacherRecord(string TeacherName, string PrimaryEmail, List<String> DepartmentName,string Mobile){
        try {
            
            Contact contobj = new Contact();
            contobj.Teacher_Name__c = TeacherName;
            contobj.LastName = TeacherName;
            contobj.Primary_Email__c = PrimaryEmail;
            contobj.Mobile__c = Mobile;
            insert contobj;

            List< Dept_Teacher__c> listDTC = new List< Dept_Teacher__c>();
            for(Integer i=0; i<DepartmentName.size(); i++){
                Dept_Teacher__c DTC= new Dept_Teacher__c();
                DTC.Contact__c = contobj.Id;
                DTC.Department__c = DepartmentName[i];
                listDTC.add(DTC);    
            }

            system.debug('listDTC'+listDTC);
            
            if(listDTC.size() > 0){
                insert listDTC;
            }
            
            // return contobj.Teacher_Name__c;
            return '{ "success" : true , "message" : "Successfully created"}';
        } 
        catch(Exception e) {    
           
            throw new AuraHandledException(e.getMessage());
            // return '{ "success" : false , "message" : "Something went wrong !"}';
        }
    }
}



// @AuraEnabled
//     public static string insertTeacherRecord(string TeacherName, string PrimaryEmail, List<String> DepartmentName,string Mobile){
//        try {
//         system.debug('TeacherName:'+TeacherName);
//         system.debug('PrimaryEmail:'+PrimaryEmail);
//         system.debug('Mobile:'+Mobile);
//         system.debug('DepartmentName:'+DepartmentName);
//       //List<Department__c> deptList= [Select Name,Id from Department__c where  Id in:DepartmentName];

//         List<contact> listCon = new List<contact>();
        
//         for(Integer i=0; i<DepartmentName.size(); i++){
      
//             Contact contobj = new Contact();
//             contobj.Teacher_Name__c = TeacherName;
//             contobj.LastName = TeacherName;
//             contobj.Departments__c = DepartmentName[i];
//             contobj.Primary_Email__c = i+ PrimaryEmail;
//             contobj.Mobile__c = Mobile;
//             listCon.add(contobj);
            
//     }

//         system.debug('listCon'+listCon);
           
//         //system.debug(DepartmentName);
//         if(listCon.size() > 0){
//             insert listCon;
//         }
           
//             // return contobj.Teacher_Name__c;
//             return '{ "success" : true , "message" : "Successfully created"}';
//         } 
//         catch (Exception e) {    
           
//             return '{ "success" : false , "message" : "Something went wrong !"}';
//             // throw new AuraHandledException(e.getMessage());
//         }
//     }