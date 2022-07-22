@isTest
private class EmployeeTriggerTest{

    @isTest static void employee() {
        try{
        Employee__c emp = new Employee__c();
        emp.Name = 'Test';
        emp.Unique_Employee_No__c = 'Test123';
        emp.Business_Division__c ='EAM';
        emp.Designation__c = 'Technical Consultant';
        emp.Country__c = 'India';
        emp.Location__c = 'Chennai';
        emp.AMT_Primary_Email__c = 'Test@test.com';
        emp.AMT_Active__c = true;
        insert emp;
        AMT_Asset_Brand__c assetBrand = new AMT_Asset_Brand__c();
        assetBrand.Name = 'TestBrand';
        insert assetBrand; 
        insertAsset('Test1',emp.id,assetBrand.id);
        insertAsset('Test2',emp.id,assetBrand.id);
        emp.AMT_Active__c = false;
        update emp;
        }
        catch(DmlException exc){
            system.debug('exception'+exc);
        }
    }
     static void insertAsset( String assetname, Id empId,Id assetBrandID ){
        Asset asset = new Asset();
        asset.name = assetname;
        asset.RecordTypeId =Schema.SObjectType.Asset.getRecordTypeInfosByName().get('Desktop').getRecordTypeId();
        asset.Employee_Name__c = empId;
        asset.Business_Division__c = 'EAM';
        asset.Category__c = 'Desktop';
        asset.Asset_Brand__c = assetBrandID;
        insert asset;    
        
    }
    
}