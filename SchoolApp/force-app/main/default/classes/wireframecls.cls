public with sharing class wireframecls {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
          return [SELECT Id/*, Upload_School_logo__c, Name, Country__c, Street__c, State__c, City_Town__c, PinCode__c,Affiliate_Id__c,
          Shcool_Type__c, Grade_From__c, Grade_To__c, Affiliate_to_Board__c, Language_of_Instruction__c, Status_of_School_Affiliation__c,
          Year_of_School_Establishment__c,School_Affiliation_Granted_On__c, School_Registered_With__c,
          Total_Number_of_Students__c, Board_Type__c,Medium__c,Admission_Open__c,Landline_Number__c,
          Website,Promoted__c,Is_Verified__c,Description,School_Facilities__c*/FROM Account ];     
     }
     @AuraEnabled(cacheable=true)
        public static Map<ID, String> getRelatedFilesByRecordId(String recordId) {
            // Get record file IDs        
            List<ContentDocumentLink> files = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId ];
            List<ID> fileIDs = new List<ID>();
            for (ContentDocumentLink docLink : files) {
                fileIDs.add(docLink.ContentDocumentId);
            }
     
            List<ContentVersion> docs = [SELECT ContentDocumentId, FileExtension, Title 
                FROM ContentVersion WHERE ContentDocumentId IN : fileIDs ORDER BY CreatedDate Desc Limit 1];
            Map<ID, String> mapIdTitle = new Map<ID, String>();
            for (ContentVersion docLink : docs) {
                mapIdTitle.put(docLink.ContentDocumentId, docLink.Title);
            }
            return mapIdTitle;
        }

    @AuraEnabled  
   public static string submitScoreAction(Account accountRec, string file, string fileName) {  
     string accountId;  
     try{ 
        if(accountRec.Id == null){ 
          insert accountRec;
        }
        else{
            update accountRec;
        }
        accountId = accountRec.Id;
        System.debug(accountRec);  
        if(file == null || fileName == null){
          return accountId;
        }
          String base64File = EncodingUtil.urlDecode(file, 'UTF-8');     
          ContentVersion contentVersionRec = new ContentVersion();  
          contentVersionRec.ContentLocation = 'S';
          contentVersionRec.Title = fileName;  
          contentVersionRec.PathOnClient = '/' + fileName;  
          //contentVersionRec.FirstPublishLocationId = accountRec.Id; 
          contentVersionRec.VersionData = EncodingUtil.base64Decode(base64File);  
          contentVersionRec.IsMajorVersion = true;  
          Insert contentVersionRec;        
          
          ContentVersion cv = [select id,ContentDocumentId from ContentVersion where id =: contentVersionRec.id];
          //Create ContentDocumentLink
          ContentDocumentLink cDe = new ContentDocumentLink();
          cDe.ContentDocumentId = cv.contentDocumentId;
          cDe.LinkedEntityId = accountRec.Id;  // you can use objectId,GroupId etc
          cDe.ShareType = 'V'; // Inferred permission, checkout description of ContentDocumentLink object for more details
          //Insert content document link
          insert cDe ;
          
          //ContentDistribution: Represents information about sharing a document externally
          ContentDistribution cd = new ContentDistribution();
          cd.Name = fileName;
          cd.ContentVersionId  = contentVersionRec.Id;
          
          //insert 
          insert cd;
          
          ContentDistribution distribution = [select Name,ContentDownloadUrl from ContentDistribution where id=: cd.id];
          
          Account acc = [select id,Upload_School_logo__c from Account where id=: accountRec.Id]; //upload__Images__c (ARI__ is Namspace. it will be different in your case) 
          if(acc.Upload_School_logo__c == null){
              acc.Upload_School_logo__c ='';
          }
          acc.Upload_School_logo__c += '<img src="'+distribution.ContentDownloadUrl+'" width="478" height="247">'+'</img><br/>'; 
          
          update acc;
          System.debug(acc);
        
      } 
      catch(Exception ex){  
        system.debug('Exception===>'+ex.getMessage());  
      }  
      return accountId;  
   }    
}