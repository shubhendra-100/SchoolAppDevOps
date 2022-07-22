({
    doInit: function (component, event, helper) {
        helper.initUsers(component, event, helper);
    },
    
    addSalesManagers: function(component, event, helper) {
         component.set("v.salesManagerList", []);
         component.set("v.addedRows", []);
        component.set("v.showSuccess",false);
        component.set("v.dateNotification","");
        var selectedTarget = component.get("v.selectedTarget");
        var selectedusers = component.get("v.selectedusers");       
        
        var targetQuarterList = [];
        var unsaveTargets = [];
        
        var RowItemList = component.get("v.salesManagerList");
        var addedRowItems = component.get("v.addedRows");
        
        var action = component.get("c.searchSalesManagers");
        action.setParams({
            "TargetId": selectedTarget      
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
           
            if (state === "SUCCESS") {
                var existingSalesManagers = response.getReturnValue(); // Map of{ userid,salesmaanger}
                for (var keyid in existingSalesManagers) {
                    var sm = existingSalesManagers[keyid];
                    addedRowItems.push(keyid);
                    RowItemList.push(sm);
                }
                var action2 = component.get("c.getTarget");
                action2.setParams({
                    "targetID": selectedTarget,                           
                });
                action2.setCallback(this, function(response2){
                    var state = response2.getState();
                    if (state === "SUCCESS") {
                        var target = response2.getReturnValue();
                        var dateString= "Start Date : "+$A.localizationService.formatDate(target.Start_Date__c, "dd MMM yyyy") +" End Date : "+$A.localizationService.formatDate(target.End_Date__c, "dd MMM yyyy");
                        component.set("v.dateNotification",dateString);
                        for (let i = 0; i < selectedusers.length; i++) {
                            	
                            if( !addedRowItems.includes(selectedusers[i])){
                                addedRowItems.push(selectedusers[i]);
                                var usersMAp =  component.get("v.usersMap");
                                
                                console.log( target.Assigned_Target_Amount__c + ' Target amount is');
                                RowItemList.push({
                                        "Name":target.Name+'-'+usersMAp[selectedusers[i]],
                                         "Target__c":selectedTarget,
                                         "User__c":selectedusers[i],
                                });
                              
                                
                            }
                        }
                        console.log(target.Target_Amount__c);
                        component.set("v.targetAmount",(target.Target_Amount__c ));
                        component.set("v.assignedTargetAmount",(target.Assigned_Target_Amount__c) );
                    }
                    component.set("v.salesManagerList", RowItemList);
                    component.set("v.addedRows", addedRowItems);
                    if(RowItemList.length == 0 ){
                        component.set("v.showSuccess",true); 
                        component.set("v.message","records not found");                
                    }
                });
                $A.enqueueAction(action2);  
                
                
            }
            
        });
        $A.enqueueAction(action);
        
    },
    
    SaveAndNew: function(component, event, helper) {
        
        helper.SaveRecord(component, event, helper);
        helper.initUsers(component, event, helper);
    },
    Save: function(component, event, helper) {
        
        helper.SaveRecord(component, event, helper);
        
    },
    Cancel :function(component, event, helper) {
        
        var homeEvent = $A.get("e.force:navigateToObjectHome");
        homeEvent.setParams({
            "scope": "Target_Owner__c"
        });
        homeEvent.fire();
    },
    
    // function for delete the row 
    removeDeletedRow: function(component, event, helper) {
        // get the selected row Index for delete, from Lightning Event Attribute  
        var index = event.getParam("indexVar");
        // get the all List (targetList attribute) and remove the Object Element Using splice method  
       
        var AllRowsList = component.get("v.salesManagerList");
        AllRowsList.splice(index, 1);
        // set the targetList after remove selected row element  
        component.set("v.salesManagerList", AllRowsList);  
        
        //By RAejsh
        var AddedRowsList =component.get("v.addedRows");
         AddedRowsList.splice(index, 1);
        component.set("v.addedRows", AddedRowsList);
        helper.updateUnAssignements(component, event, helper);
    },
     
    updateUnAssignement: function(component, event, helper) {
       helper.updateUnAssignements(component, event, helper);
    
    },
    refresh : function(component, event, helper) {
         component.set("v.targetList", []);
         component.set("v.addedRows", []);
         component.set("v.businessDivsion","");
         component.set("v.targetYear","");
    }
    
})