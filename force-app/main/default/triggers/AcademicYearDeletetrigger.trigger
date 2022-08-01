trigger AcademicYearDeletetrigger on Academic_Year__c (before delete) {
    Map<Id, Academic_Year__c> oldCopy = Trigger.oldMap.clone();
    // Keep only accounts that have at least one contact
    oldCopy.keySet().retainAll(
        new Map<Id, AggregateResult>(
            [SELECT Academic_Year__c Id 
             FROM Admission__c 
             WHERE Academic_Year__c = :Trigger.old 
             GROUP BY Academic_Year__c]).keySet());
    // Show error
    for(Academic_Year__c record: oldCopy.values()) {
        record.addError('You cannot delete an account with contacts.');
    }
}