public  class addschool {
    @AuraEnabled(cacheable=true)
    public static List<School_Type__c> addschool(){
        try {
            system.debug([Select Id, Name from School_Type__c]);
            return [Select Id, Name from School_Type__c];
        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        } 
    }


        
    

        @AuraEnabled
        public static void save(List<String> listcls){
            try{
                system.debug(listcls);
                list<Class__c> classname = new list<Class__c>();
                list<section__c> secname = new list<section__c>();
                for(string liscls:listcls){

                }
                for(Integer x = 0; x < listcls.size();x++){
                    Class__c cls = new Class__c();
                    cls.Name = listcls[x];
                    classname.add(cls);
                    
            
                }
                insert classname;
                
             for(class__c cl:classname  ){
                section__c sec = new section__c();
                sec.name = 'A';
                sec.Class__c = cl.Id;
                secname.add(sec);

             }
             for(class__c cl:classname  ){
                section__c sec = new section__c();
                sec.name = 'B';
                sec.Class__c = cl.Id;
                secname.add(sec);

             }
             insert secname;
    
            } 
             catch (Exception e) {
 
                 System.debug(e.getMessage());
                 throw new AuraHandledException(e.getMessage());
            }
        }
}