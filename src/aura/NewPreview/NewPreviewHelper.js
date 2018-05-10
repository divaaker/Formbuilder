({    
    getQuestionnaireRecord: function(component, event) {
        var vQnaireId = component.get("v.QnaireId");
        var vSectionId = '';        
        var self = this;
        self.getTempRecord(component, event, vQnaireId);
        
        //check is merge section or not
        var action = component.get("c.isMergeSection");        
        action.setParams({"qnaireId":component.get("v.recordId")});
        action.setCallback(this,function(res){
            var state = res.getState();
            if(state=='SUCCESS'){
                component.set("v.isMergeAllSection",res.getReturnValue());
                
                if(res.getReturnValue()==true){
                    self.getAllQuesGroupRecord(component, event, vQnaireId, "");
                }else{
                    self.getQuesGroupRecord(component, event, vQnaireId, "");
                }
            }else{
                self.showNewToast('ERROR : ','error',res.getError()[0].message);
            }
        });
        $A.enqueueAction(action);
    },
    getParameterByName: function(name) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var url = window.location.href;
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    testHelper:function(resObj,lstQuestion){
        var return_arr=[];
        var data;
        var lstUnderbranchingResponseOption =[];
        var lstUnderbranchingResponseOption2 =[];

        if (lstQuestion !== undefined && lstQuestion !== null && lstQuestion.lstQuestn!=undefined && lstQuestion.lstQuestn.length>0)
        {
            //start response code//
            for (var resIndex = 0; resIndex < lstQuestion.lstQuestn.length; resIndex++)
            {
                lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue1 = '';
                lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue2 = '';
                lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].comment = '';
                lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].attachment = '';
                
                if(lstQuestion.lstQuestn[resIndex].GKN_FB__Type__c=='Switch')
                {
                    lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue1 = lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[1].GKN_FB__Value__c;
                    lstUnderbranchingResponseOption2.push(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[1].Id);
                }

                if(lstQuestion.lstQuestn[resIndex].GKN_FB__Type__c=='Slider'){
                    lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue1 = lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Default_Value__c;
                }
                
                if(lstQuestion.lstQuestn[resIndex].GKN_FB__Type__c=='Checkbox'){
                    console.log('checkbox');
                    lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue1 = 'false';
                    lstUnderbranchingResponseOption2.push(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[1].Id);
                }
                if(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Question__r.GKN_FB__Type__c=='Picklist'){
                    var lstQuestionOptions = lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r;
                    if(lstQuestionOptions !== undefined && lstQuestionOptions.length>0){
                        //lstUnderbranchingResponseOption2.push(lstQuestionOptions[0].Id);
                    }
                }

                if(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r!=undefined)
                {
                    for(var ind=0; ind< lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r.length;ind++)
                    {
                        lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[ind].label=lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[ind].GKN_FB__Name__c;
                        lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[ind].value=lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[ind].GKN_FB__Name__c;
                    }
                }
            }

            // Set responses to questions                        
            for(var ind=0;ind<resObj.length;ind++)
            {
                data = resObj[ind].GKN_FB__Answer__c;
                for (var resIndex = 0; resIndex < lstQuestion.lstQuestn.length; resIndex++)
                {
                    if(lstQuestion.lstQuestn[resIndex].Id==resObj[ind].GKN_FB__Question__c)
                    {
                        if(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Question__r.GKN_FB__Type__c=='GPS Location')
                        {
                            lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue1 = resObj[ind].GKN_FB__Answer__c.split(' ')[0];
                            lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue2 = resObj[ind].GKN_FB__Answer__c.split(' ')[1];
                        }                                    
                        else if(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Question__r.GKN_FB__Type__c=='Switch'){
                            lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue1 = data;                                        
                            if(data === lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[0].GKN_FB__Name__c){
                                lstUnderbranchingResponseOption.push(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[0].Id);
                            }
                            else if(data ===lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[1].GKN_FB__Name__c){
                                lstUnderbranchingResponseOption.push(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[1].Id);
                            }
                        }
                        else if(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Question__r.GKN_FB__Type__c=='Checkbox'){
                            lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue1 = data;                                        
                            if(data === 'true'){                                            
                                lstUnderbranchingResponseOption.push(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[0].Id);
                            }
                            else{
                                lstUnderbranchingResponseOption.push(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[1].Id);
                            }     
                        }
                        else if(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Question__r.GKN_FB__Type__c=='Picklist'){
                            lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue1 = data;
                            var lstQuestionOptions = lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r;
                            if(lstQuestionOptions !== undefined && lstQuestionOptions.length>0){
                                for(var optionIndex =0;optionIndex<lstQuestionOptions.length;optionIndex++){                                                
                                    if(data ===lstQuestionOptions[optionIndex].Id) {
                                        lstUnderbranchingResponseOption.push(lstQuestionOptions[optionIndex].Id);
                                    }
                                }
                            }
                        }
                        else
                        {
                            lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue1 = resObj[ind].GKN_FB__Answer__c;
                            lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue2 = '';
                        }
                        
                        if(resObj[ind].GKN_FB__Comment__c!=undefined)
                        lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].comment = resObj[ind].GKN_FB__Comment__c;

                        // set Attachment response
                        if(resObj[ind].Attachments!=undefined)
                        {
                            for(var i=0;i<resObj[ind].Attachments.totalSize;i++)
                            {
                                if(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].attachment==''){
                                    lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].attachment = resObj[ind].Attachments.records[i].Name;
                                }
                                else{                                                
                                    lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].attachment = lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].attachment +', '+ obj[ind].Attachments.records[i].Name;   
                                }
                            }
                        }

                    }
                }
            }                       
        }

        if(lstUnderbranchingResponseOption.length==0){
            lstUnderbranchingResponseOption = lstUnderbranchingResponseOption2
        }

        return_arr[0] = lstQuestion;
        return_arr[1] = lstUnderbranchingResponseOption;
        return return_arr;
    },
    getQuestionResponsesHelper:function(component,event,lstQQuesnnaire,vSectionId){
        component.set("v.Spinner", true);
        var self = this;
        var data;
        var action = component.get("c.getQuestionResponses");        
        action.setParams({"questionnaireId":component.get("v.recordId"),sectionId:vSectionId});
        action.setCallback(this,function(res){
            component.set("v.Spinner", false);
            var state = res.getState();
            if (state === "SUCCESS") {
                var obj = JSON.parse(res.getReturnValue().responses);
                var lstQDynLogic = res.getReturnValue().lstQDynLogic;
                component.set("v.lstQDynLogicMain", lstQDynLogic);
                console.log(JSON.stringify(lstQDynLogic));                
                try
                {
                    //self.setQuestionBranching(component, event, lstQuestion, vSectionId,lstUnderbranchingResponseOption);
                    var res_and_ques = [];
                    var sectionList  =  lstQQuesnnaire.sectionList;
                    for(var i=0;i<sectionList.length;i++)
                    {
                        if(sectionList[i].sectionColNumber=='0' || sectionList[i].sectionColNumber=='1'){
                            if(sectionList[i].col1Questions.lstQuestn!=undefined){
                                res_and_ques = self.testHelper(obj,sectionList[i].col1Questions);
                                sectionList[i].col1Questions = res_and_ques[0];
                                self.setQuestionBranching(component,event,lstQQuesnnaire,vSectionId,'col1',i,res_and_ques[1]);
                            }
                        }
                        
                        if(sectionList[i].sectionColNumber=='2'){
                            if(sectionList[i].col1Questions.lstQuestn!=undefined){
                                res_and_ques = self.testHelper(obj,sectionList[i].col1Questions);
                                sectionList[i].col1Questions = res_and_ques[0];
                                self.setQuestionBranching(component,event,lstQQuesnnaire,vSectionId,'col1',i,res_and_ques[1]);
                            }
                            if(sectionList[i].col2Questions.lstQuestn!=undefined){
                                res_and_ques = self.testHelper(obj,sectionList[i].col2Questions);
                                sectionList[i].col2Questions = res_and_ques[0];
                                self.setQuestionBranching(component,event,lstQQuesnnaire,vSectionId,'col2',i,res_and_ques[1]);
                            }
                        }

                        if(sectionList[i].sectionColNumber=='3'){
                            if(sectionList[i].col1Questions.lstQuestn!=undefined){
                                res_and_ques = self.testHelper(obj,sectionList[i].col1Questions);
                                sectionList[i].col1Questions = res_and_ques[0];
                                self.setQuestionBranching(component,event,lstQQuesnnaire,vSectionId,'col1',i,res_and_ques[1]);
                            }
                            if(sectionList[i].col2Questions.lstQuestn!=undefined){
                                res_and_ques = self.testHelper(obj,sectionList[i].col2Questions);
                                sectionList[i].col2Questions = res_and_ques[0];
                                self.setQuestionBranching(component,event,lstQQuesnnaire,vSectionId,'col2',i,res_and_ques[1]);
                            }
                            if(sectionList[i].col3Questions.lstQuestn!=undefined){
                                res_and_ques = self.testHelper(obj,sectionList[i].col3Questions);
                                sectionList[i].col3Questions = res_and_ques[0];
                                self.setQuestionBranching(component,event,lstQQuesnnaire,vSectionId,'col3',i,res_and_ques[1]);
                            }
                        }
                    }
                }
                catch(e){
                    console.log(e)
                }
            } 
            else {
                self.showNewToast('ERROR : ','error',res.getError()[0].message);
            }
        });
        $A.enqueueAction(action);

    },    
    getQuesGroupRecord: function(component, event, vQnaireId, type) {
        var action = component.get("c.getAllQuestnGrpNameForQuesnnaire"); //Calling Apex class controller 'getAllQuestnGrpNameForQuesnnaire' method
        action.setParams({
            sQnaireId: vQnaireId
        });
        action.setCallback(this, function(res) {            
            var state = res.getState();
            if (state === "SUCCESS") {
                //console.log(JSON.stringify(res.getReturnValue()));
                component.set("v.lstQuesGroup", res.getReturnValue());
                var lstQGroup = component.get("v.lstQuesGroup");
                //alert(lstQGroup.length);
                if(lstQGroup.length>1){
                    component.set("v.disableNextSection",true);
                }
                else{
                    component.set("v.disableNextSection",false);
                }
                if (type === "delete section") {
                    component.set("v.selTabId", lstQGroup[0].GKN_FB__Question_Group__c);
                    this.getAllQuestion(component, event, vQnaireId, component.get("v.selTabId"));
                } else if (type === "change") {
                    this.getAllQuestion(component, event, vQnaireId, component.get("v.selTabId"));
                } else {
                    component.set("v.selTabId", lstQGroup[0].GKN_FB__Question_Group__c);
                    this.getAllQuestion(component, event, vQnaireId, component.get("v.selTabId"));
                }
            } 
            else {
                this.showNewToast("Error:",'error',res.getError()[0].message);
            }
        });
        $A.enqueueAction(action);
    },
    getAllQuesGroupRecord: function(component, event, vQnaireId, type) {
        this.getAllQuestion(component, event, vQnaireId, '');//set section id empty if want to get all section
    },
    getAllQuestion: function(component, event, vQnaireId, vSectionId) {
        var self = this;
        
        var action = component.get("c.getQuestnsForAllQuesGroup"); //Calling Apex class controller 'getQuestnForQuesGroup' method
        action.setParams({
            qnaireId: vQnaireId,
            sectionId: vSectionId,
        });
        action.setCallback(this, function(res) {
            
            var state = res.getState();
            if (state === "SUCCESS") {
                //component.set("v.lstQQuesnnaire",res.getReturnValue());
                //console.log(JSON.stringify(res.getReturnValue()));                
                self.getQuestionResponsesHelper(component,event,res.getReturnValue(),vSectionId);
                
            } else {
                self.showNewToast("Error: ",'error',res.getError()[0].message);
            }
        });
        $A.enqueueAction(action);
    },    
    setQuestionBranching: function(component, event, lstQQuesnnaire, vSectionId,col,i,lstUnderbranchingResponseOption) {
        var lstQDynLogic = component.get("v.lstQDynLogicMain");
        var lst_Question_Questionnaires = [];
        var Obj_Question_Questionnaires = component.get("v.Obj_Question_Questionnaires");
        var isRemove = false;            
        var lstQuestnOption =lstUnderbranchingResponseOption;

        if (lstQQuesnnaire !== undefined && lstQQuesnnaire !== null && lstQQuesnnaire.sectionList!=undefined && lstQQuesnnaire.sectionList.length>0) 
        {   
            var question = [];
            if(col=='col1'){
                question = lstQQuesnnaire.sectionList[i].col1Questions.lstQuestn;
            }
            else if(col=='col2'){
                question = lstQQuesnnaire.sectionList[i].col2Questions.lstQuestn;
            }
            else if(col=='col3'){
                question = lstQQuesnnaire.sectionList[i].col3Questions.lstQuestn;
            }
            
            if (lstQDynLogic !== undefined && lstQDynLogic !== null && lstQDynLogic.length > 0) {
                for (var indexQDynLogic = 0; indexQDynLogic < lstQDynLogic.length; indexQDynLogic++) {
                    for (var indexQue = 0; indexQue < question.length; indexQue++) {
                        var questionQuestnnnaire = question[indexQue].GKN_FB__Question_Questionnaires__r;
                        question[indexQue].GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire = [];
                        for (var indeQQnnaire = 0; indeQQnnaire < questionQuestnnnaire.length; indeQQnnaire++) {
                            if (lstQDynLogic[indexQDynLogic].GKN_FB__Show_Question_Questionnaire__c === questionQuestnnnaire[indeQQnnaire].Id) {
                                isRemove = true;
                                Obj_Question_Questionnaires = questionQuestnnnaire[indeQQnnaire];
                                if (question[indexQue].GKN_FB__Question_Options__r !== undefined) {
                                    Obj_Question_Questionnaires.QuestionOptions = question[indexQue].GKN_FB__Question_Options__r;
                                } else {
                                    Obj_Question_Questionnaires.QuestionOptions = [];
                                }
                                if (lstQDynLogic[indexQDynLogic].GKN_FB__Question_Questionnaire__r.GKN_FB__Question__r.GKN_FB__Type__c === 'Picklist' || lstQDynLogic[indexQDynLogic].GKN_FB__Question_Questionnaire__r.GKN_FB__Question__r.GKN_FB__Type__c === 'Switch' || lstQDynLogic[indexQDynLogic].GKN_FB__Question_Questionnaire__r.GKN_FB__Question__r.GKN_FB__Type__c === 'Checkbox') {
                                    Obj_Question_Questionnaires.isShowQuestion = false;
                                }
                                else{
                                    Obj_Question_Questionnaires.isShowQuestion = true;
                                }
                                Obj_Question_Questionnaires.MainQuestionId = lstQDynLogic[indexQDynLogic].GKN_FB__Question_Questionnaire__r.GKN_FB__Question__c;
                                
                                question.splice(indexQue, 1);
                            }
                        }
                    }

                    lst_Question_Questionnaires.push(Obj_Question_Questionnaires);
                }
                
                //Default setting for switch and checkbox question.  
                if(lstQuestnOption !== undefined && lstQuestnOption.length>0){                                
                    for(var varDynLogic=0; varDynLogic<lstQDynLogic.length;varDynLogic++ ){                                    
                        if(lstQuestnOption.indexOf(lstQDynLogic[varDynLogic].GKN_FB__Question_Option__c)!==-1){
                            for(var varQuestn =0;varQuestn<lst_Question_Questionnaires.length;varQuestn++ ){                                            
                                if(lst_Question_Questionnaires[varQuestn].Id===lstQDynLogic[varDynLogic].GKN_FB__Show_Question_Questionnaire__c){                                                
                                    lst_Question_Questionnaires[varQuestn].isShowQuestion =true;
                                }
                            }
                        }
                    }
                }
                var lstQuestionsId = [];
                if (isRemove === true) {
                    for (var indexQueResult = 0; indexQueResult < question.length > 0; indexQueResult++) {
                        var questnId = question[indexQueResult].Id;
                        //var questionSecondOptionId = question[indexQueResult].Question_Options__r[1].Id;
                        for (var indexQQnnaire = 0; indexQQnnaire < lst_Question_Questionnaires.length > 0; indexQQnnaire++) {
                            if (lst_Question_Questionnaires[indexQQnnaire].MainQuestionId === questnId) {                                    
                                var branchingQuestionQuestnnnaire = question[indexQueResult].GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire;
                                if (lstQuestionsId.indexOf(lst_Question_Questionnaires[indexQQnnaire].Id) === -1) {
                                    branchingQuestionQuestnnnaire.push(lst_Question_Questionnaires[indexQQnnaire]);
                                }
                                lstQuestionsId.push(lst_Question_Questionnaires[indexQQnnaire].Id);
                                question[indexQueResult].GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire = branchingQuestionQuestnnnaire;
                            }
                        }
                    }
                }
            } 

            if(col=='col1'){
                lstQQuesnnaire.sectionList[i].col1Questions.lstQuestn = this.sortListQuestionQuestionnaire(component, event, question);
            }
            else if(col=='col2'){
                lstQQuesnnaire.sectionList[i].col2Questions.lstQuestn = this.sortListQuestionQuestionnaire(component, event, question);
            }
            else if(col=='col3'){
                lstQQuesnnaire.sectionList[i].col3Questions.lstQuestn = this.sortListQuestionQuestionnaire(component, event, question);
            }
            component.set("v.lstQQuesnnaire", lstQQuesnnaire);            
        } 
        else 
        {
            component.set("v.lstQQuesnnaire", lstQQuesnnaire);
        }        
    },
    sortListQuestionQuestionnaire: function(component, event, arrayQQuesnnaire) {
        var done = false;
        while (!done) {
            done = true;
            for (var i = 1; i < arrayQQuesnnaire.length; i += 1) {
                if (arrayQQuesnnaire[i - 1].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Question_Order__c > arrayQQuesnnaire[i].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Question_Order__c) {
                    done = false;
                    var tmp = arrayQQuesnnaire[i - 1];
                    arrayQQuesnnaire[i - 1] = arrayQQuesnnaire[i];
                    arrayQQuesnnaire[i] = tmp;
                }
            }
        }
        return arrayQQuesnnaire;
    }, 
    getQuesCategory: function(component, event, vQnaireId, vSectionId) {        
        var action = component.get("c.getQueCategory"); //Calling Apex class controller 'getQueCategory' method
        action.setCallback(this, function(res) {            
            var state = res.getState();
            if (state === "SUCCESS") {
                component.set("v.lstQuesCategory", res.getReturnValue());
            } else {
               this.showNewToast("Error:",'error',res.getError()[0].message);
            }
        });
        $A.enqueueAction(action);
    },    
    setOptionBranching: function(component, event, selctedOptionId, index,col,sectionIndex) {
        try
        {
            var listsect = component.get("v.lstQQuesnnaire.sectionList");
            var mainQuestion = [];//component.get("v.lstQQuesnnaire.sectionList."+col+".lstQuestn");
            if(col=="col1Questions"){
                mainQuestion = listsect[sectionIndex].col1Questions.lstQuestn;
            }
            else if(col=="col2Questions"){
                mainQuestion = listsect[sectionIndex].col2Questions.lstQuestn;
            }
            else if(col=="col3Questions"){
                mainQuestion = listsect[sectionIndex].col3Questions.lstQuestn;
            }
            //console.log(mainQuestion);

            var mainQuestionBranching = mainQuestion[index].GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire;
            console.log(mainQuestion[index].GKN_FB__Question_Questionnaires__r[0]);
            console.log(mainQuestionBranching);

            if (mainQuestionBranching !== undefined) {
                for (var indexMBranching = 0; indexMBranching < mainQuestionBranching.length; indexMBranching++) {
                    mainQuestionBranching[indexMBranching].isShowQuestion = false;
                }
                var lstAddScore = []; //list for which want to count score in branching question.
                var lstRemoveScore = []; //list for which not count score in branching question.
                mainQuestion[index].GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire = mainQuestionBranching;
                if (selctedOptionId !== undefined && selctedOptionId !== null && selctedOptionId.length > 0) {
                    var lstQDynLogic = component.get("v.lstQDynLogicMain");

                    var questnniareId = mainQuestion[index].GKN_FB__Question_Questionnaires__r[0].Id;

                    //remove question which is not set in Question option
                    for (var branchingQuestnQuetnnaireIndex = 0; branchingQuestnQuetnnaireIndex < mainQuestionBranching.length; branchingQuestnQuetnnaireIndex++) 
                    {
                        for (var indexMainQDynLogic = 0; indexMainQDynLogic < lstQDynLogic.length; indexMainQDynLogic++) 
                        {                            
                            if (lstQDynLogic[indexMainQDynLogic].GKN_FB__Show_Question_Questionnaire__c === mainQuestionBranching[branchingQuestnQuetnnaireIndex].Id &&
                                lstQDynLogic[indexMainQDynLogic].GKN_FB__Question_Questionnaire__c === questnniareId &&
                                selctedOptionId === lstQDynLogic[indexMainQDynLogic].GKN_FB__Question_Option__c) 
                            {
                                
                                mainQuestionBranching[branchingQuestnQuetnnaireIndex].isShowQuestion = true;
                                if (lstRemoveScore.indexOf(mainQuestionBranching[branchingQuestnQuetnnaireIndex].GKN_FB__Question__c) > -1) 
                                {
                                    var alredyAddInRemvePoint = lstRemoveScore.indexOf(mainQuestionBranching[branchingQuestnQuetnnaireIndex].GKN_FB__Question__c);
                                    lstRemoveScore.splice(alredyAddInRemvePoint, 1);
                                }
                                lstAddScore.push(mainQuestionBranching[branchingQuestnQuetnnaireIndex].GKN_FB__Question__c);
                            } 
                            else 
                            {
                                if (lstAddScore.indexOf(mainQuestionBranching[branchingQuestnQuetnnaireIndex].GKN_FB__Question__c) === -1 && lstRemoveScore.indexOf(mainQuestionBranching[branchingQuestnQuetnnaireIndex].GKN_FB__Question__c) === -1) {
                                    lstRemoveScore.push(mainQuestionBranching[branchingQuestnQuetnnaireIndex].GKN_FB__Question__c);
                                }
                            }
                        }
                    }
                    mainQuestion[index].GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire = mainQuestionBranching;
                } else {
                    for (var scorebranchgQuestnQnaireIndex = 0; scorebranchgQuestnQnaireIndex < mainQuestionBranching.length; scorebranchgQuestnQnaireIndex++) {
                        lstRemoveScore.push(mainQuestionBranching[scorebranchgQuestnQnaireIndex].GKN_FB__Question__c);
                    }
                }
                
                if(col=="col1Questions"){
                    listsect[sectionIndex].col1Questions.lstQuestn = mainQuestion;
                }
                else if(col=="col2Questions"){
                    listsect[sectionIndex].col2Questions.lstQuestn = mainQuestion;
                }
                else if(col=="col3Questions"){
                    listsect[sectionIndex].col3Questions.lstQuestn = mainQuestion;
                }
                component.set("v.lstQQuesnnaire.sectionList", listsect);
            }
        }
        catch(e){
            console.log(e);
        }
    },
       
    showNewToast: function(title,type, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: title,
            message: message,
            duration: ' 5000',
            type: type,
            mode: 'dismissible'
        });
        toastEvent.fire();
    },
    saveQuestionResponseHelper:function(component){
        var self = this;
        var resp=[];
        var sectionList = component.get("v.lstQQuesnnaire.sectionList");
        for(var i=0;i<sectionList.length;i++)
        {
            if(sectionList[i].sectionColNumber=='0' || sectionList[i].sectionColNumber=='1'){
                if(sectionList[i].col1Questions.lstQuestn!=undefined){
                    resp = resp.concat(sectionList[i].col1Questions.lstQuestn);
                }
            }
            
            if(sectionList[i].sectionColNumber=='2'){
                if(sectionList[i].col1Questions.lstQuestn!=undefined){
                    resp = resp.concat(sectionList[i].col1Questions.lstQuestn);
                }
                if(sectionList[i].col2Questions.lstQuestn!=undefined){
                    resp = resp.concat(sectionList[i].col2Questions.lstQuestn);
                }
            }

            if(sectionList[i].sectionColNumber=='3'){
                if(sectionList[i].col1Questions.lstQuestn!=undefined){
                    resp = resp.concat(sectionList[i].col1Questions.lstQuestn);
                }
                if(sectionList[i].col2Questions.lstQuestn!=undefined){
                    resp = resp.concat(sectionList[i].col2Questions.lstQuestn);
                }
                if(sectionList[i].col3Questions.lstQuestn!=undefined){
                    resp = resp.concat(sectionList[i].col3Questions.lstQuestn);
                }
            }
        }
        console.log(resp);

        resp = JSON.stringify(resp);

        var action = component.get("c.saveQuestionResponse");
        component.set("v.Spinner",true);
        var resp = resp.replace(/__c/g, "");
        resp = resp.replace(/GKN_FB__/g, "");
        resp = resp.replace(/__r/g, "r");
        action.setParams({"JSONResponse":resp,"questionaryId":component.get("v.recordId")});
        action.setCallback(this,function(res){
            component.set("v.Spinner",false);
            var state = res.getState();
            if (state === "SUCCESS") {
                self.showNewToast('SUCCESS : ','success','Your response have been submited!');
            } 
            else {
                self.showNewToast('ERROR : ','error',res.getError()[0].message);
            }
        });
        $A.enqueueAction(action);
    },    
    validateForm:function(component){
        try
        {
            var ele = component.find('inputFields');

            if(ele instanceof Array)
            {

                var allValid = component.find('inputFields').reduce(function (validSoFar, inputCmp) {
                inputCmp.showHelpMessageIfInvalid();
                if(inputCmp.get('v.validity')!=undefined){
                    return validSoFar && inputCmp.get('v.validity').valid;    
                }else{
                    return validSoFar;
                }
                }, true);

                if (allValid){                
                    return true;
                }
                else{
                    return false;
                }
            }
            else if(ele != undefined){
                ele.showHelpMessageIfInvalid();
                return ele.get('v.validity').valid;
            }
        }
        catch(e){
            console.log(217);
            console.log(e);
        }
    },
    validateForm2:function(component)
    {
        var isValid = true;
        try{   
            var ele = component.find('inputRadioFields');

            if(ele instanceof Array)
            {

                for(var i=0;i<ele.length;i++){
                    var obj = ele[i];
                    if(!obj.checkValidity()){
                        //obj.set("v.validity",{"isvalid":false});
                        $A.util.addClass(obj,"slds-has-error");
                        isValid = false;
                    }
                    else
                    {
                        $A.util.removeClass(obj,"slds-has-error");
                    }
                }
            }
            else if(ele != undefined)
            {
                if(!ele.checkValidity()){
                    $A.util.addClass(ele,"slds-has-error");                    
                    isValid = false;
                }
                else
                {
                    $A.util.removeClass(ele,"slds-has-error");
                }
            }
            
            ele = component.find('inputRichtextFields');
            if(ele instanceof Array)
            {
                for(var i=0;i<ele.length;i++){
                    var obj = ele[i];
                    if(obj.get("v.class")==true && $A.util.isEmpty(obj.get("v.value"))){
                        obj.set("v.valid",false);
                        isValid = false;
                        console.log(obj.get("v.value"));
                    }else{
                        obj.set("v.valid",true);
                    }
                }    
            }
            else if(ele != undefined)
            {
                if(ele.get("v.class")==true && ele.get("v.value")==''){
                    ele.set("v.valid",false);
                    isValid = false;
                }
                else
                {
                    ele.set("v.valid",true);
                }
            }
            

            ele = component.find('inputDateFields');
            if(ele instanceof Array)
            {
                for(var i=0;i<ele.length;i++){
                    var obj = ele[i];
                    console.log(obj);
                    if(obj.get("v.required")==true && $A.util.isEmpty(obj.get("v.value"))){
                        obj.set("v.errors",[{message:"Please enter valid date"}]);
                        isValid = false;
                    }else{
                        obj.set("v.errors",null);
                    }
                }
            }
            else if(ele != undefined)
            {
                if(component.find('inputDateFields').get("v.required")==true && $A.util.isEmpty(component.find('inputDateFields').get("v.value"))){
                    component.find('inputDateFields').set("v.errors",[{message:"Please enter valid date"}]);
                    isValid = false;
                }
                else
                {
                    component.find('inputDateFields').set("v.errors",null);
                }
            }

            ele = component.find('inputDateTimeFields');
            if(ele instanceof Array)
            {
                for(var i=0;i<ele.length;i++){
                    var obj = ele[i];
                    console.log(obj);
                    if(obj.get("v.required")==true && $A.util.isEmpty(obj.get("v.value"))){
                        obj.set("v.errors",[{message:"Please enter valid date and time"}]);
                        isValid = false;
                    }else{
                        obj.set("v.errors",null);
                    }
                }
            }
            else if(ele != undefined)
            {
                if(component.find('inputDateTimeFields').get("v.required")==true && $A.util.isEmpty(component.find('inputDateTimeFields').get("v.value"))){
                    component.find('inputDateTimeFields').set("v.errors",[{message:"Please enter valid date and time"}]);
                    isValid = false;
                }
                else{
                    component.find('inputDateTimeFields').set("v.errors",null);
                }
            }
            var eve = $A.get("e.c:validateLookupFieldEvt");
            eve.fire();
            return isValid;
        }
        catch(e){
            console.log(e);
        }
    },
    
    getTempRecord: function(component, event, vQnaireId) {        
        var action = component.get("c.getTemplateRecord"); //Calling Apex class controller 'getTemplateRecrod' method
        action.setParams({
            qnaireId: vQnaireId
        });
        action.setCallback(this, function(res) {            
            var state = res.getState();
            if (state === "SUCCESS") {
                if (res.getReturnValue().GKN_FB__is_Published__c === true) {
                    component.set("v.disablePublishButton",true);
                } 
                component.set("v.objQnaire", res.getReturnValue());
                component.set("v.QnaireName", component.get("v.objQnaire.Name"));
            } else {
                this.showNewToast("Error:",'error',res.getError()[0].message);
            }
        });
        $A.enqueueAction(action);
    },
})