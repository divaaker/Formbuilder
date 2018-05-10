public with sharing class UserFormInfoCtrl {
	/**
	 * fetch Questionnaire Form record
	 * @return List of Questionnaire form.
	 */
	@AuraEnabled
    public static List<Questionnaire_Form__c> getQnaireForm() {
    	return [Select id,Name, Assigned_Date__c,Completed_Date__c,Expiration_Date__c,Questionnaire__c, Questionnaire__r.Name,status__c,User__c from Questionnaire_Form__c Order by Assigned_Date__c DESC ];
    }

    /**
     * fetch Questionnaire Form status picklist value
     * @return : list of Questionnaire Form status.
     */
    @AuraEnabled
    public static List<String> getFrmStatusPcklst(){
        List<String> options = new List<String>();
        Schema.DescribeFieldResult fieldResult = Questionnaire_Form__c.status__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for (Schema.PicklistEntry f: ple) {
            options.add(f.getLabel());
        }
        return options;
    }
}