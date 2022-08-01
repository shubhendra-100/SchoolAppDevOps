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
        public static void save(String listcls){
            try{
                system.debug(listcls);
                list<Class__c> classname = new list<Class__c>();
                list<section__c> secname = new list<section__c>();
                list<string> spschool =new List<String>();
                String strMainString = listcls;
                // String strMainString = 'Kindergarten[Pre-KG,LKG,UKG]';
                //   Integer intIndex = strMainString.indexOf('[');
                //   Integer intt = strMainString.indexOf(']');
                //   system.debug(intIndex);
                //   strMainString = strMainString.substring(intIndex + 1,intt);
                 
                //   list<string> res = strMainString.split(',');
                //   list<string> split = strMainString.split('-');
                //   spschool.addAll(split);
                //   spschool.addAll(res);
                  if(strMainString == 'Kindergarten[Pre-KG,LKG,UKG]'){
                    list<string> str = new List<String>{'Pre-KG','LKG','UKG'};
                    spschool.addAll(str);

                  }
                  if(strMainString == 'Lower Primary[1st-5th Std]'){
                    list<string> str = new List<String>{'1','2','3','4','5'};
                    spschool.addAll(str);
                }
                if(strMainString == 'Upper Primary School[6th-10th Std]'){
                    list<string> str = new List<String>{'6','7','8','9','10'};
                    spschool.addAll(str);
                }
                if(strMainString == 'Regulary School[Nursery-10th]'){
                    list<string> str = new List<String>{'Pre-KG','LKG','UKG','1','2','3','4','5','6','7','8','9','10'};
                    spschool.addAll(str);
                }
                if(strMainString == 'K12 School[Nursery-12th]'){
                    list<string> str = new List<String>{'Pre-KG','LKG','UKG','1','2','3','4','5','6','7','8','9','10','11','12'};
                    spschool.addAll(str);
                }
                 
                for(string school:spschool){
                    Class__c cls = new Class__c(Name =  school);
                    cls.Department__c = 'a0F6s000001K8tjEAC';
                    classname.add(cls);
                 }
                insert classname;

                for(Class__c oneClass: classname){
                    for(Integer i=0;i<2;i++){
                        String sectionName = i==0?'A':'B';
                        section__c sec = new section__c(Name= sectionName, Class__c= oneClass.Id);
                        secname.add(sec);
                    }
                    
                }

                insert secname;
    
            } 
             catch (Exception e) {
 
                 System.debug(e.getMessage());
                 throw new AuraHandledException(e.getMessage());
            }
        }
        @AuraEnabled(cacheable=true)
        
        public static List<School_Type__c> showschool(){
            try {
                
                List<School_Type__c> SS = [SELECT Name, Id,LastModifiedBy.Name,LastModifiedDate FROM School_Type__c];
                
                system.debug(SS);
                return SS;
            } catch (Exception e) {

                throw new AuraHandledException(e.getMessage());
            }
        }

        
        
                    
                
         
        }