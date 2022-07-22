trigger SoftwareTrigger on AMT_Software__c (before update) {
    
    set<AMT_Software__c> setAssetSoftware = new set<AMT_Software__c>();
     for(AMT_Software__c assetSoftware : Trigger.new){
        if(assetSoftware.AMT_No_of_Licenses__c !=null){
            setAssetSoftware.add(assetSoftware);
        }
    }
    List<Asset> assetList = [select id,AMT_Software__c from Asset where AMT_Software__c IN:setAssetSoftware];
    system.debug('assetList'+assetList);
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
    
    for(AMT_Software__c assetBrand : Trigger.new){
         
		List<Asset> assetList = assetListBySoftware.get(assetBrand.id);
        if((assetList!= null) && assetList.size() > assetBrand.AMT_No_of_Licenses__c){
            assetBrand.addError('Please reduce the assigned Licence count in asset to update');
        }
    }
    
}