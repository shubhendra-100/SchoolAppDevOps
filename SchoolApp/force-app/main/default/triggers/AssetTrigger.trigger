trigger AssetTrigger on Asset (before insert,before update) {
        /*
    to validate duplicate assedID
    */
    Set<String> setName = new Set<String>();
    Set<String> setExistingName = new Set<String>();
    
    Set<Id> setSoftware = new Set<Id>(); // used for software Software search to get no of licenses allowed.
    For(Asset ass : trigger.new)
    {
        if(Trigger.isUpdate){  
            Asset oldAss = Trigger.oldMap.get(ass.Id);
            
            if(!oldAss.Name.equals(ass.Name)){ //if the old name changed, then only we have to validate the assetID
                setName.add(ass.name);
            }
            setSoftware.add(ass.AMT_Software__c);
        }
        else{
            setName.add(ass.name);
            setSoftware.add(ass.AMT_Software__c);        
        }
        
    }
    
    if(setName.size() > 0 )
    {
        List<Asset> lstAsset = [select name ,id from Asset where name in :setName ];
        
        Map<String ,Asset> mapNameWiseAsset = new Map<String,Asset>();
        For(Asset ass: lstAsset)
        {
            mapNameWiseAsset.put(ass.name ,ass);
        }
        
        For(Asset ass : trigger.new)
        {
            if(mapNameWiseAsset.containsKey(ass.name))
            {
                ass.Name.addError('Name already exist');
            }
        }
        
    }
    
    List<Asset> assetList = [select id,AMT_Software__c,AMT_Software__r.AMT_No_of_Licenses__c from Asset where AMT_Software__c IN:setSoftware];
    map<id,List<Asset>> assetListBySoftware = new map<id,List<Asset>>();
    for(Asset asset: assetList){
        Id assetSoftwareId = asset.AMT_Software__c;
        if(assetListBySoftware.containsKey(assetSoftwareId)){
            assetListBySoftware.get(assetSoftwareId).add(asset);
        }
        else{
            assetListBySoftware.put(assetSoftwareId, new List<Asset>{asset});
        }
    }
    /************ Software Software Licenses should not exceed the Limit in the Asset *************/
    system.debug('assetListBySoftware'+assetListBySoftware);
    Map<id,AMT_Software__c> idWiseSoftware = new Map<id,AMT_Software__c>([select id,AMT_No_of_Licenses__c from AMT_Software__c where id in:setSoftware ]);
    for(Asset asset : Trigger.new){
        AMT_Software__C software = idWiseSoftware.get(asset.AMT_Software__C);
        if(software != null){
            List<Asset> assetList = assetListBySoftware.get(software.id);
            if( !( Trigger.isupdate && (Trigger.oldMap.get(asset.Id).AMT_Software__c.equals(asset.AMT_Software__c))) && assetList != null && !(software.AMT_No_of_Licenses__c >assetList.size())){
                asset.AMT_Software__c.addError('License limit exceeded');
            }
            
        }
    }
}