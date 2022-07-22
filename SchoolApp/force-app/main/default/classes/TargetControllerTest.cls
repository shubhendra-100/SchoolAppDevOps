@isTest
public class TargetControllerTest {
    static testMethod void validateTargetController() {
        Business_Division__c newBisdev =  new Business_Division__c();
        newBisdev.Name = 'EVM';
        insert newBisdev;
        Map<String, String> divisionMap =  TargetController.getBusinessDivisions();
        List<String> divNames = divisionMap.Values();
        List<String> UniqueNames = new List<String>{divNames.get(0)+'-FQ1 FY 2018'};
        system.debug(divNames.get(0)+'-FQ1 FY 2018');
        Map<String,Target__C> uniqueNameMap = TargetController.searchTargets(UniqueNames);
        List<Target__C> lt = new List<Target__C>();
        Target__C target ;
        for(integer i = 0 ; i>uniqueNameMap.size() ; i++){
            target = uniqueNameMap.get(divNames.get(0)+'-FQ1 FY 2018');
            lT.add(target);
        }
        TargetController.getPeriod();
        TargetController.saveTargets(lT);
        String formedName = divNames.get(0)+'-FQ1 FY 2018'+System.now();
        target =new Target__C();
        target.Name = formedName;
        target.Unique_Name__c = formedName;
        Set<String> keyset = divisionMap.keySet();
        target.Business_Division__c = keyset.iterator().next();
        
        target.Target_Amount__c = 2300;
        target.Target_year__c = '2018';
        target.Targeted_Quarter__c='FQ1 FY 2018';
        target.Type__c = 'Existing Business';
        insert target;
        TargetController.searchTargets(UniqueNames);
        
        target = [select id,Target_Amount__c from Target__C where id =:target.id];
        System.assertEquals(2300,target.Target_Amount__c);
        delete target;  
        
        //for SalesManager Test
        Business_Division__c newBisdev1 =  new Business_Division__c();
         newBisdev.Name = 'EVM1';
         insert newBisdev1;
         Target__C clonedTarget =new Target__C();
         clonedTarget.Name = 'Test';
         clonedTarget.Unique_Name__c = 'Test';
         clonedTarget.Business_Division__c = newBisdev1.id;
         clonedTarget.Target_Amount__c = 2300;
         clonedTarget.Target_year__c = '2018';
         clonedTarget.Targeted_Quarter__c='FQ1 FY 2018';
         clonedTarget.Type__c = 'Existing Business';
         insert clonedTarget;
         
         MAP<String,String> usersMAp =SalesManagerController.getUsers();
         Target_Owner__c targetOwner = new Target_Owner__c();
         targetOwner.Name = 'TTL-FQ4 FY 2018-'+usersMAp.Values().get(0);
         targetOwner.Unique_Name__c = 'TTL-FQ4 FY 2018-'+usersMAp.Values().get(0);
         targetOwner.Target_Amount__c = 20;
         targetOwner.Target__C = SalesManagerController.getTarget(clonedTarget.Id).id;
         targetOwner.User__c = usersMAp.keySet().iterator().next();
		 insert  targetOwner; 
        try{
         delete SalesManagerController.getTarget(clonedTarget.Id);
        }
        catch(Exception e){
         Map<String,Target_Owner__c> uniqueNamMap =SalesManagerController.searchSalesManagers(targetOwner.Target__C);
         List<Target_Owner__c> lto = new List<Target_Owner__c>();
          lto.add(targetOwner);
          SalesManagerController.saveSalesMangers(lto);
        }
    }
    
}