public with sharing class AppSetupController {
	
	@AuraEnabled
	public static String getTemplates() {
		String query='Select Id,Name from Questionnaire__c ORDER BY Name ASC';
		List<sObject> objList = FBUtils.getRecords('Questionnaire__c', 'Id,Name', query);
        return JSON.serialize(objList);
	}

	@AuraEnabled
	public static String getSections(String qid) {
		System.debug('qid::::'+qid);
        String results = '[]';
        if(FBUtils.isSafeField('GKN_FB__Question_Questionnaire__c','Question_Group__c',true,false,false,false) && 
        	FBUtils.isSafeField('GKN_FB__Question_Group__c','Name',true,false,false,false))
        {
        	AggregateResult [] res = [Select count(id),Question_Group__c,MIN(Question_Group__r.Name) sectionName from Question_Questionnaire__c WHERE Questionnaire__c=:qid group by Question_Group__c];
    		results = JSON.serialize(res);
		}
		return results;
	}
}