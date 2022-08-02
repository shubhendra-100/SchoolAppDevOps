global class EmployeeAgreementEmailLog implements Messaging.InboundEmailHandler{
    
  global Messaging.InboundEmailResult handleInboundEmail(Messaging.inboundEmail email, 
                                                       Messaging.InboundEnvelope env){
                                                           
    Messaging.InboundEmailResult result = new Messaging.InboundEmailResult();
   
    Task[] newTask = new Task[0];
 
         String emailSubject = email.subject;
          String employeeID = emailSubject.Substring(emailSubject.indexof('REF-')+4,emailSubject.indexof('AMT'));
            system.debug('employeeID'+employeeID);
            if(!employeeID.equals('') && employeeID!=null ){
                EmailMessage emailMessage = new EmailMessage();
                emailMessage.status = '3';
                emailMessage.relatedToId = ID.valueOf(employeeID.trim());
                emailMessage.fromAddress = email.fromAddress;
                emailMessage.FromName = email.fromName;
                emailMessage.subject = email.subject; // email subject
                emailMessage.htmlBody = email.htmlBody;
                insert EmailMessage;
                 }
   result.success = true;
   
   return result;
  }
}