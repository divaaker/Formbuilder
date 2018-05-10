public with sharing class QuestionGroupWithQuestionsWrap {
	
    /** wrapper class for Question Group **/    
    @AuraEnabled public String groupName{get;set;}
    @AuraEnabled public String sectionColNumber{get;set;}
    @AuraEnabled public String groupId{get;set;}
    @AuraEnabled public List<Question__c> lstQuestn{get;set;}
    @AuraEnabled public integer lstSize{get;set;}
    
}