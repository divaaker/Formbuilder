/**
 * 
 */
@isTest
public class ListTemplateCtrl_Test {
    static testMethod void createQniareTestMethod(){
        // Create  Questionnaire record
        Questionnaire__c oQnaireRecord = new Questionnaire__c();
        oQnaireRecord .Name='Template 1';
        oQnaireRecord .Category__c='Healthcare';
        oQnaireRecord .Description__c='Template 1';
        oQnaireRecord.Community_URL__c=URL.getSalesforceBaseUrl().toExternalForm();
        insert oQnaireRecord ;
        System.assertNotEquals(oQnaireRecord,null);
        List<Questionnaire__c> lstQnaire=[Select Id,Name From Questionnaire__c Where Id=:oQnaireRecord.id];
        System.assertEquals(lstQnaire.size(),1); 
        
        //Create Question Library
        Question_Library__c oQL= new Question_Library__c(Name='Global Default',Name__c='Global Default');
        insert oQL;

        //Create Question Record 
        Question__c oQue = new Question__c(Name='Test',Help_Text_Required__c=true, Name__c='Test 1', Help_Text__c='Test Help Text', Label__c='Question 1', 
            Question_Library__c=oQL.id, Required__c=true, Type__c='TextPlain',Allow_Comment__c=true,Allow_Attachments__c=true);
        insert oQue;
        List<Question__c> lstQutn = [Select id,Type__c from Question__c where id=:oQue.id];
        System.assertEquals(oQue.Type__c,lstQutn[0].Type__c);
        
        // Create Question Option
        Question_Option__c qstnOption=new Question_Option__c();
        qstnOption.Name='A';
        qstnOption.Question__c=oQue.id;
        qstnOption.Name__c='A';
        insert qstnOption;
        List<Question_Option__c> lstQutnOptn = [Select id,Name from Question_Option__c where id=:qstnOption.id];
        System.assertEquals(lstQutnOptn.size(),1);
        //Create Question Group record
        
        Question_Group__c oQG = new Question_Group__c(Name='Test Group');
        insert oQG;
        List<Question_Group__c> lstQuGroup = [Select id,Name from Question_Group__c where id=:oQG.id];
        System.assertEquals(oQG.Name,lstQuGroup[0].Name);

        //Create Question Questionnaire Record
        Question_Questionnaire__c oQQuesnaire= new Question_Questionnaire__c(Allow_Attachments__c=oQue.Allow_Attachments__c,Allow_Comment__c=oQue.Allow_Comment__c,
            Questionnaire__c = oQnaireRecord.id,Name=oQnaireRecord.Name,Question_Group__c =oQG.id,Question__c=oQue.id,Question_Order__c=1);
        insert oQQuesnaire;

        List<Question_Questionnaire__c> lstQuestionQnnaire = [Select id,Question__c from Question_Questionnaire__c where id=:oQQuesnaire.id];
        System.assertEquals(oQQuesnaire.Question__c,lstQuestionQnnaire[0].Question__c);
        
        //Create Question Questionnaire Record Without question id
        Question_Questionnaire__c oQQuesnaireWithOutQstn= new Question_Questionnaire__c(Allow_Attachments__c=oQue.Allow_Attachments__c,Allow_Comment__c=oQue.Allow_Comment__c,
            Questionnaire__c = oQnaireRecord.id,Name=oQnaireRecord.Name,Question_Group__c =oQG.id,Question_Order__c=1);
        insert oQQuesnaireWithOutQstn;

        List<Question_Questionnaire__c> lstQuestionQnnaireWithOutQsrn = [Select id,Question__c from Question_Questionnaire__c where id=:oQQuesnaireWithOutQstn.id];
        System.assertEquals(lstQuestionQnnaireWithOutQsrn[0].Question__c,null);
        System.assertEquals(lstQuestionQnnaireWithOutQsrn.size() ,1);
        // Set up a new Questionnaire information 
        Questionnaire__c oQnaire = new Questionnaire__c();
        oQnaire.Name='Template 1';
        oQnaire.Category__c='Healthcare';
        oQnaire.Description__c='Template 1';
        oQnaire.Community_URL__c=URL.getSalesforceBaseUrl().toExternalForm();
        Test.startTest();
            List<String> lstCategory =ListTemplateCtrl.getQuenaireCategory();
            System.assert(lstCategory.size()>0,'exist Categories'); 
            String questnId = ListTemplateCtrl.createQnaire(oQnaire);
            System.assert(questnId != null ,'exist id');
            List<Questionnaire__c> lstQQnaire = [Select id from Questionnaire__c where id=:questnId];
            System.assertNotEquals(lstQQnaire,null);
            System.assertEquals(questnId,lstQQnaire[0].id); 
        	Questionnaire__c qnaire=ListTemplateCtrl.getQnaireRecord(oQnaireRecord.id);
            System.assertNotEquals(qnaire,null);
            ListTemplateCtrl.saveQnaireCloneRecord(qnaire);
            ListTemplateCtrl.QnnairePagerWrapper Questnnaire = ListTemplateCtrl.getListQnaireRecord('ASC','Healthcare','Template 1',1.0,20.0);
            System.assertNotEquals(Questnnaire ,null);
            Integer countOfQuestnnaire = [Select count() from Questionnaire__c];
            System.assertNotEquals(countOfQuestnnaire,0);
            System.assertEquals(Questnnaire.lstQuestionnaire.size(),countOfQuestnnaire); 
            
        Test.stopTest();
    }
}