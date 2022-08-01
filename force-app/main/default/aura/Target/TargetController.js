({
    
    doInit: function(component, event, helper) {
        
        var action = component.get("c.getBusinessDivisions");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.divisionMAP",response.getReturnValue());
                
            }
        });
        $A.enqueueAction(action); 

        var mapPeriod = null;
        var getPeriodAction = component.get("c.getPeriod");
        getPeriodAction.setCallback(this, function(response2){
            var state = response2.getState();
            if (state === "SUCCESS") {
                mapPeriod = response2.getReturnValue();
                component.set('v.periodMAP',mapPeriod);
            }
        });
        $A.enqueueAction(getPeriodAction);
        
        
    },
    
    addTargetRows: function(component, event, helper) {
        component.set("v.showSuccess",false);
        component.set("v.targetList", []);
        component.set("v.addedRows", []);
        var divisionMAP = component.get("v.divisionMAP");
        var businessDivsion = component.get("v.businessDivsion");
        var targetYear = component.get("v.targetYear");
        var type =  component.get("v.type");
        if( businessDivsion != null && businessDivsion != '' && targetYear != ''  ){
            component.set("v.showError",false);
            var businessDivisionName = divisionMAP[businessDivsion]; // to generate businessDivisionName in rows 
            var targetQuarterList = [];
            var uniqueNameCheckList = [];
            for (var index = 1; index <=4; index++) { 
                var FullyQualifiedLabel ="FQ"+index+" FY "+targetYear;
                targetQuarterList.push(FullyQualifiedLabel);
                uniqueNameCheckList.push(businessDivisionName+"-"+FullyQualifiedLabel);           
            } 
            var action = component.get("c.searchTargets");
            action.setParams({
                "uniqueName": uniqueNameCheckList
            });
            var RowItemList = component.get("v.targetList");
            var addedRowItems = component.get("v.addedRows");
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var existingTargetsMap = response.getReturnValue(); // Map : {divisionName-FQ3 FY 2020,Sobject}
                    var assigneTargetAmount = 0; // for assigned Target amount total
                    var mapPeriod = component.get('v.periodMAP');
                    for(var index in targetQuarterList){
                        var qaurterName = targetQuarterList[index];
                        console.log(qaurterName + 'targets are');
                        if( !addedRowItems.includes(uniqueNameCheckList[index])){
                            addedRowItems.push(uniqueNameCheckList[index]);
                            if(uniqueNameCheckList[index] in existingTargetsMap){
                                var existingTarget = existingTargetsMap[uniqueNameCheckList[index]];
                                RowItemList.push(existingTarget);
                                // for assigned Target amount total
                                var targetAmount = existingTarget.Target_Amount__c;
                                if(targetAmount == null || targetAmount =='' || targetAmount == undefined || targetAmount == NaN ){
                                    continue;
                                }
                                assigneTargetAmount = parseInt(assigneTargetAmount) + parseInt(targetAmount);
                                component.set("v.assignedTargetAmount", parseInt(assigneTargetAmount));
                                
                            }else{
                                 
                                var period = mapPeriod[qaurterName];
                                RowItemList.push({
                                    'Name' : businessDivisionName+"-"+qaurterName,
                                    'Business_Division__c': businessDivsion,
                                    'Target_year__c': targetYear,
                                    'Targeted_Quarter__c':qaurterName,
                                    'Type__c' : type,
                                    'Target_Amount__c': '', 
                                    'Start_Date__c':period.StartDate,
                                    'End_Date__c': period.EndDate
                                });
                                 component.set("v.assignedTargetAmount",assigneTargetAmount);
                            }
                        }
                    }
                    component.set("v.targetList", RowItemList);
                    component.set("v.addedRows", addedRowItems);
                }
            });
            $A.enqueueAction(action);
        }
        else	
        {
            component.set("v.message","Please fill the required fields To Search") ;
            component.set("v.showError",true);
            component.set("v.assignedTargetAmount", []);
        }
    },
    
    
    SaveAndNew: function(component, event, helper) {
        component.set('v.isSaveAndnew',true);
        helper.SaveRecord(component, event, helper);
    },
    Save: function(component, event, helper) {
        helper.SaveRecord(component, event, helper);
       
    },
    Cancel :function(component, event, helper) {
        
        var homeEvent = $A.get("e.force:navigateToObjectHome");
        homeEvent.setParams({
            "scope": "Target__c"
        });
        homeEvent.fire();
    },
    updateUnAssignement: function(component, event, helper) {
        helper.updateUnAssignements(component, event, helper);
        
    },
    
    
    removeDeletedRow: function(component, event, helper) {
        component.set("v.showError",false);   
        var index = event.getParam("indexVar");
        var AllRowsList = component.get("v.targetList");
        AllRowsList.splice(index, 1);
        component.set("v.targetList", AllRowsList);  
        var AddedRowsList =component.get("v.addedRows");
        AddedRowsList.splice(index, 1);
        component.set("v.addedRows", AddedRowsList);
        helper.updateUnAssignements(component, event, helper);
    }
    
})