({
    getQuestionnaireRecord: function(component, event) {
        var vQnaireId = component.get("v.QnaireId");
        var vSectionId = '';
        this.getTempRecord(component, event, vQnaireId);
        this.getQuesGroupRecord(component, event, vQnaireId, "");

    },
    getTempRecord: function(component, event, vQnaireId) {
        var action = component.get("c.getTemplateRecord"); //Calling Apex class controller 'getTemplateRecrod' method
        action.setParams({
            qnaireId: vQnaireId
        });
        action.setCallback(this, function(res) {
            var state = res.getState();
            if (state === "SUCCESS") {
                if (res.getReturnValue().is_Published__c === true) {
                    component.set("v.disablePublishButton",true);
                } 
                component.set("v.objQnaire", res.getReturnValue());
                component.set("v.QnaireName", component.get("v.objQnaire.Name"));

            } else {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error :",
                    "mode": "sticky",
                    "message": res.getError()[0].message
                });
                toastEvent.fire();
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
                    component.set("v.selTabId", lstQGroup[0].Question_Group__c);
                    this.getAllQuestion(component, event, vQnaireId, component.get("v.selTabId"));
                } else if (type === "change") {
                    this.getAllQuestion(component, event, vQnaireId, component.get("v.selTabId"));
                } else {
                    component.set("v.selTabId", lstQGroup[0].Question_Group__c);
                    this.getAllQuestion(component, event, vQnaireId, component.get("v.selTabId"));
                }



            } else {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error :",
                    "mode": "sticky",
                    "message": res.getError()[0].message
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    getAllQuestion: function(component, event, vQnaireId, vSectionId) {
        var action = component.get("c.getQuestnsForQuesGroup"); //Calling Apex class controller 'getQuestnForQuesGroup' method
        action.setParams({
            qnaireId: vQnaireId,
            sectionId: vSectionId,
        });
        action.setCallback(this, function(res) {
            var state = res.getState();
            if (state === "SUCCESS") {
                var totalSwitchScore = 0.0;
                var totalSwitchProbableScore = 0.0;
                var switchProbableScore = 0.0;
                var switchScoreValue = [];
                var selectedScore = component.get("v.selectedScore");
                var selectedScoreQstnIds = component.get("v.selectedScoreIds");
                //component.set("v.lstQQuesnnaire", res.getReturnValue());
                this.setQuestionBranching(component, event, res.getReturnValue(), vSectionId);
                /*var data = res.getReturnValue();
                var qstnsData = data.lstQuestn;
                if (qstnsData !== undefined) {
                    for (var i = 0; i < qstnsData.length; i++) {
                        var scoreMap = {
                            qstnId: '',
                            score: 0.0,
                            totalPosibile: 0.0,
                            is_AddSroce: true
                        };
                        if (qstnsData[i].Type__c === 'Switch') {
                            var swithQstnOptn = qstnsData[i].Question_Options__r;
                            if (swithQstnOptn !== null) {

                                if (swithQstnOptn[1].Score__c !== undefined) {
                                    scoreMap.qstnId = qstnsData[i].Question_Questionnaires__r[0].Question__c;
                                    scoreMap.score = parseFloat(swithQstnOptn[1].Score__c) * parseFloat(qstnsData[i].Question_Questionnaires__r[0].Weight__c);
                                    totalSwitchScore = parseFloat(swithQstnOptn[1].Score__c) * parseFloat(qstnsData[i].Question_Questionnaires__r[0].Weight__c) + totalSwitchScore;
                                    switchScoreValue.push(swithQstnOptn[0].Score__c);
                                    switchScoreValue.push(swithQstnOptn[1].Score__c);
                                    scoreMap.is_AddSroce = true;
                                    var largestScoreValue = this.returnLargestSocreNumber(component, switchScoreValue);
                                    switchProbableScore = parseFloat(largestScoreValue) * parseFloat(qstnsData[i].Question_Questionnaires__r[0].Weight__c);
                                    scoreMap.totalPosibile = parseFloat(switchProbableScore);
                                    totalSwitchProbableScore += parseFloat(switchProbableScore);
                                    switchScoreValue.splice(0, switchScoreValue.length);
                                    if (selectedScoreQstnIds.indexOf(qstnsData[i].Question_Questionnaires__r[0].Question__c) === -1) {
                                        selectedScoreQstnIds.push(qstnsData[i].Question_Questionnaires__r[0].Question__c);
                                        selectedScore.push(scoreMap);
                                    }

                                }
                            }
                        }
                    }
                }
                component.set("v.selectedScoreIds", selectedScoreQstnIds);
                component.set("v.selectedScore", selectedScore);
                component.set("v.calculatedScore", totalSwitchScore);
                component.set("v.scoreTotalValues", totalSwitchProbableScore);*/
            } else {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error :",
                    "mode": "sticky",
                    "message": res.getError()[0].message
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    setQuestionBranching: function(component, event, lstQuestion, vSectionId) {

        if (lstQuestion !== undefined && lstQuestion !== null && lstQuestion.lstQuestn !== undefined && lstQuestion.lstQuestn !== null && lstQuestion.lstQuestn.length > 0) {
            var action = component.get("c.getBranchingQuestn"); //Calling Apex class controller 'getBranchingQuestn' method
            var question = lstQuestion.lstQuestn;
            var lst_Question_Questionnaires = component.get("v.lst_Question_Questionnaires");
            var Obj_Question_Questionnaires = component.get("v.Obj_Question_Questionnaires");
            var isRemove = false;

            lst_Question_Questionnaires = [];
            action.setParams({
                sectionId: vSectionId,
            });

            action.setCallback(this, function(res) {
                var state = res.getState();
                if (state === "SUCCESS") {
                    var lstQDynLogic = res.getReturnValue();
                    component.set("v.lstQDynLogicMain", lstQDynLogic);
                    var lstQuestnOption =[];
                    for (var indexMainQuetn = 0; indexMainQuetn < question.length; indexMainQuetn++) {
                        if (question[indexMainQuetn].Question_Options__r !== undefined && question[indexMainQuetn].Question_Options__r.length > 0 && (question[indexMainQuetn].Type__c === 'Switch' || question[indexMainQuetn].Type__c === 'Checkbox')) {
                            lstQuestnOption.push(question[indexMainQuetn].Question_Options__r[1].Id);
                        }
                    }
                    if (lstQDynLogic !== undefined && lstQDynLogic !== null && lstQDynLogic.length > 0) {
                        for (var indexQDynLogic = 0; indexQDynLogic < lstQDynLogic.length; indexQDynLogic++) {
                            for (var indexQue = 0; indexQue < question.length; indexQue++) {
                                var questionQuestnnnaire = question[indexQue].Question_Questionnaires__r;
                                question[indexQue].Question_Questionnaires__r[0].branchingQuestnQuetnnaire = [];
                                for (var indeQQnnaire = 0; indeQQnnaire < questionQuestnnnaire.length; indeQQnnaire++) {
                                    if (lstQDynLogic[indexQDynLogic].Show_Question_Questionnaire__c === questionQuestnnnaire[indeQQnnaire].Id) {
                                        isRemove = true;
                                        Obj_Question_Questionnaires = questionQuestnnnaire[indeQQnnaire];
                                        if (question[indexQue].Question_Options__r !== undefined) {
                                            Obj_Question_Questionnaires.QuestionOptions = question[indexQue].Question_Options__r;
                                        } else {
                                            Obj_Question_Questionnaires.QuestionOptions = [];
                                        }
                                        if (lstQDynLogic[indexQDynLogic].Question_Questionnaire__r.Question__r.Type__c === 'Picklist' || lstQDynLogic[indexQDynLogic].Question_Questionnaire__r.Question__r.Type__c === 'Switch' || lstQDynLogic[indexQDynLogic].Question_Questionnaire__r.Question__r.Type__c === 'Checkbox') {
                                            Obj_Question_Questionnaires.isShowQuestion = false;
                                        }
                                        else{
                                            Obj_Question_Questionnaires.isShowQuestion = true;
                                        }
                                        Obj_Question_Questionnaires.MainQuestionId = lstQDynLogic[indexQDynLogic].Question_Questionnaire__r.Question__c;

                                        question.splice(indexQue, 1);
                                    }
                                }
                            }

                            lst_Question_Questionnaires.push(Obj_Question_Questionnaires);
                        }
                        //Default setting for switch and checkbox question.  
                        if(lstQuestnOption !== undefined && lstQuestnOption.length>0){
                            for(var varDynLogic=0; varDynLogic<lstQDynLogic.length;varDynLogic++ ){
                                if(lstQuestnOption.indexOf(lstQDynLogic[varDynLogic].Question_Option__c)!==-1){
                                    for(var varQuestn =0;varQuestn<lst_Question_Questionnaires.length;varQuestn++ ){
                                        if(lst_Question_Questionnaires[varQuestn].Id===lstQDynLogic[varDynLogic].Show_Question_Questionnaire__c){
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
                                        
                                        var branchingQuestionQuestnnnaire = question[indexQueResult].Question_Questionnaires__r[0].branchingQuestnQuetnnaire;

                                        if (lstQuestionsId.indexOf(lst_Question_Questionnaires[indexQQnnaire].Id) === -1) {
                                            branchingQuestionQuestnnnaire.push(lst_Question_Questionnaires[indexQQnnaire]);

                                        }
                                        lstQuestionsId.push(lst_Question_Questionnaires[indexQQnnaire].Id);
                                        question[indexQueResult].Question_Questionnaires__r[0].branchingQuestnQuetnnaire = branchingQuestionQuestnnnaire;
                                    }
                                }
                            }
                            lstQuestion.lstQuestn = this.sortListQuestionQuestionnaire(component, event, question);
                            this.setMainScore(component,lstQuestion);
                            component.set("v.lstQQuesnnaire", lstQuestion);
                            component.set("v.lstQQuesnnaireMain", lstQuestion);
                        }

                    } else {

                        lstQuestion.lstQuestn = this.sortListQuestionQuestionnaire(component, event, lstQuestion.lstQuestn);
                        this.setMainScore(component,lstQuestion);
                        component.set("v.lstQQuesnnaire", lstQuestion);
                        component.set("v.lstQQuesnnaireMain", lstQuestion);
                    }


                } else {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error :",
                        "mode": "sticky",
                        "message": res.getError()[0].message
                    });
                    toastEvent.fire();
                }
            });
            $A.enqueueAction(action);
        } else {
            component.set("v.lstQQuesnnaire", lstQuestion);
            this.setMainScore(component,lstQuestion);
            component.set("v.lstQQuesnnaireMain", lstQuestion);
        }
        
    },
    setMainScore : function(component,data){
        //var data = res.getReturnValue();
        
        
        var totalSwitchScore = 0.0;
        var totalSwitchProbableScore = 0.0;
        var switchProbableScore = 0.0;
        var switchScoreValue = [];
        var selectedScore = component.get("v.selectedScore");
        var selectedScoreQstnIds = component.get("v.selectedScoreIds");
        var qstnsData = data.lstQuestn;
        if (qstnsData !== undefined) {
            for (var i = 0; i < qstnsData.length; i++) {
                var scoreMap = {
                    qstnId: '',
                    score: 0.0,
                    totalPosibile: 0.0,
                    is_AddSroce: true
                };
                if (qstnsData[i].Type__c === 'Switch') {
                    var swithQstnOptn = qstnsData[i].Question_Options__r;
                    if (swithQstnOptn !== null) {

                        if (swithQstnOptn[1].Score__c !== undefined) {
                            //console.log('data >>');
                            //console.log(data);
                            scoreMap.qstnId = qstnsData[i].Question_Questionnaires__r[0].Question__c;
                            scoreMap.score = parseFloat(swithQstnOptn[1].Score__c) * parseFloat(qstnsData[i].Question_Questionnaires__r[0].Weight__c);
                            totalSwitchScore = parseFloat(swithQstnOptn[1].Score__c) * parseFloat(qstnsData[i].Question_Questionnaires__r[0].Weight__c) + totalSwitchScore;
                           
                            if(swithQstnOptn[0].Score__c !== undefined){
                                switchScoreValue.push(swithQstnOptn[0].Score__c);
                            }
                            if(swithQstnOptn[1].Score__c !== undefined){
                                switchScoreValue.push(swithQstnOptn[1].Score__c);
                            }
                            scoreMap.is_AddSroce = true;
                            var largestScoreValue = this.returnLargestSocreNumber(component, switchScoreValue);
                            switchProbableScore = parseFloat(largestScoreValue) * parseFloat(qstnsData[i].Question_Questionnaires__r[0].Weight__c);
                            scoreMap.totalPosibile = parseFloat(switchProbableScore);
                            totalSwitchProbableScore += parseFloat(switchProbableScore);
                            switchScoreValue.splice(0, switchScoreValue.length);
                            if (selectedScoreQstnIds.indexOf(qstnsData[i].Question_Questionnaires__r[0].Question__c) === -1) {
                                selectedScoreQstnIds.push(qstnsData[i].Question_Questionnaires__r[0].Question__c);
                                selectedScore.push(scoreMap);
                            }
                            
                        }
                    }
                    
                }
                /*if(qstnsData[i].Question_Questionnaires__r[0].branchingQuestnQuetnnaire !==undefined && qstnsData[i].Question_Questionnaires__r[0].branchingQuestnQuetnnaire.length>0){
                    for(var branchingIndex =0;branchingIndex<qstnsData[i].Question_Questionnaires__r[0].branchingQuestnQuetnnaire.length;branchingIndex++){
                        var branchingVal = qstnsData[i].Question_Questionnaires__r[0].branchingQuestnQuetnnaire[branchingIndex];
                        //console.log('branchingVal >>');
                        //console.log(branchingVal.Question__r.Type__c);
                        if (branchingVal.Question__r.Type__c === 'Switch') {
                            //console.log(branchingVal);
                            scoreMap.qstnId = branchingVal.Question__r.Id;
                            var swithQstnOptn = branchingVal.QuestionOptions;
                            //console.log(branchingVal.QuestionOptions);
                            if(swithQstnOptn !== undefined && swithQstnOptn[1].Score__c !== undefined){
                                
                                scoreMap.score = parseFloat(swithQstnOptn[1].Score__c) * parseFloat(branchingVal.Weight__c);
                                //totalSwitchScore = parseFloat(swithQstnOptn[1].Score__c) * parseFloat(branchingVal.Weight__c) + totalSwitchScore;
                                switchScoreValue.push(swithQstnOptn[0].Score__c);
                                switchScoreValue.push(swithQstnOptn[1].Score__c);
                                scoreMap.is_AddSroce = false;
                                var largestScoreValue = this.returnLargestSocreNumber(component, switchScoreValue);
                                switchProbableScore = parseFloat(largestScoreValue) * parseFloat(branchingVal.Weight__c);
                                scoreMap.totalPosibile = parseFloat(switchProbableScore);
                                console.log('scoreMap.totalPosibile >>'+scoreMap.totalPosibile);
                                //totalSwitchProbableScore += parseFloat(switchProbableScore);
                                switchScoreValue.splice(0, switchScoreValue.length);
                                if (selectedScoreQstnIds.indexOf(branchingVal.Question__r.Id) === -1) {
                                    selectedScoreQstnIds.push(branchingVal.Question__r.Id);
                                    selectedScore.push(scoreMap);
                                }
                            }
                        }
                    }   
                }*/
            }

        }
        component.set("v.selectedScoreIds", selectedScoreQstnIds);
        component.set("v.selectedScore", selectedScore);
        component.set("v.calculatedScore", totalSwitchScore);
        component.set("v.scoreTotalValues", totalSwitchProbableScore);
    }
    ,
    getQuesCategory: function(component, event, vQnaireId, vSectionId) {
        var action = component.get("c.getQueCategory"); //Calling Apex class controller 'getQueCategory' method
        action.setCallback(this, function(res) {
            var state = res.getState();
            if (state === "SUCCESS") {
                component.set("v.lstQuesCategory", res.getReturnValue());

            } else {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error :",
                    "mode": "sticky",
                    "message": res.getError()[0].message
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    createQuestion: function(component, event, vQnaireId, vSectionId, vDragId, colNumber) {
        var vQues = component.get("v.objCrteQues");
        vQues.Type__c = vDragId;
        var vQnaireName = component.get("v.QnaireName");
        var action = component.get("c.createQuestnAndQuestnQnaire"); //Calling Apex class controller 'createQueQnaire' method
        var vQuesOrder = '2';
        action.setParams({
            qnaireId: vQnaireId,
            qGroupId: vSectionId,
            question: vQues,
            qnaireName: vQnaireName,
            qOrder: vQuesOrder,
            colNumber: colNumber
        });
        action.setCallback(this, function(res) {
            var state = res.getState();
            if (state === "SUCCESS") {
                component.set("v.isShowModal", false);
                this.getAllQuestion(component, event, vQnaireId, vSectionId);
                this.removeQuesValue(component, event);
            } else {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error :",
                    "mode": "sticky",
                    "message": res.getError()[0].message
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);

    },
    removeQuesValue: function(component, event) {
        var data = {
            'sobjectType': 'Question__c',
            'Label__c': '',
            'Type__c': '',
            'Help_Text__c': '',
            'Allow_Comment__c': false,
            'Allow_Attachments__c': false,
            'Category__c': '',
            ' Required__c': false
        }

        component.set("v.objCrteQues", data);
        component.set("v.description", "");
    },
    deleteQuestion: function(component, event, vQuestnQuestnnaireId) {
        var vQnaireId = component.get("v.QnaireId");
        var vSectionId = component.get("v.selTabId");
        var action = component.get("c.delQuestion"); //Calling Apex class controller 'delQuestion' method
        action.setParams({
            questnQuestnnaireId: vQuestnQuestnnaireId
        });
        action.setCallback(this, function(res) {
            var state = res.getState();
            if (state === "SUCCESS") {
                this.getAllQuestion(component, event, vQnaireId, vSectionId);

            } else {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error :",
                    "mode": "sticky",
                    "message": res.getError()[0].message
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    editQuestion: function(component, event, vQuesId) {
        var action = component.get("c.getQuesDetail"); //Calling Apex class controller 'getQuesDetail' method
        action.setParams({
            quesId: vQuesId
        });
        action.setCallback(this, function(res) {
            var state = res.getState();
            if (state === "SUCCESS") {
                var data = res.getReturnValue();
                if (data.Question_Options__r != null) {
                    for (var i = 0; i < data.Question_Options__r.length; i++) {
                        data.Question_Options__r[i].isEditOption = false;
                    }
                }
                component.set("v.objQues", data);
                component.set("v.description", component.get("v.objQues.Label__c"));
                component.set("v.isEditQue", true);
                component.set("v.modalHeader", component.get("v.objQues.Type__c"));

                if (component.get("v.objQues.Type__c") === "Date") {
                    component.set("v.isShowDateModal", true);
                } else if (component.get("v.objQues.Type__c") === "URL") {
                    component.set("v.isShowURLModal", true);
                } else if (component.get("v.objQues.Type__c") === "DateTime") {
                    component.set("v.isShowDatetimeModal", true);
                } else if (component.get("v.objQues.Type__c") === "TextPlain") {
                    component.set("v.isShowTextPlainModal", true);
                } else if (component.get("v.objQues.Type__c") === "RichText") {
                    component.set("v.isShowRichTextModal", true);
                } else if (component.get("v.objQues.Type__c") === "Address") {
                    component.set("v.isShowAddressModal", true);
                } else if (component.get("v.objQues.Type__c") === "Email") {
                    component.set("v.isShowEmailModal", true);
                } else if (component.get("v.objQues.Type__c") === "Phone") {
                    component.set("v.isShowPhoneModal", true);
                } else if (component.get("v.objQues.Type__c") === "Information") {
                    component.set("v.isShowInformationModal", true);
                } else if (component.get("v.objQues.Type__c") === "Checkbox") {
                    component.set("v.isShowCheckboxModal", true);
                } else if (component.get("v.objQues.Type__c") === "Number") {
                    component.set("v.isShowNumberAndCurrencyModal", true);
                } else if (component.get("v.objQues.Type__c") === "Picklist") {
                    component.set("v.isShowPicklistModal", true);
                } else if (component.get("v.objQues.Type__c") === "Lookup") {
                    component.set("v.isShowLookupModal", true);
                } else if (component.get("v.objQues.Type__c") === "Switch") {

                    component.set("v.isShowSwitchModal", true);
                } else if (component.get("v.objQues.Type__c") === "Slider") {
                    component.set("v.isShowSliderModal", true);
                } else if (component.get("v.objQues.Type__c") === "GPS Location") {
                    component.set("v.isShowGPSLocationModal", true);
                } else if (component.get("v.objQues.Type__c") === "Media") {
                    component.set("v.isShowMediaModal", true);
                } else if (component.get("v.objQues.Type__c") === "Signature") {
                    component.set("v.isShowSignatureModal", true);
                } else {
                    component.set("v.isShowModal", true);
                }

            } else {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error :",
                    "mode": "sticky",
                    "message": res.getError()[0].message
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    helperSaveEditQues: function(component, event) {
        var vQnaireId = component.get("v.QnaireId");
        var vSectionId = component.get("v.selTabId");
        var vDesc = component.get("v.description");
        component.set("v.objQues.Label__c", vDesc);
        var vQues = component.get("v.objQues");
        var action = component.get("c.saveEditQuesRecord"); //Calling Apex class controller 'saveEditQuesRecord' method
        action.setParams({
            oQues: vQues
        });
        action.setCallback(this, function(res) {
            var state = res.getState();
            if (state === "SUCCESS") {
                this.getAllQuestion(component, event, vQnaireId, vSectionId);

                component.set("v.isShowModal", false);
            } else {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error :",
                    "mode": "sticky",
                    "message": res.getError()[0].message
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    saveSectionHelper: function(component, event, sectionName, questionaryId, columnNo) {
        //Calling Apex class controller 'createQueQnaire' method
        var action = component.get("c.createSection");
        action.setParams({
            sectionName: sectionName,
            questionaryId: questionaryId,
            columnNumber: columnNo
        });
        action.setCallback(this, function(res) {
            var state = res.getState();
            if (state === "SUCCESS") {
                var response = res.getReturnValue();
                component.set("v.isShowSection", false);
                component.set("v.selectedSection", response.Id);
                component.set("v.selTabId", response.Id);
                this.getQuesGroupRecord(component, event, questionaryId, "change");
            } else {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error :",
                    "mode": "sticky",
                    "message": res.getError()[0].message
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    minMaxWindowHelper: function(component, event, secId) {
        var acc = component.find(secId);
        for (var cmp in acc) {
            $A.util.toggleClass(acc[cmp], 'slds-show');
            $A.util.toggleClass(acc[cmp], 'slds-hide');
        }

    },
    minMaxWindowQstnHelper: function(component, event, secId) {
        var acc = component.find(secId);
        for (var cmp in acc) {
            $A.util.toggleClass(acc[cmp], 'slds-show');
            $A.util.toggleClass(acc[cmp], 'slds-hide');
        }

    },
    minMaxWindowPanelnHelper: function(component, event, secId) {
        var acc = component.find(secId);
        $A.util.addClass(acc, 'slds-hide');
    },
    showToast: function(component, event, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: 'Alert',
            message: message,
            duration: ' 5000',
            key: 'info_alt',
            type: 'error',
            mode: 'dismissible'
        });
        toastEvent.fire();
    },
    onlyReturnString: function(component, event, valueWithHtmlTag) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = valueWithHtmlTag;
        return tmp.textContent || tmp.innerText || "";
    },
    returnLargestSocreNumber: function(component, scoreArray) {
        return Math.max.apply(Math,scoreArray);
    },
    setOptionBranching: function(component, event, selctedOptionId, index) {
        var mainQuestion = component.get("v.lstQQuesnnaire.lstQuestn");
        var mainQuestionBranching = mainQuestion[index].Question_Questionnaires__r[0].branchingQuestnQuetnnaire;
        if (mainQuestionBranching !== undefined) {
            for (var indexMBranching = 0; indexMBranching < mainQuestionBranching.length; indexMBranching++) {
                mainQuestionBranching[indexMBranching].isShowQuestion = false;
            }
            var lstAddScore = []; //list for which want to count score in branching question.
            var lstRemoveScore = []; //list for which not count score in branching question.
            mainQuestion[index].Question_Questionnaires__r[0].branchingQuestnQuetnnaire = mainQuestionBranching;
            if (selctedOptionId !== undefined && selctedOptionId !== null && selctedOptionId.length > 0) {
                var lstQDynLogic = component.get("v.lstQDynLogicMain");
                var questnniareId = mainQuestion[index].Question_Questionnaires__r[0].Id;
                //remove question which is not set in Question option
                for (var branchingQuestnQuetnnaireIndex = 0; branchingQuestnQuetnnaireIndex < mainQuestionBranching.length; branchingQuestnQuetnnaireIndex++) {
                    for (var indexMainQDynLogic = 0; indexMainQDynLogic < lstQDynLogic.length; indexMainQDynLogic++) {

                        if (lstQDynLogic[indexMainQDynLogic].Show_Question_Questionnaire__c === mainQuestionBranching[branchingQuestnQuetnnaireIndex].Id &&
                            lstQDynLogic[indexMainQDynLogic].Question_Questionnaire__c === questnniareId &&
                            selctedOptionId === lstQDynLogic[indexMainQDynLogic].Question_Option__c) {
                            mainQuestionBranching[branchingQuestnQuetnnaireIndex].isShowQuestion = true;
                            if (lstRemoveScore.indexOf(mainQuestionBranching[branchingQuestnQuetnnaireIndex].Question__c) > -1) {
                                var alredyAddInRemvePoint = lstRemoveScore.indexOf(mainQuestionBranching[branchingQuestnQuetnnaireIndex].Question__c);
                                lstRemoveScore.splice(alredyAddInRemvePoint, 1);

                            }
                            lstAddScore.push(mainQuestionBranching[branchingQuestnQuetnnaireIndex].Question__c);
                        } else {
                            if (lstAddScore.indexOf(mainQuestionBranching[branchingQuestnQuetnnaireIndex].Question__c) === -1 && lstRemoveScore.indexOf(mainQuestionBranching[branchingQuestnQuetnnaireIndex].Question__c) === -1) {
                                lstRemoveScore.push(mainQuestionBranching[branchingQuestnQuetnnaireIndex].Question__c);
                            }
                        }
                    }
                }
                mainQuestion[index].Question_Questionnaires__r[0].branchingQuestnQuetnnaire = mainQuestionBranching;
            } else {
                for (var scorebranchgQuestnQnaireIndex = 0; scorebranchgQuestnQnaireIndex < mainQuestionBranching.length; scorebranchgQuestnQnaireIndex++) {
                    lstRemoveScore.push(mainQuestionBranching[scorebranchgQuestnQnaireIndex].Question__c);
                }
            }
            component.set("v.lstQQuesnnaire.lstQuestn", mainQuestion);
            //update score after change branching record.
            var selectedScoreQstnIds = component.get("v.selectedScoreIds");
            var selectedScore = component.get("v.selectedScore");
            var picklistScoreValue = [];
            for(var mianIndexBranching =0;mianIndexBranching<mainQuestionBranching.length;mianIndexBranching++){
                //console.log('mainQuestionBranching[mianIndexBranching]');
                //console.log(mainQuestionBranching[mianIndexBranching]);
                if(lstAddScore.indexOf(mainQuestionBranching[mianIndexBranching].Question__c)!==-1 && mainQuestionBranching[mianIndexBranching].Question__r.Type__c==='Switch'){
                    //var data = listquestions[index];
                    var value =false;
                    var switchScoreValues = [];
                    var qstnOptionData = mainQuestionBranching[mianIndexBranching].QuestionOptions;
                    var qstnId = mainQuestionBranching[mianIndexBranching].Question__c;
                    var qstnWeight = (mainQuestionBranching[mianIndexBranching].Weight__c !==undefined? mainQuestionBranching[mianIndexBranching].Weight__c:1);
                    var totalpossible = 0.0;
                    var totalscore = 0.0;
                    var scoreFoundInOptn = false;
                    var scoreMap = {
                        qstnId: qstnId,
                        score: 0.0,
                        totalPosibile: 0.0,
                        is_AddSroce : true
                    };
                    if (selectedScoreQstnIds.indexOf(qstnId) === -1) {
                        selectedScoreQstnIds.push(qstnId);
                        selectedScore.push(scoreMap);
                    }
                    var index1 = selectedScoreQstnIds.indexOf(qstnId);
                    var mainQuestionOptionId ="";
                    if (value === true) {
                        mainQuestionOptionId =qstnOptionData[0].Id;
                        if (qstnOptionData[0].Score__c !== undefined) {
                            scoreMap.score = qstnOptionData[0].Score__c*qstnWeight;
                            scoreFoundInOptn = true;
                        }
                    }
                    if (value === false) {
                        mainQuestionOptionId =qstnOptionData[1].Id;
                        if (qstnOptionData[1].Score__c !== undefined) {
                            scoreMap.score = qstnOptionData[1].Score__c*qstnWeight;
                            scoreFoundInOptn = true;
                        }
                    }
                    if (scoreFoundInOptn) {
                        if(qstnOptionData[0].Score__c !== undefined){
                            switchScoreValues.push(qstnOptionData[0].Score__c);
                        }
                        if(qstnOptionData[1].Score__c !== undefined){
                            switchScoreValues.push(qstnOptionData[1].Score__c);
                        }
                        var largestScoreValue = this.returnLargestSocreNumber(component, switchScoreValues);
                        var posibleScoreWithWeight = parseFloat(largestScoreValue) * parseFloat(qstnWeight);
                        scoreMap.totalPosibile = parseFloat(posibleScoreWithWeight);
                    }
                    selectedScore.splice(index1, 1, scoreMap);
                    for (var i = 0; i < selectedScore.length; i++) {
                        if(selectedScore[i].is_AddSroce === true){
                            totalpossible += parseFloat(selectedScore[i].totalPosibile);
                            totalscore += parseFloat(selectedScore[i].score);
                        }
                    }
                    component.set("v.scoreTotalValues", totalpossible);
                    component.set("v.calculatedScore", totalscore);
                }
            }
            if (lstRemoveScore !== undefined && lstRemoveScore.length > 0) {
                var totalpossibleVal = 0.0;
                var totalscoreVal = 0.0;
                for (var indexRemoveScore = 0; indexRemoveScore < lstRemoveScore.length; indexRemoveScore++) {
                    var indexRemovePoint = selectedScoreQstnIds.indexOf(lstRemoveScore[indexRemoveScore]);
                    if (indexRemovePoint !== -1) {
                        selectedScore[indexRemovePoint].is_AddSroce = false;
                    }
                }
                var isUpdate = false;
                for (var indexMainScore = 0; indexMainScore < selectedScore.length; indexMainScore++) {
                    if (selectedScore[indexMainScore].is_AddSroce === true) {
                        totalpossibleVal += parseFloat(selectedScore[indexMainScore].totalPosibile);
                        totalscoreVal += parseFloat(selectedScore[indexMainScore].score);
                        isUpdate = true;
                    }
                }
                if (isUpdate === true) {
                    component.set("v.scoreTotalValues", totalpossibleVal);
                    component.set("v.calculatedScore", totalscoreVal);
                    component.set("v.selectedScore", selectedScore);
                }
            }
            /*
            var selctedOptionId = event.getSource().get("v.value");
        var index = parseInt(event.getSource().get("v.name").replace("sel_", ""), 10);
        var listquestions = component.get("v.lstQQuesnnaire.lstQuestn");
        var selectedScoreQstnIds = component.get("v.selectedScoreIds");
        var selectedScore = component.get("v.selectedScore");
        var picklistScoreValue = [];
        var data = listquestions[index];
        var qstnOptionData = data.Question_Options__r;
        var qstnId = data.Id;
        var qstnWeight = (data.Question_Questionnaires__r[0].Weight__c !==undefined?data.Question_Questionnaires__r[0].Weight__c:1);
        var totalpossible = 0.0;
        var totalscore = 0.0;
        var scoreFoundInOptn = false;
        var scoreMap = {
            qstnId: qstnId,
            score: 0.0,
            totalPosibile: 0.0,
            is_AddSroce : true
        };
        if (selectedScoreQstnIds.indexOf(qstnId) === -1) {
            selectedScoreQstnIds.push(qstnId);
            selectedScore.push(scoreMap);
        }
        var index1 = selectedScoreQstnIds.indexOf(qstnId);
        
        for (var i = 0; i < qstnOptionData.length; i++) {
            if(qstnOptionData[i].Score__c!==undefined){
              picklistScoreValue.push(qstnOptionData[i].Score__c);  
            }
            if (qstnOptionData[i].Id === selctedOptionId) {
                if (qstnOptionData[i].Score__c !== undefined) {
                    scoreMap.score = qstnOptionData[i].Score__c*qstnWeight;
                    scoreFoundInOptn = true;
                }
            }
        }
        if (scoreFoundInOptn) {
            var largestScoreValue = helper.returnLargestSocreNumber(component, picklistScoreValue);
            var posibleScoreWithWeight = parseFloat(largestScoreValue) * parseFloat(qstnWeight);
            scoreMap.totalPosibile = parseFloat(posibleScoreWithWeight);
        }
        
        selectedScore.splice(index1, 1, scoreMap);
        for (var j = 0; j < selectedScore.length; j++) {
            if(selectedScore[j].is_AddSroce === true){
                totalpossible += parseFloat(selectedScore[j].totalPosibile);
                totalscore += parseFloat(selectedScore[j].score);
            }
        }
        component.set("v.scoreTotalValues", totalpossible);
        component.set("v.calculatedScore", totalscore);





            var totalpossible = 0.0;
            var totalscore = 0.0;
            var selectedScoreQstnIds = component.get("v.selectedScoreIds");
            var selectedScore = component.get("v.selectedScore");

            if (lstAddScore !== undefined && lstAddScore.length > 0) {
                for (var indexAddScore = 0; indexAddScore < lstAddScore.length; indexAddScore++) {
                    var indexPoint = selectedScoreQstnIds.indexOf(lstAddScore[indexAddScore]);
                    if (indexPoint !== -1) {
                        selectedScore[indexPoint].is_AddSroce = true;
                    }
                }
            }
            if (lstRemoveScore !== undefined && lstRemoveScore.length > 0) {
                for (var indexRemoveScore = 0; indexRemoveScore < lstRemoveScore.length; indexRemoveScore++) {
                    var indexRemovePoint = selectedScoreQstnIds.indexOf(lstRemoveScore[indexRemoveScore]);
                    if (indexRemovePoint !== -1) {
                        selectedScore[indexRemovePoint].is_AddSroce = false;
                    }
                }
            }
            var isUpdate = false;
            for (var indexMainScore = 0; indexMainScore < selectedScore.length; indexMainScore++) {
                if (selectedScore[indexMainScore].is_AddSroce === true) {
                    totalpossible += parseFloat(selectedScore[indexMainScore].totalPosibile);
                    totalscore += parseFloat(selectedScore[indexMainScore].score);
                    isUpdate = true;
                }
            }
            if (isUpdate === true) {
                component.set("v.scoreTotalValues", totalpossible);
                component.set("v.calculatedScore", totalscore);
                component.set("v.selectedScore", selectedScore);
            }
            */
        }

    },
    sortListQuestionQuestionnaire: function(component, event, arrayQQuesnnaire) {
        var done = false;
        while (!done) {
            done = true;
            for (var i = 1; i < arrayQQuesnnaire.length; i += 1) {
                if (arrayQQuesnnaire[i - 1].Question_Questionnaires__r[0].Question_Order__c > arrayQQuesnnaire[i].Question_Questionnaires__r[0].Question_Order__c) {
                    done = false;
                    var tmp = arrayQQuesnnaire[i - 1];
                    arrayQQuesnnaire[i - 1] = arrayQQuesnnaire[i];
                    arrayQQuesnnaire[i] = tmp;
                }
            }
        }

        return arrayQQuesnnaire;
    }
})