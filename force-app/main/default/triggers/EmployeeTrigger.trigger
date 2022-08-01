trigger EmployeeTrigger on Employee__c (before update) {
    List<Employee__c> employeeList = New List<Employee__c>();
    for(Employee__c emp : Trigger.new){
        if(emp.AMT_Active__c != true){
            employeeList.add(emp);
        }        
    }
    List<Asset> assetList = [select id,Employee_Name__c from Asset where Employee_Name__c IN : employeeList];
    system.debug(assetList + 'AssetList');
    Map<id,List<id>> assetListByEmployee = new Map<id,List<id>>();
    
    if(assetList.size()>0){
        system.debug('if condition entered');
        for(Asset asset : assetList){
            if(assetListByEmployee.containsKey(asset.Employee_Name__c)){
                assetListByEmployee.get(asset.Employee_Name__c).add(asset.Id);
            }
            else{
                assetListByEmployee.put(asset.Employee_Name__c, new List<Id>{asset.Id});
            }
            }                        
        }
    for(id emp :assetListByEmployee.keySet()){
        List<id> assetIdList = assetListByEmployee.get(emp);
        if(assetIdList.size()>0){
            Employee__c empObj = trigger.newMap.get(emp);
            
            empObj.addError('Please remove all the Assets before inactive the Employee');
        }
    }    
}