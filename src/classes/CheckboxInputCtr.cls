public class CheckboxInputCtr{
     /**
     * Create question and question questionnaire.
     * @param  qnaireId: Questionnaire id.
     * @param  qGroupId: Question group id.
     * @param  question: Question object values.
     * @param  qnaireName : Questionnaire name.
     * @param  qOrder: Order of question.
     * @param  colNumber: column number of question.
     * @param  questnOptns: Question options of the question.
     */
    @AuraEnabled 
    public static void createQuestnAndQuestnQnaireWithOptions(String qnaireId,String qGroupId,Question__c question,String qnaireName,String qOrder,String colNumber,String questnOptns){
        String sQLib = CreateTemplateCtrl.getDefaultQuestnLibraryId();
        question.Name__c = question.Label__c;
        question.Related_To_Column__c = colNumber;
        if(String.isNotBlank( sQLib)){
            question.Question_Library__c = sQLib; 
        }
        qOrder = String.valueOf(FieldInputCtr.countQuestnQuestnnaireRecord(qnaireId, qGroupId));
        question.Name = qOrder;
        insert question;
        Question_Questionnaire__c oQQuesnaire= new Question_Questionnaire__c(Weight__c=question.Weight__c,Required__c=question.Required__c,
            Allow_Currency__c =question.Allow_Currency__c,Decimal_value__c =question.Decimal_value__c,
            Related_To_Column__c=colNumber,Help_Text__c=question.Help_Text__c,Help_Text_Required__c=question.Help_Text_Required__c,
            Category__c=question.Category__c,Allow_Attachments__c=question.Allow_Attachments__c,Allow_Comment__c=question.Allow_Comment__c,
            Questionnaire__c = qnaireId,Name=qnaireName,Question_Group__c =qGroupId,Question__c=question.id,Question_Order__c=Integer.valueOf(qOrder),Is_Allow_Branching__c =question.Is_Allow_Branching__c);
        oQQuesnaire.Max_Char_Length__c=(question.Max_Char_Length__c != null?question.Max_Char_Length__c:0);
        if(String.isNotBlank(question.Currency_Symbol__c)){
            oQQuesnaire.Currency_Symbol__c=question.Currency_Symbol__c;
        }
        
        insert oQQuesnaire;
        List<fieldWrapper> qstnOptnList = (List<fieldWrapper>) JSON.deserialize(questnOptns, List<fieldWrapper>.class);
        List<Question_Option__c> lstQstnOptn=new List<Question_Option__c>();
        Question_Option__c qusthOption;
        for(fieldWrapper wrapper: qstnOptnList){
            qusthOption=new Question_Option__c();
            qusthOption.Name = wrapper.name;
            qusthOption.Name__c = wrapper.name;
            qusthOption.Question__c = question.id;
            if(String.isNotBlank(wrapper.score)){
                qusthOption.Score__c = Decimal.ValueOf(wrapper.score);
            }
            
            qusthOption.Value__c = wrapper.alias;
            lstQstnOptn.add(qusthOption);
        }
        insert lstQstnOptn;
    }
    
    /**
     * Save question option  when edit question.
     * @param  oQues: Question object.
     * @param  name: Name of question option.
     * @param  alias: Alias of question option.
     * @param  score: Score of question option.
     * @return : Question record
     */
    @AuraEnabled
    public static Question__c saveQuestionEditOption(Question__c oQues,String name,String alias,String score){
        Question__c question = new Question__c();
        Question_Option__c qusthOption=new Question_Option__c();
        if(oQues != null && String.isNotBlank(name)){
            if(String.isNotBlank(score)){
                qusthOption=new Question_Option__c(Question__c=oQues.id,Name=name,Name__c=name,Score__c=Decimal.ValueOf(score),Value__c=alias);
            }
            else{
                qusthOption=new Question_Option__c(Question__c=oQues.id,Name=name,Name__c=name,Value__c=alias);
            }
            insert qusthOption;
            question = CreateTemplateCtrl.getQuesDetail(oQues.id);
        }
        return question ;
    }
    
     /**
     * Delete question option  when edit question.
     * @param  oQues: Question object
     * @param  qstnOptionId: Id of question option.
     * @return : Question record
     */
    @AuraEnabled
    public static Question__c deleteQuestionOptionInEdit(Question__c oQues,String qstnOptionId){
        Question__c question = new Question__c();
        if(oQues!= null && String.isNotBlank(qstnOptionId)){
           Question_Option__c qstnOption=[Select Id from Question_Option__c Where Id=:qstnOptionId];
           if(qstnOption!=null){
               delete qstnOption;
           }
           question=CreateTemplateCtrl.getQuesDetail(oQues.id);
        }
        return question;
    }
    
    /**
     * Edit question option  when edit question.
     * @param  oQues: Question object
     * @param  qstnOptionId: Id of question option.
     * @return : Question record
     */
    @AuraEnabled
    public static Question__c editQuestionOptionInEdit(Question_Option__c oQuesOption,Question__c oQues){
        Question__c question = new Question__c();
        if(oQuesOption != null && oQues!= null){
           update oQuesOption;
           question=CreateTemplateCtrl.getQuesDetail(oQues.id);
        }
        return question;
    }
    
     /**
     * save edited Question and Question Questionniare record
     * @param  oQues: Question object values.
     * @param  qnaireId: Question object values.
     * @param  sectionId: Question object values.
     */
    @AuraEnabled
    public static void saveEditQuesRecord(Question__c oQues,String qnaireId,String sectionId,Boolean isUnderBranching) {
        if (oQues != null) 
        {
            if(oQues.Help_Text_Required__c==false){
                oQues.Help_Text__c='';

            }
            update oQues;
            
            List<Question_Questionnaire__c> lstQQnnaire=[Select Id,Allow_Attachments__c,Allow_Comment__c,Help_Text_Required__c,Help_Text__c,Category__c from Question_Questionnaire__c where Question__c=:oQues.id and Questionnaire__c=:qnaireId and Question_Group__c=:sectionId];
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
                lstQQnnaire[0].Is_Allow_Branching__c =oQues.Is_Allow_Branching__c;
                if(lstQQnnaire[0].Is_Allow_Branching__c==false && isUnderBranching ==false){
                    CreateTemplateCtrl.delQuestnDynLogic(lstQQnnaire[0].id);
                }
                if(String.isNotBlank(oQues.Currency_Symbol__c)){
                    lstQQnnaire[0].Currency_Symbol__c=oQues.Currency_Symbol__c;
                }
                lstQQnnaire[0].Decimal_value__c =oQues.Decimal_value__c;
                lstQQnnaire[0].Allow_Currency__c =oQues.Allow_Currency__c;
                lstQQnnaire[0].Max_Char_Length__c =(oQues.Max_Char_Length__c != null?oQues.Max_Char_Length__c:0);
                lstQQnnaire[0].Category__c=oQues.Category__c;
                lstQQnnaire[0].Weight__c=oQues.Weight__c;
                update lstQQnnaire;
            }
        } 
    }


    /**
     * Wrapper class to read quetion option values.
    */
    public with sharing class fieldWrapper {
        public String name;
        public String alias;
        public String score;
    }
}