trigger TriggerQuestionnaire on Questionnaire__c (after insert) {
	/*
    try{
        Questionnaire__c oQnaire = Trigger.New[0];
        
        //Create default Question Group
        Question_Group__c oQGrp = new Question_Group__c(Name='Default Section',Sort_Order__c=0);
        insert oQGrp;
        
        Question_Questionnaire__c oQueQnaire = new Question_Questionnaire__c(Name=oQnaire.Name,Question_Group__c=oQGrp.id,Questionnaire__c=oQnaire.id);
        insert oQueQnaire;        
    }
    catch(Exception ex){
        throw new AuraHandledException(ex.getMessage());
    } */
}