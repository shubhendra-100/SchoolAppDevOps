public with sharing class saveandnew {
    @AuraEnabled(cacheable=true)
    public static List<Department__c> saved(){
        try {
            
            List<Department__c> li = [SELECT Id, Name,Department_ID__c	 FROM Department__c ORDER BY CreatedDate desc];
			system.debug(li);
            return li;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}