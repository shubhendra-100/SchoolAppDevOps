@isTest
public class SoftwareTriggerTest {
    @isTest
    static void ValidateSoftwareTrigger() {
        
        AMT_Software__c software = new AMT_Software__c(Name= 'software',AMT_Date_of_Purchase__c = Date.today(),AMT_License_Type__c = 'Perpetual License',AMT_No_of_Licenses__c = 5);
        insert software;
        AMT_Software__c software2 = new AMT_Software__c(Name= 'software2',AMT_Date_of_Purchase__c = Date.today(),AMT_License_Type__c = 'Perpetual License',AMT_No_of_Licenses__c = 9);
        insert software2;
        Id recTypeId = Schema.getGlobalDescribe().get('Asset').getDescribe().getRecordTypeInfosByName().get('Software').getRecordTypeId();
        Employee__c employee  = new Employee__c(Name='Employee1',Unique_Employee_No__c='100',AMT_Primary_Email__c='Test@org.com', Business_Division__c='ECM',Designation__c='Technical Consultant',Country__c='India',Location__c='Chennai');
        insert employee;
        Asset asset = new Asset(Name = 'asset', Business_Division__c = 'ECM',recordTypeId =RecTypeId ,Employee_Name__c=employee.Id,AMT_Software__c=software.id);
        insert asset;
        system.debug('asset name'+asset.Name);
        Asset asset1 = new Asset(Name = 'asset1', Business_Division__c = 'ECM',recordTypeId =RecTypeId ,Employee_Name__c=employee.Id,AMT_Software__c=software.id);
        insert asset1;
        system.debug('asset name'+asset1.Name);
        Asset asset2 = new Asset(Name = 'asset1', Business_Division__c = 'ECM',recordTypeId =RecTypeId ,Employee_Name__c=employee.Id,AMT_Software__c=software.id);
		Database.SaveResult result = Database.insert(asset2, false);//name duplicate && licence exceeded error
        System.assertEquals('Name already exist',result.getErrors()[0].getMessage());
        //System.assertEquals('License limit exceeded',result.getErrors()[1].getMessage());
        asset2.Name = 'asset2';
        asset2.AMT_Software__c=software2.id;
        insert asset2;
        asset2.Name = 'asset1';
        result = Database.insert(asset2, false);
        software.AMT_No_of_Licenses__c = 1;
        result = Database.update(software, false); 
        asset1.AMT_Software__c=software2.id;
        result = Database.insert(asset1, false);
    }

}