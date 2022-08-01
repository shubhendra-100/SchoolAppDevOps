({
    initUsers: function (component, event, helper) {
        var action = component.get("c.getUsers");
        action.setCallback(this, function(response){
            var state = response.getState();
            
            if (state === "SUCCESS") {
                var usersMap = response.getReturnValue();
                var usersList=[];
                for(var userName in usersMap)
                {
                    usersList.push({
                        value: userName,
                        label: usersMap[userName]
                    });
                    
                }
                component.set("v.userList", usersList);
                component.set("v.usersMap", usersMap);
                
                usersMap
                console.log("The userNAmes are"+usersList);
            }
        });
        
        $A.enqueueAction(action);
    },
	SaveRecord: function(component, event, helper) {
          var salesManagerList = component.get("v.salesManagerList")
          var flag = false;
           
        for (let i = 0; i < salesManagerList.length; i++) {
            var targetAmount = salesManagerList[i].Target_Amount__c;
            if(targetAmount == null || targetAmount =='' || targetAmount == undefined || targetAmount == NaN || (parseInt( targetAmount) <1) ){
                flag = true;
            }            
           
        }
         if(flag)
        {
            component.set("v.TargetExceededError",true);                
        } 
        else if(targetAmount > component.get("v.targetAmount") )
            {
                component.set("v.TargetExceededError",false);  
                component.set("v.showError",true);
            }
        else if(confirm("Please conform to save the Record")){        
            component.set("v.TargetExceededError",false);  
            component.set("v.showError",false);
         var action = component.get("c.saveSalesMangers");
        action.setParams({
            "ListSalesOwners": (component.get("v.salesManagerList"))
        });
        
        // set call back 
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log(state + 'state');
            if (state === "SUCCESS") {
                // if response if success then reset/blank the 'targetList' Attribute 
                // and call the common helper method for create a default Object Data to Contact List 
                component.set("v.salesManagerList", []);
                component.set("v.addedRows", []);
                 component.set("v.selectedTarget", null);
                component.set("v.userList",[]);
                component.set("v.selectedusers",[]);
                component.set("v.showSuccess",true); 
                component.set("v.message","Records saved successfully");
                var homeEvent = $A.get("e.force:navigateToObjectHome");
                homeEvent.setParams({
                    "scope": "Target_Owner__c"
                });
                homeEvent.fire();
            }
        });
         
        // enqueue the server side action  
        $A.enqueueAction(action);
        }
    },
    updateUnAssignements: function(component, event, helper) {
        //var assignedSalesManagerAmount = event.getParam("assignedSalesManagerAmount");
        var salesManagers = component.get("v.salesManagerList");
        console.log(salesManagers + "salesMAnagers");
        var assignedSalesManagerAmount = 0;
       
        component.set("v.TargetExceededError",false);  
           
        for (let i = 0; i < salesManagers.length; i++) {
            var targetAmount = salesManagers[i].Target_Amount__c;
            if(targetAmount == null || targetAmount =='' || targetAmount == undefined || targetAmount == NaN ){
                continue;
            }
            
          assignedSalesManagerAmount = parseInt(assignedSalesManagerAmount) + parseInt(salesManagers[i].Target_Amount__c);
            if( assignedSalesManagerAmount > component.get("v.targetAmount") )
            {
                component.set("v.showError",true);
                continue;
            }
            else{
                component.set("v.showError",false);
            }
            
       	 console.log(parseInt(assignedSalesManagerAmount));
        }
       
        component.set("v.assignedTargetAmount", parseInt(assignedSalesManagerAmount));
    
    }
})