public with sharing class PreviewCtrl {
	
    /**
     * fetch Quentions record behalf of Questionnaire Id and Question group id.
     * @param  qnaireId   : Questionnaire id
     * @param  sectionId  : Question Group id.
     * @return            : List of the questions of particular Question Group
     */
    
    @AuraEnabled
    public static QuestionGroupWithQuestionsWrap getQuestnsForQuesGroup(String qnaireId,String sectionId) {
        QuestionGroupWithQuestionsWrap oQGWQuesWrap = new QuestionGroupWithQuestionsWrap();
       
        if (String.isNotBlank(qnaireId)) {
            
            String sQuery = 'Select id,Question_Group__c,Question__c,Question_Group__r.Name,Question_Group__r.No_Of_Columns__c From Question_Questionnaire__c WHERE is_Delete__c=false and Questionnaire__c = \''+Id.valueOf(qnaireId)+'\'';
            if(String.isNotBlank(sectionId)){
                sQuery += ' AND Question_Group__c =\''+Id.valueOf(sectionId)+'\'';
            }
            List<Question_Questionnaire__c> lstQuesQuestionnaire = Database.query(sQuery);
            List<String> lstQuesId = new List<String>();
            
            // Get the question group(section) id and add all the questions in to list behalf of the this question group id.
            
            for(Question_Questionnaire__c qustnQnaire: lstQuesQuestionnaire){
                if(String.isBlank(sectionId)){
                    sectionId=qustnQnaire.Question_Group__c;
                }
                if(String.isNotBlank(sectionId) && qustnQnaire.Question_Group__c == sectionId){
                    lstQuesId.add(qustnQnaire.Question__c);
                    oQGWQuesWrap.groupName = qustnQnaire.Question_Group__r.Name;
                    oQGWQuesWrap.sectionColNumber = (String.isNotBlank(qustnQnaire.Question_Group__r.No_Of_Columns__c)?qustnQnaire.Question_Group__r.No_Of_Columns__c:'0');
                    oQGWQuesWrap.groupId = sectionId;
                }   
            }
            // Retrive all the questions from Question object.
            if(lstQuesId != null && lstQuesId.size()>0){
               oQGWQuesWrap.lstQuestn = new List<Question__c>([Select Id, Label__c,Step_Size__c,Default_Value__c,Maximum_value__c,Minimum_Value__c,Allow_Currency__c,Currency_Symbol__c,Decimal_value__c
                                                              ,Metadata__c,lookup_Object_Field_Name__c,lookup_Object_API_Name__c,(Select id,Currency_Symbol__c,Metadata__c,Allow_Currency__c
                                                             ,Decimal_value__c,Help_Text__c,Max_Char_Length__c,lookup_Object_API_Name__c,lookup_Object_Field_Name__c, Allow_Attachments__c,Allow_Comment__c
                                                             ,Help_Text_Required__c,Related_To_Column__c,Required__c,Step_Size__c,Default_Value__c,Maximum_value__c,Minimum_Value__c,Weight__c from Question_Questionnaires__r 
                                                             where Questionnaire__c =:qnaireId and Question_Group__c =:sectionId and is_Delete__c=false  LIMIT 1), 
                                                Help_Text__c, Type__c,Allow_Attachments__c,Allow_Comment__c,Max_Char_Length__c,Help_Text_Required__c,Required__c,
                                                (Select id,Value__c,Name__c,Score__c from Question_Options__r order by createddate asc) 
                                                              From Question__c WHERE id IN :lstQuesId and is_Delete__c=false]);
                
            }
        }
		
        /*
         * Set<String> questionId = null;

                Map<Id,Questionnaire_Form__c> qformList = new Map<Id,Questionnaire_Form__c>([Select id from Questionnaire_Form__c Where User__c=:UserInfo.getUserId() AND Questionnaire__c=:qnaireId]);

                List<Question_Response__c> qresponseList = [Select id,IsComment__c,Answer__c,Questionnaire__c,Questionnaire_Form__c,Score__c,User__c,Question_Questionnaire__c from Question_Response__c 
                    WHERE User__c=:UserInfo.getUserId() AND Questionnaire__c=:qnaireId AND Questionnaire_Form__c IN:qformList.keySet()];
		*/
        
        return oQGWQuesWrap;
    }
    
    /**
    wrapper class for Question Group

    **/
    public class QuestionGroupWithQuestionsWrap{
        @AuraEnabled public String groupName{get;set;}
        @AuraEnabled public String sectionColNumber{get;set;}
        @AuraEnabled public String groupId{get;set;}
        @AuraEnabled public List<Question__c> lstQuestn{get;set;}
    }
    
    /**
     * fetch Questionnaire(Template) record
     * @param  qnaireId : Questionnaire Id.
     * @return           : Questionnaire record
     */
    @AuraEnabled
    public static Questionnaire__c getTemplateRecord(String qnaireId) {
        if(String.isNotBlank(qnaireId)){
            List<Questionnaire__c> lstQuestnnaire = new List<Questionnaire__c>([Select Name,Description__c,Version__c,Category__c from Questionnaire__c WHERE Id=:qnaireId]);
            if(lstQuestnnaire != null && lstQuestnnaire.size()>0){
                return lstQuestnnaire[0];
            }
            
        }
        return new Questionnaire__c(); 
    }
    /**
     * fetch Questionnaire(Template) name
     * @param  qnaireId : Questionnaire Id.
     * @return           : Questionnaire name
     */
    public static String getTemplateName(String qnaireId) {
         return [Select Name from Questionnaire__c WHERE Id=:qnaireId].Name;
    }
    
    
    /**
     * fetch all Question Group for Questionnaire
     * @param  sQnaireId : set Questionnaire id.
     * @return           : All Question Group name for Questionnaire.
     */
     @AuraEnabled
     public static List<Question_Questionnaire__c> getAllQuestnGrpNameForQuesnnaire(String sQnaireId) {
            List<Question_Questionnaire__c> lstQuestnQnaire = new List<Question_Questionnaire__c>();
            if (String.isNotBlank(sQnaireId)) {
                lstQuestnQnaire  = new List<Question_Questionnaire__c>([SELECT
                         Question_Group__c, Question_Group__r.Name__c, Question_Group__r.Name, Question_Group__r.Sort_Order__c
                        From Question_Questionnaire__c WHERE Questionnaire__c =:sQnaireId and Question__c =null and is_Delete__c=false ORDER by Question_Group__r.CreatedDate asc]);  
                
            }
            return lstQuestnQnaire;
     }
    /**
     * fetch Question Categories picklist value
     * @return : list of Question Category.
     */
    @AuraEnabled
    public static List<String> getQueCategory(){
        List<String> options = new List<String>();
        Schema.DescribeFieldResult fieldResult = Question__c.Category__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for (Schema.PicklistEntry f: ple) {
            options.add(f.getLabel());
        }
        return options;
    }

     /**
     * Create question and question questionnaire.
     * @param  qnaireId: Questionnaire id.
     * @param  qGroupId: Question group id.
     * @param  question: Question object values.
     * @param  qnaireName : Questionnaire name.
     * @param  qOrder: Order of question.
     * @param  colNumber: column number of question.
     */
    @AuraEnabled
    public static void createQuestnAndQuestnQnaire(String qnaireId,String qGroupId,Question__c question,String qnaireName,String qOrder,String colNumber){
        try{
            String sQLib = CreateTemplateCtrl.getDefaultQuestnLibraryId();
            question.Name__c = question.Label__c;
            question.Related_To_Column__c = colNumber;
            if(String.isNotBlank( sQLib)){
                question.Question_Library__c = sQLib; 
            }
            question.Name = qOrder;
            insert question;
            Question_Questionnaire__c oQQuesnaire= new Question_Questionnaire__c(Required__c=question.Required__c,Related_To_Column__c=colNumber,Help_Text__c=question.Help_Text__c,Help_Text_Required__c=question.Help_Text_Required__c,Category__c=question.Category__c,Allow_Attachments__c=question.Allow_Attachments__c,Allow_Comment__c=question.Allow_Comment__c,Questionnaire__c = qnaireId,Name=qnaireName,Max_Char_Length__c =question.Max_Char_Length__c,Question_Group__c =qGroupId,Question__c=question.id,Question_Order__c=Integer.valueOf(qOrder));
            insert oQQuesnaire;
        }
        catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        } 
    }
    /**
     * Deleting Question and Question Questionnaire record.
     * @param  quesId : question record id
     * 
     */
    @AuraEnabled
    public static void delQuestion(String questnQuestnnaireId) {
        if (String.isNotBlank(questnQuestnnaireId)) {
            List<Question_Questionnaire__c> lstQQnaire = new List<Question_Questionnaire__c>([select id,is_delete__c,Question__c,
                    Question__r.Is_Approve_For_Library__c from Question_Questionnaire__c where id=:questnQuestnnaireId]);
            if(lstQQnaire != null && lstQQnaire.size()>0){
                lstQQnaire[0].is_delete__c =true;
                update lstQQnaire;
                if(lstQQnaire[0].Question__c != null && lstQQnaire[0].Question__r.Is_Approve_For_Library__c==false){
                    List<Question__c> lstQuestn =[Select id,is_delete__c from Question__c where id =:lstQQnaire[0].Question__c];
                    if(lstQuestn != null && lstQuestn.size()>0){
                        lstQuestn[0].is_delete__c =true; 
                        update lstQuestn;
                    }
                    //delete new Question__C(id=quesId); 
                }
            }
        }
        
    }
    /**
     * fetch a question detail
     * @param  sQuesId : Question record id
     * @return          question detail
     */
    @AuraEnabled
    public static Question__c getQuesDetail(String quesId) {
        if (String.isNotBlank(quesId)) {
            return [Select Id, Label__c, lookup_Object_Field_Name__c,Step_Size__c,Default_Value__c,Maximum_value__c,Minimum_Value__c,lookup_Object_API_Name__c,Help_Text__c,Currency_Symbol__c,Allow_Currency__c,Decimal_value__c,Metadata__c,Max_Char_Length__c,Category__c, Type__c, Allow_Comment__c,Allow_Attachments__c,Help_Text_Required__c,Weight__c,(Select Id,Value__c,Name__c,Score__c from Question_Options__r order by createddate asc),Required__c 
             From Question__c WHERE id=:quesId LIMIT 1];
        }
        return new Question__c();
    }
    
    /**
     * save edited Question and Question Questionniare record
     * @param  oQues: Question object values.
     * @return      Boolean value for update secussfull. 
     */
    @AuraEnabled
    public static Boolean saveEditQuesRecord(Question__c oQues) {
        if (oQues != null) 
        {
            if(oQues.Help_Text_Required__c==false){
                oQues.Help_Text__c='';

            }
            update oQues;
            
            List<Question_Questionnaire__c> lstQQnnaire=[Select Id,Allow_Attachments__c,Allow_Comment__c,Help_Text_Required__c,Help_Text__c,Category__c from Question_Questionnaire__c where Question__c=:oQues.id];
            if(lstQQnnaire!=null && lstQQnnaire.size()>0)
            {
                lstQQnnaire[0].Allow_Attachments__c=oQues.Allow_Attachments__c;
                lstQQnnaire[0].Allow_Comment__c=oQues.Allow_Comment__c;
                lstQQnnaire[0].Help_Text_Required__c=oQues.Help_Text_Required__c;
                lstQQnnaire[0].Help_Text__c='';
                lstQQnnaire[0].Required__c=oQues.Required__c;
                if(oQues.Help_Text_Required__c==true){
                    lstQQnnaire[0].Help_Text__c=oQues.Help_Text__c;
                }
                
                lstQQnnaire[0].Category__c=oQues.Category__c;
                update lstQQnnaire;
            }
            return true;
        }
        return false;
    }

    /**
     * fetch default set Question Library id
     * @return : Question library id
     */
    public static String getDefaultQuestnLibraryId(){
        String id = [Select id from Question_Library__c where Name='Global Default' Limit 1 ].Id;
        if(id != null){
            return id;
        } 
        return null;
    }
   
 
     /**
     * Create new Question group
     * @param  sectionName: Question Group name.
     * @param  questionaryId: Questionniare Id.
     * @param  columnNumber: No of columns in section.
     */
    @AuraEnabled
    public static void createSection(String sectionName,String questionaryId,String columnNumber)
    {
        try
        {
            if(String.isNotBlank(sectionName) && String.isNotBlank(questionaryId) && String.isNotBlank(columnNumber))
            {
                Question_Group__c questnGroup=new Question_Group__c(name=sectionName,No_Of_Columns__c=columnNumber);
                insert questnGroup;
                Question_Questionnaire__c questnQuestnnaire=new Question_Questionnaire__c(name=getTemplateName(questionaryId),Question_Group__c=questnGroup.id,Questionnaire__c=questionaryId);
                insert questnQuestnnaire;
                    
            }
        }
        catch(Exception ex)
        {
            throw new AuraHandledException(ex.getMessage());
        }
    }
    /**
     * Delete Question group(Section)
     * @param  sectionId: Question Group ID.
     * @param  questionaryId: Questionnaire ID
     */
    @AuraEnabled
    public static void deleteSectionWithQuestionsAndQstnQustnry(String sectionId,String questionaryId){
        
        if(String.isNotBlank(sectionId)){
            List<String> lstQuestionsId=new List<String>();
            List<Question_Group__c> lstQuestionGrp=new List<Question_Group__c>();
            List<Question__c> lstupdateQuestions=new List<Question__c>();
            List<Question_Questionnaire__c> lstQustnQustnire=new List<Question_Questionnaire__c>();
            List<Question_Questionnaire__c> lstqustnQuestionnaire=[Select Id,Question_Group__c,Question__c,is_Delete__c from Question_Questionnaire__c Where Questionnaire__c=:questionaryId and Question_Group__c=:sectionId];
            if(lstqustnQuestionnaire!=null && lstqustnQuestionnaire.size()>0){
                for(Question_Questionnaire__c qq:lstqustnQuestionnaire){
                    qq.is_Delete__c=true;
                    lstQuestionsId.add(qq.Question__c);
                    lstQustnQustnire.add(qq);
                }
                lstQuestionGrp=[Select id,is_Delete__c from Question_Group__c Where Id=:lstqustnQuestionnaire[0].Question_Group__c and is_Delete__c=false];
                List<Question__c> lstQuestions=[Select Id,is_Delete__c from Question__c Where Id IN:lstQuestionsId and Is_Approve_For_Library__c=false and is_Delete__c=false];
                if(lstQuestions!=null && lstQuestions.size()>0){
                    for(Question__c question:lstQuestions){
                        question.is_Delete__c=true;
                        lstupdateQuestions.add(question);
                    }
                }
                
            }
            if(lstQustnQustnire.size()>0 && lstQuestionGrp.size()>0 && lstupdateQuestions.size()>0){
                lstQuestionGrp[0].is_Delete__c=true;
                update lstQuestionGrp;
                update lstQustnQustnire;
                update lstupdateQuestions;
            }
            else{
                lstQuestionGrp[0].is_Delete__c=true;
                update lstQuestionGrp;
                update lstQustnQustnire;
            }
            
        }
        
    }
    
    /**
     * Get score and weight from Question options and question
     * @param  qqnaireId: Question Questionnaire ID.
     */
    @AuraEnabled
    public static List<Question_Option__c> getScoreAndWeight(String qstnId){
        List<Question_Option__c> questionOptions=new List<Question_Option__c>();
        if(String.isNotBlank(qstnId)){
                questionOptions=[Select Id,Score__c From Question_Option__c Where Question__c=:qstnId];
        }
        return questionOptions;
    }
}