@isTest
public class QuesLiraryCtrl_Test {
	static testMethod void createQuestionRecordTestMethod(){
        //Create Question Library
        Question_Library__c oQL= new Question_Library__c(Name='Global Default',Name__c='Global Default');
        insert oQL;
        List<Question_Library__c> lstQLib = [Select id, Name from Question_Library__c];
		System.assertNotEquals(lstQLib,null);
        System.assertNotEquals(lstQLib.size(),0);
        //Create Question Record 
        Question__c oQue = new Question__c(Name='Test', Name__c='Test 1', Help_Text__c='Test Help Text', Label__c='Question 1', 
            Question_Library__c=oQL.id, Required__c=true, Type__c='TextPlain',Allow_Comment__c=true,Allow_Attachments__c=true);
        insert oQue;
        List<Question__c> lstQutn = [Select id,Type__c from Question__c where id=:oQue.id];
        System.assertNotEquals(lstQutn,null);
        System.assertEquals(oQue.Type__c,lstQutn[0].Type__c);
		Test.startTest();
        	List<Question__c> lstQutnResult = QuesLiraryCtrl.getDefualtLibraryQuestn();
        	System.assertNotEquals(lstQutnResult,null);	
       		System.assertEquals(lstQutnResult.size(),1);
        Test.stopTest();
    }

}