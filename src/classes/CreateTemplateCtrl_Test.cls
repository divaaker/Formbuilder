@isTest
public class CreateTemplateCtrl_Test {
    static testMethod void createQniareRecordTestMethod(){
        //Create Question Library
        Question_Library__c oQL= new Question_Library__c(Name='Global Default',Name__c='Global Default');
        insert oQL;

        //Create Question Record 
        Question__c oQue = new Question__c(Name='Test',Help_Text_Required__c=true, Name__c='Test 1', Help_Text__c='Test Help Text', Label__c='Question 1', 
            Question_Library__c=oQL.id, Required__c=true, Type__c='TextPlain',Allow_Comment__c=true,Allow_Attachments__c=true);
        insert oQue;
        List<Question__c> lstQutn = [Select id,Type__c from Question__c where id=:oQue.id];
        System.assertEquals(oQue.Type__c,lstQutn[0].Type__c);
        //create Question option record.
        Question_Option__c qOption = new Question_Option__c(Name ='Test',Name__c='test',Score__c=1,Question__c=oQue.id);
        insert qOption; 
		List<Question_Option__c> lstqOption = [Select id,Score__c from Question_Option__c where Question__c=:oQue.id];
        System.assertNotEquals(lstqOption, null);
        System.assertEquals(qOption.Score__c,lstqOption[0].Score__c);
        
        Question__c oQue2 = new Question__c(Name='Test', Name__c='Test 1', Help_Text__c='Test Help Text', Label__c='Question 1', 
            Question_Library__c=oQL.id, Required__c=true, Type__c='TextPlain',Allow_Comment__c=true,Allow_Attachments__c=true,Help_Text_Required__c=true);

        //Create Questionnaire record
        Questionnaire__c oQnaire = new Questionnaire__c();
        oQnaire.Name='Template 1';
        oQnaire.Category__c='Healthcare';
        oQnaire.Description__c='Template 1';
        oQnaire.Community_URL__c=URL.getSalesforceBaseUrl().toExternalForm();
        insert oQnaire;
        List<Questionnaire__c> lstQuQnaire = [Select id,Category__c from Questionnaire__c where id=:oQnaire.id];
        System.assertEquals(oQnaire.Category__c,lstQuQnaire[0].Category__c);

        //Create Question Group record
        
        Question_Group__c oQG = new Question_Group__c(Name='Test Group');
        insert oQG;
        List<Question_Group__c> lstQuGroup = [Select id,Name from Question_Group__c where id=:oQG.id];
        System.assertEquals(oQG.Name,lstQuGroup[0].Name);

        //Create Question Questionnaire Record
        Question_Questionnaire__c oQQuesnaire= new Question_Questionnaire__c(Allow_Attachments__c=oQue.Allow_Attachments__c,Allow_Comment__c=oQue.Allow_Comment__c,
            Questionnaire__c = oQnaire.id,Name=oQnaire.Name,Question_Group__c =oQG.id,Question__c=oQue.id,Question_Order__c=1);
        insert oQQuesnaire;

        List<Question_Questionnaire__c> lstQuestionQnnaire = [Select id,Question__c from Question_Questionnaire__c where id=:oQQuesnaire.id];
        System.assertEquals(oQQuesnaire.Question__c,lstQuestionQnnaire[0].Question__c);
        
        Test.startTest();
            List<String> lstCategoris = CreateTemplateCtrl.getQueCategory();
            System.assert(lstCategoris.size()>0,'exist Categories');

            Question__c questn = CreateTemplateCtrl.getQuesDetail(oQue.id);
            System.assertEquals(questn.id,oQue.id);

            String sDefaultLib = CreateTemplateCtrl.getDefaultQuestnLibraryId();
            System.assert(sDefaultLib != null,'exist Default Library Id');
            List<Question_Library__c> lstQuestnLib = [Select id from Question_Library__c where Name='Global Default'];
            System.assert(lstQuestnLib != null,'exist Default Library');
            System.assertEquals(lstQuestnLib[0].id,sDefaultLib);

            CreateTemplateCtrl.saveEditQuesRecord(oQue);
            List<Question__c> lstQuestion = [Select id,Allow_Comment__c from Question__c where id=: oQue.id];
            System.assertNotEquals(lstQuestion,null);
            System.assertEquals(lstQuestion[0].Allow_Comment__c,true);

            QuestionGroupWithQuestionsWrap questnWrap = CreateTemplateCtrl.getQuestnsForQuesGroup(oQnaire.id,oQG.id);
            System.assertNotEquals(questnWrap,null);
            Integer countQuestnQnaireResult = [Select count() from Question_Questionnaire__c where Questionnaire__c =:oQnaire.id and Question_Group__c=:oQG.id];
            System.assertNotEquals(countQuestnQnaireResult,null);
            System.assertEquals(questnWrap.lstQuestn.size(),countQuestnQnaireResult);

            String templateName = CreateTemplateCtrl.getTemplateName(oQnaire.id);
            System.assertNotEquals(templateName,null);

            String questionnaireName = [Select Name from Questionnaire__c where id=:oQnaire.id].Name;
            System.assertNotEquals(questionnaireName,null);
            System.assertEquals(questionnaireName,templateName);

            List<Question_Questionnaire__c> lstQuesQnaire = CreateTemplateCtrl.getAllQuestnGrpNameForQuesnnaire(oQnaire.id);
            System.assertNotEquals(lstQuesQnaire,null);
            Integer countQutnQnaireResult = [Select count() from Question_Questionnaire__c where Questionnaire__c=:oQnaire.id and Question__c = null];
            System.assertNotEquals(countQutnQnaireResult,null);
            System.assertEquals(lstQuesQnaire.size(),countQutnQnaireResult); 

            CreateTemplateCtrl.createQuestnAndQuestnQnaire(oQnaire.id,oQG.id,oQue2,oQnaire.Name,'1','col1');
            List<Question_Questionnaire__c> lstQuesQnaireResult = [Select id from Question_Questionnaire__c where Questionnaire__c=:oQnaire.id 
            and Question_Group__c =: oQG.id ]; 
            System.assertNotEquals(lstQuesQnaireResult,null);
            System.assertNotEquals(lstQuesQnaireResult.size(),0);
            
            CreateTemplateCtrl.delQuestion(oQQuesnaire.id);
            List<Question_Questionnaire__c> lstQuesQuestnnaireResult = [Select id from Question_Questionnaire__c where id=:oQQuesnaire.id and is_delete__c =true];
            System.assertNotEquals(lstQuesQuestnnaireResult,null);
            System.assertEquals(lstQuesQuestnnaireResult.size(),1);

            CreateTemplateCtrl.createSection('Test Group1',oQnaire.id,'4');
            String groupName = [Select Name from Question_Group__c where Name='Test Group1'].Name ;
            System.assertNotEquals(groupName,null);
            System.assertEquals(groupName,'Test Group1');
        
            Questionnaire__c questnRueslt= CreateTemplateCtrl.getTemplateRecord(oQnaire.id);
            System.assertNotEquals(questnRueslt,null);
            System.assertEquals(questnRueslt.Name,'Template 1');
        
            List<Question_Option__c> lstScoreAndWeight = CreateTemplateCtrl.getScoreAndWeight(oQue.id);
        	System.assertNotEquals(lstScoreAndWeight, null);
        	CreateTemplateCtrl.setpublishStatusOnTemplate(oQnaire.id);
        	List<Questionnaire__c> lstQuQnaireResult = [Select id,Category__c from Questionnaire__c where id=:oQnaire.id and is_Published__c =true];
        	System.assertNotEquals(lstQuQnaireResult, null);
        	CreateTemplateCtrl.deleteSectionWithQuestionsAndQstnQustnry(oQG.id,oQnaire.id);
            List<Question_Group__c> lstQuestnGroup =[Select id,is_Delete__c from Question_Group__c where id=:oQG.id ];
            System.assertNotEquals(lstQuestnGroup,null);
            System.assertEquals(lstQuestnGroup[0].is_Delete__c,true);
        Test.stopTest();
    }
    
    static testMethod void createBranchingRecordTestMethod(){
        //Create Question Library
        Question_Library__c oQL= new Question_Library__c(Name='Global Default',Name__c='Global Default');
        insert oQL;

        //Create Question Record 
        Question__c oQue = new Question__c(Name='Test',Help_Text_Required__c=true, Name__c='Test 1', Help_Text__c='Test Help Text', Label__c='Question 1', 
            Question_Library__c=oQL.id, Required__c=true, Type__c='TextPlain',Allow_Comment__c=true,Allow_Attachments__c=true);
        insert oQue;
        List<Question__c> lstQutn = [Select id,Type__c from Question__c where id=:oQue.id];
        System.assertEquals(oQue.Type__c,lstQutn[0].Type__c);
        //create Question Option
        Question_Option__c qOption = new Question_Option__c(Name ='Option 1',Name__c='Option 1',Question__c =oQue.id);
        insert qOption;
        List<Question_Option__c> listQueOptionData  = [Select id,Name__c from Question_Option__c];
        System.assertNotEquals(listQueOptionData,null);
        System.assertEquals(listQueOptionData.size(),1);
        //Create Questionnaire record
        Questionnaire__c oQnaire = new Questionnaire__c();
        oQnaire.Name='Template 1';
        oQnaire.Category__c='Healthcare';
        oQnaire.Description__c='Template 1';
        oQnaire.Community_URL__c=URL.getSalesforceBaseUrl().toExternalForm();
        insert oQnaire;
        List<Questionnaire__c> lstQuQnaire = [Select id,Category__c from Questionnaire__c where id=:oQnaire.id];
        System.assertEquals(oQnaire.Category__c,lstQuQnaire[0].Category__c);

        //Create Question Group record
        
        Question_Group__c oQG = new Question_Group__c(Name='Test Group');
        insert oQG;
        List<Question_Group__c> lstQuGroup = [Select id,Name from Question_Group__c where id=:oQG.id];
        System.assertEquals(oQG.Name,lstQuGroup[0].Name);

        //Create Question Questionnaire Record
        List<Question_Questionnaire__c> lstQuestionQnnaireAdd = new List<Question_Questionnaire__c>();
        Question_Questionnaire__c oQQuesnaireMain= new Question_Questionnaire__c(Allow_Attachments__c=oQue.Allow_Attachments__c,Allow_Comment__c=oQue.Allow_Comment__c,
            Questionnaire__c = oQnaire.id,Name=oQnaire.Name,Question_Group__c =oQG.id,Question__c=oQue.id,Question_Order__c=1);
        lstQuestionQnnaireAdd.add(oQQuesnaireMain);

        Question_Questionnaire__c oQQuesnaireBranching= new Question_Questionnaire__c(Allow_Attachments__c=oQue.Allow_Attachments__c,Allow_Comment__c=oQue.Allow_Comment__c,
            Questionnaire__c = oQnaire.id,Name=oQnaire.Name,Question_Group__c =oQG.id,Question__c=oQue.id,Question_Order__c=2);
        lstQuestionQnnaireAdd.add(oQQuesnaireBranching);
        Question_Questionnaire__c oQQuesnaireBranchingSecond= new Question_Questionnaire__c(Allow_Attachments__c=oQue.Allow_Attachments__c,Allow_Comment__c=oQue.Allow_Comment__c,
            Questionnaire__c = oQnaire.id,Name=oQnaire.Name,Question_Group__c =oQG.id,Question__c=oQue.id,Question_Order__c=2);
        lstQuestionQnnaireAdd.add(oQQuesnaireBranchingSecond);
        insert lstQuestionQnnaireAdd;
        System.assertNotEquals(lstQuestionQnnaireAdd,null);
        List<Question_Questionnaire__c> lstQuestionQnnaire = [Select id,Question__c from Question_Questionnaire__c where id=:lstQuestionQnnaireAdd[0].id];
        System.assertEquals(lstQuestionQnnaireAdd[0].Question__c,lstQuestionQnnaire[0].Question__c);
        
        //create Questionnaire_Dynamic_Logic record
        Questionnaire_Dynamic_Logic__c QuestnDynLogic = new Questionnaire_Dynamic_Logic__c(Question_Questionnaire__c=lstQuestionQnnaireAdd[0].id,Question_Group__c =oQG.id,Question_Option__c=qOption.id,Show_Question_Questionnaire__c=lstQuestionQnnaireAdd[1].id);
        insert QuestnDynLogic;
        // for insert data
        Questionnaire_Dynamic_Logic__c QuestnDynLogicInsert = new Questionnaire_Dynamic_Logic__c(Question_Questionnaire__c=lstQuestionQnnaireAdd[0].id,Question_Group__c =oQG.id,Question_Option__c=qOption.id,Show_Question_Questionnaire__c=lstQuestionQnnaireAdd[1].id);
        List<Questionnaire_Dynamic_Logic__c> lstQDLData = new List<Questionnaire_Dynamic_Logic__c>();
        lstQDLData.add(QuestnDynLogicInsert);
        System.assertNotEquals(lstQDLData,null);
        List<Questionnaire_Dynamic_Logic__c> lstQDLogic = [Select id from Questionnaire_Dynamic_Logic__c where Question_Questionnaire__c=:lstQuestionQnnaireAdd[0].id and Question_Group__c =:oQG.id and Question_Option__c=:qOption.id];
        System.assertNotEquals(lstQDLogic,null);
        System.assertEquals(lstQDLogic.size(),1);
        Test.startTest();
            List<Questionnaire_Dynamic_Logic__c> lstBranchingQuestn = CreateTemplateCtrl.getBranchingQuestn(oQG.id);
            System.assertNotEquals(lstBranchingQuestn, null);
            System.assertEquals(lstBranchingQuestn.size(),1);
            for(Question_Questionnaire__c obj : lstQuestionQnnaireAdd){
                obj.question_order__c = 1;
            }
        	CreateTemplateCtrl.setQuestnQnniareOrder(lstQuestionQnnaireAdd);
        	System.assertNotEquals(lstQuestionQnnaireAdd, null);
        	System.assertEquals(lstQuestionQnnaireAdd[0].question_order__c, 1);
        Test.stopTest();
    }
}