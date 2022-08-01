public with sharing class BadgeController {
    @AuraEnabled(cacheable=true)
    public static List<sObject> badgeCounter(String objApiName) {
        String myQuery = null;
        if(objApiName != null && objApiName != ''){
            system.debug(objApiName);
            if(objApiName == 'ContactTeacher'){
                String RecordType = 'Teacher';
                return [SELECT Id, RecordType.Name FROM Contact WHERE RecordType.Name=: RecordType];
            }
            else if(objApiName == 'ContactStudent'){
                String RecordType = 'Students/Parents';
                return [SELECT Id, RecordType.Name FROM Contact WHERE RecordType.Name=: RecordType];
            }
            else{
                myQuery = 'SELECT Id, Name FROM ' + objApiName;
            }
        }
        List<sObject> objList = database.query(myQuery);
        return objList;
    }
}