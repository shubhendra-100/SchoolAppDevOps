({
     SaveRecord: function(component, event, helper) {
        
        var targetList = component.get("v.targetList")
        var flag = false;
         var isNegative= false;
        for (let i = 0; i < targetList.length; i++) {
            var targetAmount = targetList[i].Target_Amount__c;
            if(targetAmount == null || targetAmount =='' || targetAmount == undefined || targetAmount == NaN  ){
                flag = true;
            }
            else if( parseInt( targetAmount) <1){
                isNegative = true;
            }
        }
            
        if(isNegative){
             component.set("v.message","Target Amount should not be negative value") ;
            component.set("v.showError",true);
         }
        else if(flag)
        {
            component.set("v.message","Target Amount is mandotory Field.") ;
            component.set("v.showError",true);
            
        } 
        else if(confirm("Please conform to save the Record")){
            var action = component.get("c.saveTargets");
            action.setParams({
                "ListTarget": component.get("v.targetList")
            });
            // set call back 
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.targetList", []);
                    component.set("v.addedRows", []);
                    component.set("v.businessDivsion",[]);
                    component.set("v.targetYear",[]);
                    component.set("v.message","Records Saved Successfully") ;
                    component.set("v.showSuccess",true);

                }
            });
            $A.enqueueAction(action);
            if(!component.get('v.isSaveAndnew')){
                component.set('v.isSaveAndnew',false);
                var homeEvent = $A.get("e.force:navigateToObjectHome");
                homeEvent.setParams({
                    "scope": "Target__c"
                });
                homeEvent.fire();
            }
        }
    },
    updateUnAssignements: function(component, event, helper) {
        var targets = component.get("v.targetList");
        // console.log(salesManagers + "salesMAnagers");
        var assigneTargetAmount = 0;
        for (let i = 0; i < targets.length; i++) {
            var targetAmount = targets[i].Target_Amount__c;
           
            component.set("v.showError",false);
            if(targetAmount == null || targetAmount =='' || targetAmount == undefined || targetAmount == NaN ){
                continue;
            }
            
             assigneTargetAmount = parseInt(assigneTargetAmount) + parseInt( targetAmount);
              
        }
        component.set("v.assignedTargetAmount", parseInt(assigneTargetAmount));
        
    }
})