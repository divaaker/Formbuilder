public class AddQuestionInSectionCtr{
    @AuraEnabled 
    public static boolean saveQstnInSection(String qquaireId,String selectedSectionId,String targetCol){
        boolean isUpdated=false;
        if(String.isNotBlank(qquaireId) && String.isNotBlank(selectedSectionId)){
            Question_Questionnaire__c qstnQuaire=[Select Id,Question__c, Question_Group__c,Is_Allow_Branching__c,Question_Order__c From Question_Questionnaire__c Where Id=:qquaireId];
            // When no question branching is available
            if(qstnQuaire!=null){
                Integer order=[Select count() from Question_Questionnaire__c where Question_Group__c=:selectedSectionId];
                if(qstnQuaire.Is_Allow_Branching__c==false){
                    if(qstnQuaire.Question_Group__c==selectedSectionId){
                        isUpdated=false;
                    }
                    else{
                        qstnQuaire.Related_To_Column__c=targetCol;
                        qstnQuaire.Question_Group__c=selectedSectionId;
                        qstnQuaire.Question_Order__c=order+1;
                        update qstnQuaire;

                        Question__c ques = new Question__c();
                        ques.Id = qstnQuaire.Question__c;
                        ques.Related_To_Column__c = targetCol;
                        update ques;
                        isUpdated=true;
                    }
                }
                else{
                    // When question branching is available
                    if(qstnQuaire.Question_Group__c==selectedSectionId){
                        isUpdated=false;
                    }
                    else{

                        List<String> questionIdList = new List<string>();
                        List<Question__c> questionToUpdate = new List<Question__c>();

                        List<String> lstChildQstnQuariIds=new List<String>();
                        List<Questionnaire_Dynamic_Logic__c> lstQuestnnaireDynLogic = [Select Id,Question_Questionnaire__c,Question_Group__c,Question_Option__c,Show_Question_Questionnaire__c from
                        Questionnaire_Dynamic_Logic__c where Question_Questionnaire__c =:qquaireId];
                        for(Questionnaire_Dynamic_Logic__c qstnDynlgc:lstQuestnnaireDynLogic){
                            qstnDynlgc.Question_Group__c=selectedSectionId;
                            lstChildQstnQuariIds.add(qstnDynlgc.Show_Question_Questionnaire__c);
                        }
                        if(lstChildQstnQuariIds!=null && lstChildQstnQuariIds.size()>0){
                            List<Question_Questionnaire__c> lstQstnQuaire=[Select Id,Question__c,Question_Group__c,Is_Allow_Branching__c,Question_Order__c From Question_Questionnaire__c
                            Where Id IN:lstChildQstnQuariIds];
                            Integer i=2;
                            for(Question_Questionnaire__c childQstnQuaire:lstQstnQuaire){
                                childQstnQuaire.Question_Group__c=selectedSectionId;
                                childQstnQuaire.Question_Order__c=order+i;
                                i=i+1;
                                questionIdList.add(childQstnQuaire.Question__c);
                            }
                            qstnQuaire.Related_To_Column__c=targetCol;
                            qstnQuaire.Question_Group__c=selectedSectionId;
                            update lstQuestnnaireDynLogic;
                            // Update order in parent
                            qstnQuaire.Question_Order__c=order+1;
                            update qstnQuaire;

                            Question__c ques2 = new Question__c();
                            ques2.Id = qstnQuaire.Question__c;
                            ques2.Related_To_Column__c = targetCol;
                            update ques2;

                            for(String id : questionIdList)
                            {
                                Question__c ques = new Question__c();
                                ques.Id = id;
                                ques.Related_To_Column__c = targetCol;
                                questionToUpdate.add(ques);
                            }
                            update questionToUpdate;


                            // Update question order in childs 
                            update lstQstnQuaire;
                            isUpdated=true;
                        }
                    }
                 }
            }
        }
        return isUpdated;
    }
    
    @AuraEnabled 
    public static List<Question_Group__c> getQuestionGroups(String qnaireId){
        List<String> lstQstnGrpIds=new List<String>();
        List<Question_Questionnaire__c> lstQQ=[select id,Questionnaire__c,Question_Group__c from Question_Questionnaire__c where Questionnaire__c=:qnaireId and is_delete__c=false];
        for(Question_Questionnaire__c qq:lstQQ){
            lstQstnGrpIds.add(qq.Question_Group__c);
        }
        List<Question_Group__c> lstQsthGroup=[Select Id,Name,Sort_Order__c From Question_Group__c Where Id IN:lstQstnGrpIds order by Sort_Order__c asc];
        return lstQsthGroup;
    }
    
    @AuraEnabled 
    public static List<Question_Group__c> updateQuestionGroupsSortingOrder(List<Question_Group__c> lstUpdatedQstnGrp){
        update lstUpdatedQstnGrp;
        return lstUpdatedQstnGrp;
    }
}