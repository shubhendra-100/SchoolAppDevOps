@isTest
public class EmployeeAgreementEmailLogTest {
    static testMethod void testCaseFromEmail() {
        Messaging.InboundEmail email = new Messaging.InboundEmail() ;
        Messaging.InboundEnvelope env = new Messaging.InboundEnvelope();
        Employee__c employee= new Employee__c(Name='TestUser',AMT_Active__c=true ,Business_Division__c ='EAM',Designation__c ='Developer',Country__c='India',Location__c='Chennai',Unique_Employee_No__c='12324',AMT_Primary_Email__c = 'srajesh278@gmail.com');
        insert employee;
        system.debug('REF-'+employee.id+'AMT Laptop Agreement');
        email.subject = 'REF-'+employee.id+'AMT Laptop Agreement';
        email.fromAddress='Testuser@gmail.com';
        email.htmlBody='Test email';
        env.fromAddress = 'Testuser@gmail.com';
        EmployeeAgreementEmailLog emailHandler = new EmployeeAgreementEmailLog();
        emailHandler.handleInboundEmail(email, env);
    }
    
}