global with sharing class AttendanceScheduleApex implements Schedulable {
  global void execute (SchedulableContext sc){
    AttendanceBatchApex attndBatchApex =new AttendanceBatchApex();
    Database.executeBatch(attndBatchApex);
  }
}