({
    doInit: function(component, event, helper) {
        window.onscroll = function() {};
        if($A.util.isEmpty(component.get("v.recordId"))){

            var vQnaireId = helper.getParameterByName('id');
            if(vQnaireId==undefined || vQnaireId==null || vQnaireId=='null' || vQnaireId==''){
                component.set("v.Spinner", false);
                return;
            }            
            component.set("v.recordId",vQnaireId);
            component.set("v.QnaireId",vQnaireId);

        }else{
            component.set("v.QnaireId",component.get("v.recordId"));
        }     

        helper.getQuestionnaireRecord(component, event);
        helper.getQuesCategory(component, event);
    },
    nextSection:function(component,event,helper){        
        var isValid1 = helper.validateForm(component);
        var isValid2 = helper.validateForm2(component);
        var isValidLookupField = component.get("v.isLookupFiledValid");
        console.log(isValid1+','+isValid2+','+isValidLookupField);

        if(isValid1 && isValid2 && isValidLookupField){
            //Save filled form value
            helper.saveQuestionResponseHelper(component);    

            //code to get next section questions
            var detailtemp = [];
            component.set("v.selectedScoreIds", detailtemp);
            component.set("v.selectedScore", detailtemp);
            component.set("v.calculatedScore", 0.0);
            component.set("v.scoreTotalValues", 0.0);
            
            var questionSection=component.get("v.lstQuesGroup");
            var sectionNo= component.get("v.keepSectionNo");
            var vQnaireId = component.get("v.QnaireId");
            var vSectionId = questionSection[sectionNo+1].GKN_FB__Question_Group__c;
            helper.getAllQuestion(component, event, vQnaireId, vSectionId);
            component.set("v.disablePrevSection",true);
            var length=questionSection.length-1;
            sectionNo = sectionNo+1;
            document.documentElement.scrollTop = 0;
            if(sectionNo<length){
                component.set("v.keepSectionNo",sectionNo);
            }
            if(sectionNo===length){
                component.set("v.keepSectionNo",sectionNo);
                component.set("v.disableNextSection",false);
            }
        }
        else
        {
            helper.showNewToast('ERROR : ','error','Please update the invalid form entries and try again.');
        }
    },
    previousSection:function(component,event,helper){
        var detailtemp = [];
        component.set("v.selectedScoreIds", detailtemp);
        component.set("v.selectedScore", detailtemp);
        component.set("v.calculatedScore", 0.0);
        component.set("v.scoreTotalValues", 0.0);
        var questionSection=component.get("v.lstQuesGroup");
        var sectionNo= component.get("v.keepSectionNo");
        var vQnaireId = component.get("v.QnaireId");
        sectionNo = sectionNo-1;
        var vSectionId = questionSection[sectionNo].GKN_FB__Question_Group__c;
        component.set("v.disableNextSection",true);
        helper.getAllQuestion(component, event, vQnaireId, vSectionId);
        component.set("v.keepSectionNo",sectionNo);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        if(sectionNo===0){
            component.set("v.disablePrevSection",false);
        }
    },
    saveResponseClick:function(component,event,helper){
        var isValid1 = helper.validateForm(component);
        var isValid2 = helper.validateForm2(component);
        var isValidLookupField = component.get("v.isLookupFiledValid");


        if(isValid1 && isValid2 && isValidLookupField){        
            //console.log(JSON.stringify(component.get("v.lstQQuesnnaire.lstQuestn")));
            helper.saveQuestionResponseHelper(component);    
        }
        else
        {
            helper.showNewToast('ERROR : ','error','Please update the invalid form entries and try again.');
        }
        
    },
    handleLookupValidationInfoEvent:function(component,event,helper){
        component.set("v.isLookupFiledValid",true);
        var lookupValues = component.get("v.lookupValues");

        var isValid = event.getParam("isValid");
        var questionId = event.getParam("questionId");
        for(var i=0;i<lookupValues.length;i++)
        {
            if(lookupValues[i].questionId==questionId){
                lookupValues.splice(i,1);
            }                
        }
        lookupValues.push({questionId:questionId,isValid:isValid});
        component.set("v.lookupValues",lookupValues);
        for(var i=0;i<lookupValues.length;i++)
        {
            if(!lookupValues[i].isValid){
                component.set("v.isLookupFiledValid",false);
            }
        }
        console.log(lookupValues);
    },
    handleLookupValueEvent:function(component, event, helper){
        
        var qid = event.getParam("questionId"),fval = event.getParam("responseText");
        var lstQuestion = component.get("v.lstQQuesnnaire");

        if (lstQuestion !== undefined && lstQuestion !== null && lstQuestion.lstQuestn !== undefined && lstQuestion.lstQuestn !== null && lstQuestion.lstQuestn.length > 0)
        {
            for (var resIndex = 0; resIndex < lstQuestion.lstQuestn.length; resIndex++)
            {
                if(lstQuestion.lstQuestn[resIndex].GKN_FB__Type__c==='Lookup' && lstQuestion.lstQuestn[resIndex].Id==qid)
                {
                    lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue1 = fval;
                }
            }
        }
    },
    onBlurEvent: function(component, event, helper){
        /*var questId = event.getSource().get("v.name").split('_')[1];

        //alert(questId)
        var lstQuestion = component.get("v.lstQQuesnnaire");
        if (lstQuestion !== undefined && lstQuestion !== null && lstQuestion.lstQuestn !== undefined && lstQuestion.lstQuestn !== null && lstQuestion.lstQuestn.length > 0)
        {
            try{
                //start response code//
                for (var resIndex = 0; resIndex < lstQuestion.lstQuestn.length; resIndex++)
                {
                    if(lstQuestion.lstQuestn[resIndex].GKN_FB__Type__c=='Switch')
                    {
                        if(questId==lstQuestion.lstQuestn[resIndex].Id)
                        {
                            var val1= lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[0].GKN_FB__Value__c;
                            var val2= lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[1].GKN_FB__Value__c;
                            console.log('isChecked: '+event.getSource().get("v.checked"));
                            if(event.getSource().get("v.checked"))
                            {
                                lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue1 = val1;
                                console.log(val1);
                            }
                            else
                            {
                                lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue1 = val2;
                                console.log(val2);
                            }
                        }
                    }
                }
            }
            catch(e){
                console.log(e);
            }
        }*/
    },
    
    handleDateTypeField:function(component, event, helper){
        return false;
        /*var resp = component.get("v.responseList");
        var isExist=false;
        //alert('test');
        var isComment =false,qid;
        var fval = event.getSource().get("v.value");
        var fname = event.getSource().get("v.labelClass").split('_');
        qid = fname[1];
        if(fname[0]=='comment'){
            isComment = true;                
        }else{
            isComment = false;
        }
        for(var i=0;i<resp.length;i++)
        {
            if(resp[i].iscomment && resp[i].qid==qid){
                resp.splice(i, 1);
                resp.push({"qid":qid,"rtext":fval,"iscomment":isComment});
                isExist=true;
            }
            else if(resp[i].iscomment==isComment && resp[i].qid==qid){
                resp.splice(i, 1);
                resp.push({"qid":qid,"rtext":fval,"iscomment":isComment});
                isExist=true;
            }
        }
        if(!isExist){
            resp.push({"qid":qid,"rtext":fval,"iscomment":isComment});
        }
        console.log(JSON.stringify(resp));*/
    },
    handleSlider: function(component, event, helper) {
        return false;
        /*var resp = component.get("v.responseList");
        var isExist=false;
        //alert('test');
        var isComment =false,qid;
        var fval = event.getSource().get("v.value");
        var fname = event.getSource().get("v.label");        
        fname = fname.split('_');
        qid = fname[1];
        if(fname[0]=='comment'){
            isComment = true;                
        }else{
            isComment = false;
        }
        for(var i=0;i<resp.length;i++)
        {
            if(resp[i].iscomment && resp[i].qid==qid){
                resp.splice(i, 1);
                resp.push({"qid":qid,"rtext":fval,"iscomment":isComment});
                isExist=true;
            }
            else if(resp[i].iscomment==isComment && resp[i].qid==qid){
                resp.splice(i, 1);
                resp.push({"qid":qid,"rtext":fval,"iscomment":isComment});
                isExist=true;
            }
        }
        if(!isExist){
            resp.push({"qid":qid,"rtext":fval,"iscomment":isComment});
        }
        console.log(JSON.stringify(resp));*/
    },

    handleGPSField: function(component, event, helper) {
        return false;
        /*var resp = component.get("v.responseList");
        var isExist=false;
        //alert('test');
        var qid,rtext='Latitude: 0, Longitude: 0';
        var fval = event.getSource().get("v.value");
        var fname = event.getSource().get("v.name").split('_');
        qid = fname[1];
        
        if(fname[0]=='latitude'){
            rtext = rtext.replace(/Latitude: ([0-9\.\-]+)/i,'Latitude: '+fval);
        }else{
            rtext = rtext.replace(/Longitude: ([0-9\.\-]+)/i,'Longitude: '+fval);
        }

        for(var i=0;i<resp.length;i++)
        {
            if(resp[i].iscomment==false && resp[i].qid==qid){
                rtext = resp[i].rtext;
                if(fname[0]=='latitude'){
                    rtext = rtext.replace(/Latitude: ([0-9\.\-]+)/i,'Latitude: '+fval);
                }else{
                    rtext = rtext.replace(/Longitude: ([0-9\.\-]+)/i,'Longitude: '+fval);
                }
                resp.splice(i, 1);
                resp.push({"qid":qid,"rtext":rtext,"iscomment":false});
                isExist=true;
            }
        }
        if(!isExist){
            resp.push({"qid":qid,"rtext":rtext,"iscomment":false});
        }
        console.log(JSON.stringify(resp));*/
    },
    handleClick: function(component, event, helper) {
        
    },
    hideModal: function(component, event, helper) {
        component.set("v.isShowModal", false);
        component.set("v.isEditQue", false);
        component.set("v.isShowSection", false);
        component.set("v.isBranchedQuestion",false);
        $(".dropSection").removeClass("dropSectionHighlight");
        component.set("v.isShowHelpText", false);
        component.set("v.alertMsg", '');
        component.set("v.questionDeleteModal", false);
        component.set("v.isTemplatePublished", false)
    },
    tabSelected: function(component, event, helper) {
        var detailtemp = [];
        component.set("v.selectedScoreIds", detailtemp);
        component.set("v.selectedScore", detailtemp);
        component.set("v.calculatedScore", 0.0);
        component.set("v.scoreTotalValues", 0.0);
        var vQnaireId = component.get("v.QnaireId");
        var vSectionId = component.get("v.selTabId");
        helper.getAllQuestion(component, event, vQnaireId, vSectionId);
        helper.callScriptsLoaded(component, event);
        
        
    },
    saveQues: function(component, event, helper) {
        var vQnaireId = component.get("v.QnaireId");
        var vSectionId = component.get("v.selTabId");
        var dropColNumber = component.get("v.dropColNumber");
        var vDragId = component.get("v.dragId");
        var richTextId = component.find("qustNameRich");
        var qustnlabel = richTextId.get("v.value");
        var categoryId = component.find("categoryId");
        var categoryValue = categoryId.get("v.value");
        if (!categoryValue) {
            component.set("v.alertMsg", "Select category");
            return false;
        } else if (!qustnlabel) {
            component.set("v.alertMsg", "write your question");
            return false;
        } else if (component.get("v.isShowHelpText") === true) {
            var helpText = component.find("helpTextInp");
            var helpTextValue = helpText.get("v.value");
            if (!helpTextValue) {
                component.set("v.alertMsg", "Enter help text");
                return false;
            }
        }
        
        if (qustnlabel.length <= 255) {
            helper.createQuestion(component, event, vQnaireId, vSectionId, vDragId, dropColNumber);
            component.set("v.isShowHelpText", false);
            $(".dropSection").removeClass("dropSectionHighlight");
        } else {
            component.set("v.alertMsg", "character's Length should not exceed 255");
        }
    },
    delQues: function(component, event, helper) {
        if(!isNaN(event.getSource().get("v.name"))){
            var index = parseInt(event.getSource().get("v.name"), 10);
            var listquestions = component.get("v.lstQQuesnnaire.lstQuestn");
            var questionData = listquestions[index];
            var isAllowBranch=questionData.GKN_FB__Question_Questionnaires__r[0].GKN_FB__Is_Allow_Branching__c;
            if(isAllowBranch){
                component.set("v.isBranchedQuestion",true);
            }
            else{
                component.set("v.questionDeleteModal", true);
                var target = event.getSource();
                var vQId = target.get("v.value");
                component.set("v.deleteQuestionId", vQId); 
            }
        }
        else{
            component.set("v.questionDeleteModal", true);
            var targetevent = event.getSource();
            var vMainQId = targetevent.get("v.value");
            component.set("v.deleteQuestionId", vMainQId); 
        }
    },
    delQuestionRecord: function(component, event, helper) {
        
        helper.deleteQuestion(component, event, component.get("v.deleteQuestionId"));
        component.set("v.questionDeleteModal", false);
    },
    getOnlyOneQuestionRecrod: function(component, event, helper) {
        var target = event.getSource();
        var vQId = target.get("v.value");
        helper.editQuestion(component, event, vQId);
    }
    ,
    getBranchingOnlyOneQuestionRecrod: function(component, event, helper) {
        var target = event.getSource();
        var vQId = target.get("v.value");
        component.set("v.is_BranchingUnder",true);
        helper.editQuestion(component, event, vQId);
    },
    saveEditQuesrecord: function(component, event, helper) {
        var richTextId = component.find("qustNameRich");
        var qustnlabel = richTextId.get("v.value");
        
        if (qustnlabel.length <= 255) {
            helper.helperSaveEditQues(component, event);
        } else {
            showToast(component, event, "character's Length should not exceed 255.");
        }
    },
    showSectionModel: function(component, event, helper) {
        component.set("v.isShowSection", true);
    },
    saveSection: function(component, event, helper) {
        var section = component.find('sectionName');
        var sectionName = section.get("v.value");
        var vQnaireId = component.get("v.QnaireId");
        //var columnNo=component.get("v.selColumnNo");
        var columnNo = '1';
        //alert(columnNo);
        helper.saveSectionHelper(component, event, sectionName, vQnaireId, columnNo);
    },
    showHelpText: function(component, event, helper) {
        var helpText = component.get("v.isShowHelpText");
        if (helpText === false) {
            component.set("v.isShowHelpText", true);
            
        } else {
            component.set("v.isShowHelpText", false);
        }
    },
    showpublishConfirmModal: function(component, event, helper) {
        component.set("v.isTemplatePublished",true);
    },
    minMaxWindowQstn: function(component, event, helper) {
        helper.minMaxWindowQstnHelper(component, event, 'articleOneQstn');
    },
    display: function(component, event, helper) {
        helper.toggleHelper(component, event);
    },
    displayOut: function(component, event, helper) {
        helper.toggleHelper(component, event);
    },
    minMaxCol1: function(component, event, helper) {
        helper.minMaxWindowHelper(component, event, 'column1');
    },
    minMaxCol2: function(component, event, helper) {
        helper.minMaxWindowHelper(component, event, 'column2');
    },
    deleteSection: function(component, event, helper) {
        component.set("v.openDeleteModal", true);
        component.set("v.deleteModal", true);
        component.set("v.deleteModalContent", "Do you want to delete section along with questions?");
        
    },
    nullify: function(comp, ev, hel) {
        var target = ev.getSource();
        target.set("v.value", "");
    },
    
    nullifyDate: function(comp, ev, hel) {
        var target = ev.getSource();
        target.set("v.value", "");
    },
    validateURL: function(component, event, helper) {
        var url = component.get("v.url");
    },
    // this function automatic call by aura:waiting event  
    showSpinner: function(component, event, helper) {
        // make Spinner attribute true for display loading spinner 
        component.set("v.Spinner", true);
    },
    
    // this function automatic call by aura:doneWaiting event 
    hideSpinner: function(component, event, helper) {
        // make Spinner attribute to false for hide loading spinner    
        component.set("v.Spinner", false);
    },
    handleDeleteModelEvent: function(component, event, helper) {
        var vQnaireId = component.get("v.QnaireId");
        var isCloseModal = event.getParam("closeDeleteModel");
        var isRecordDelete = event.getParam("deleteRecord");
        if (isCloseModal === true && isRecordDelete === false) {
            component.set("v.deleteModal", false);
        } else if (isCloseModal === true && isRecordDelete === true) {
            helper.getQuesGroupRecord(component, event, vQnaireId,"delete section");
            component.set("v.deleteModal", false);
        }
    },
    checkTextLenght: function(component, event, helper) {
        alert(0);
        var target = event.getSource();
        var qustnlabel = target.get("v.value");
        if (qustnlabel !== undefined && qustnlabel !== "" && qustnlabel.trim().length !== 0) {
            qustnlabel = helper.onlyReturnString(component, event, qustnlabel);
            var allowTextLength = parseInt(component.get("v.richTextCharLimit"), 10);
            if (qustnlabel.trim().length > allowTextLength) {
                var message = "Character's Length should not exceed " + allowTextLength;
                helper.showToast(component, event, message);
                return false;
            }
        }
    },
    getCharLimit: function(component, event, helper) {
        var ctarget = event.currentTarget;
        var id_str = ctarget.dataset.value;
        component.set("v.richTextCharLimit", parseInt(id_str, 10));
    },
    onRadio: function(cmp, evt) {
        var resultCmp;
        var selected = evt.getSource().get("v.label");
        resultCmp = cmp.find("radioResult");
        resultCmp.set("v.value", selected);
    },
    openBranchingPopup: function(component, event, helper) {
        var questionOrder = parseInt(event.getSource().get("v.name").replace("Qustn_Branching_", ""), 10);
        var index = parseInt(event.getSource().get("v.value"), 10);
        
        var listquestions = component.get("v.lstQQuesnnaire.lstQuestn");
        var questionData = listquestions[index].GKN_FB__Question_Questionnaires__r[0].Id;
        var lstQDynLogicOption = listquestions[index].GKN_FB__Question_Options__r;
        
        component.set("v.questionQuestnnaireBranchingId", listquestions[index].GKN_FB__Question_Questionnaires__r[0].Id);
        component.set("v.questionPrintOrder", questionOrder);
        component.set("v.lstQDynLogicOption", lstQDynLogicOption);
        component.set("v.openBranchingModal", true);
    },
    showSignModel: function(component, event, helper) {
        var questionId = event.getSource().get("v.value");
        component.set("v.questionId",questionId);
        component.set('v.showSign', true);
    },
    getCurrentLocation: function(component, event, helper) {
        var questionId = event.getSource().get("v.value");

        var index = parseInt(event.getSource().get("v.name").replace("GeoBtn_", ""), 10);
        var listquestions = component.get("v.lstQQuesnnaire.lstQuestn");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                listquestions[index].Lat = position.coords.latitude;
                listquestions[index].Lng = position.coords.longitude;

                listquestions[index].GKN_FB__Question_Questionnaires__r[0].responseValue1 = position.coords.latitude;
                listquestions[index].GKN_FB__Question_Questionnaires__r[0].responseValue2 = position.coords.longitude;
                component.set("v.lstQQuesnnaire.lstQuestn", listquestions);                
            });
        } else {
            helper.showToast(component, event, 'Geo Location is not supported');
        }
    },
    setScore: function(component, event, helper) {
        var scoreAndWeight = event.getSource().get("v.value");
        var qstnId = event.getSource().get("v.name");
        
        var selectedScore = component.get("v.selectedScore");
        var selectedScoreIds = component.get("v.selectedScoreIds");
        
        var scoreAndWeightSplit = scoreAndWeight.split("~");
        var scoreValArray = [];
        var qstnOptionData;
        var scoreMap = {
            qstnId: qstnId,
            score: scoreAndWeightSplit[0],
            totalPosibile: 0.0,
            is_AddSroce : true
        };
        if (selectedScoreIds.indexOf(qstnId) === -1) {
            selectedScoreIds.push(qstnId);
            selectedScore.push(scoreMap);
        }
        var action = component.get("c.getScoreAndWeight");
        action.setParams({
            qstnId: qstnId,
        });
        action.setCallback(this, function(res) {
            var state = res.getState();
            if (state === "SUCCESS") {
                qstnOptionData = res.getReturnValue();
                for (var i = 0; i < qstnOptionData.length; i++) {
                    scoreValArray.push(qstnOptionData[i].GKN_FB__Score__c);
                }
                var largestScoreValue = helper.returnLargestSocreNumber(component, scoreValArray);
                var totalScoreWithWith = largestScoreValue * scoreAndWeightSplit[1];
                scoreMap.totalPosibile = totalScoreWithWith;
                var index = selectedScoreIds.indexOf(qstnId);
                selectedScore.splice(index, 1, scoreMap);
                var totalpossible = 0.0;
                var totalscore = 0.0;
                for (var j = 0; j < selectedScore.length; j++) {
                    if(selectedScore[j].is_AddSroce === true){
                        totalpossible += parseFloat(selectedScore[j].totalPosibile);
                        totalscore += parseFloat(selectedScore[j].score);
                    }
                }
                
                component.set("v.selectedScoreIds", selectedScoreIds);
                component.set("v.selectedScore", selectedScore);
                component.set("v.scoreTotalValues", totalpossible);
                component.set("v.calculatedScore", totalscore);
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
    getSwitchScore: function(component, event, helper) {
        var value = event.getSource().get("v.value");
        var index = parseInt(event.getSource().get("v.name").replace("name_", ""), 10);
        var selectedScoreQstnIds = component.get("v.selectedScoreIds");
        var selectedScore = component.get("v.selectedScore");
        var listquestions = component.get("v.lstQQuesnnaire.lstQuestn");
        var data = listquestions[index];
        var switchScoreValues = [];
        var qstnOptionData = data.GKN_FB__Question_Options__r;
        
        var mainQuestionOptionId ="";
        if (event.getSource().get("v.checked") === true) {
            mainQuestionOptionId =qstnOptionData[0].Id;
            data.GKN_FB__Question_Questionnaires__r[0].responseValue1 = data.GKN_FB__Question_Options__r[0].GKN_FB__Name__c;
        }
        if (event.getSource().get("v.checked") === false) {
            mainQuestionOptionId =qstnOptionData[1].Id;
            data.GKN_FB__Question_Questionnaires__r[0].responseValue1 = data.GKN_FB__Question_Options__r[1].GKN_FB__Name__c;
        }
        
        if (data.GKN_FB__Question_Questionnaires__r[0].GKN_FB__Is_Allow_Branching__c === true) {
            helper.setOptionBranching(component, event, mainQuestionOptionId, index);
        }
        
    },
    checkboxOption : function(component, event, helper){
        var questId = event.getSource().get("v.name").split('_')[1];
        var index = parseInt(event.getSource().get("v.name").replace("name_", ""), 10);
        var listquestions = component.get("v.lstQQuesnnaire.lstQuestn");
        var data = listquestions[index];
        console.log(listquestions);
        console.log(event.getSource().get("v.name").replace("name_", ""));

        var qstnOptionData = data.GKN_FB__Question_Options__r;
        data.GKN_FB__Question_Questionnaires__r[0].responseValue1 = event.getSource().get("v.checked");
        var mainQuestionOptionId ="";
        if (event.getSource().get("v.checked")) {
            mainQuestionOptionId =qstnOptionData[0].Id;
        }
        if (!event.getSource().get("v.checked")) {
            mainQuestionOptionId =qstnOptionData[1].Id;
        }

        if (data.GKN_FB__Question_Questionnaires__r[0].GKN_FB__Is_Allow_Branching__c === true) {
            
            helper.setOptionBranching(component, event, mainQuestionOptionId, index);
        }
    },
    getBranchingSwitchScore: function(component, event, helper) {
        var question_indexPoint =  component.get("v.branchingQuestnIndex");
        var value = event.getSource().get("v.value");
        var branchingindex = parseInt(event.getSource().get("v.name").replace("sel_", ""), 10);
        var selectedScoreQstnIds = component.get("v.selectedScoreIds");
        var selectedScore = component.get("v.selectedScore");
        var listquestions = component.get("v.lstQQuesnnaire.lstQuestn");
        var data = listquestions[question_indexPoint];
        var switchScoreValues = [];
        var qstnOptionData = data.GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire[branchingindex].QuestionOptions;
        var qstnId = data.GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire[branchingindex].GKN_FB__Question__c;
        var qstnWeight = (data.GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire[branchingindex].GKN_FB__Weight__c !==undefined?data.GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire[branchingindex].GKN_FB__Weight__c:1);
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
        
        if (value === true) {
            if (qstnOptionData[0].GKN_FB__Score__c !== undefined) {
                scoreMap.score = qstnOptionData[0].GKN_FB__Score__c*qstnWeight;
                scoreFoundInOptn = true;
            }
        }
        if (value === false) {
            if (qstnOptionData[1].GKN_FB__Score__c !== undefined) {
                scoreMap.score = qstnOptionData[1].GKN_FB__Score__c*qstnWeight;
                scoreFoundInOptn = true;
            }
        }
        if (scoreFoundInOptn) {
            if(qstnOptionData[0].GKN_FB__Score__c !== undefined){
                switchScoreValues.push(qstnOptionData[0].GKN_FB__Score__c);
            }
            if(qstnOptionData[1].GKN_FB__Score__c !== undefined){
                switchScoreValues.push(qstnOptionData[1].GKN_FB__Score__c);
            }
            var largestScoreValue = helper.returnLargestSocreNumber(component, switchScoreValues);
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
        
    },
    redirectPreview: function(component, event, helper) {
        var vQnnaireId = component.get("v.QnaireId");
        var urlEvent = $A.get("e.force:navigateToURL");
        var vUrl = window.location.toString().replace('?tempId', '?previewTemp');
        urlEvent.setParams({
            "url": vUrl
        });
        urlEvent.fire();
    },
    setPicklistScore: function(component, event, helper) {
        var selctedOptionId = event.getSource().get("v.value");
        var index = parseInt(event.getSource().get("v.label").replace("sel_", ""), 10);
        var listquestions = component.get("v.lstQQuesnnaire.lstQuestn");
        var selectedScoreQstnIds = component.get("v.selectedScoreIds");
        var selectedScore = component.get("v.selectedScore");
        var picklistScoreValue = [];
        var data = listquestions[index];
        
        if (data.GKN_FB__Question_Questionnaires__r[0].GKN_FB__Is_Allow_Branching__c === true) {            
            helper.setOptionBranching(component, event, selctedOptionId, index);
        }
        
    },
    setBranchingPicklistScore: function(component, event, helper) {
        var question_indexPoint =  component.get("v.branchingQuestnIndex");
        var selctedOptionId = event.getSource().get("v.value");
        var branchingindex = parseInt(event.getSource().get("v.name").replace("sel_", ""), 10);
        var listquestions = component.get("v.lstQQuesnnaire.lstQuestn");
        var selectedScoreQstnIds = component.get("v.selectedScoreIds");
        var selectedScore = component.get("v.selectedScore");
        var picklistScoreValue = [];
        var data = listquestions[question_indexPoint];
        
        var qstnOptionData = data.GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire[branchingindex].QuestionOptions;
        var qstnId = data.GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire[branchingindex].GKN_FB__Question__c;
        var qstnWeight = (data.GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire[branchingindex].GKN_FB__Weight__c !==undefined?data.GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire[branchingindex].GKN_FB__Weight__c:1);
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
            if(qstnOptionData[i].GKN_FB__Score__c !== undefined){
                picklistScoreValue.push(qstnOptionData[i].GKN_FB__Score__c);
            }
            if (qstnOptionData[i].Id === selctedOptionId) {
                if (qstnOptionData[i].GKN_FB__Score__c !== undefined) {
                    scoreMap.score = qstnOptionData[i].GKN_FB__Score__c*qstnWeight;
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
    },
    getbranchingQuestionIndex : function(component,event,helper){
        var ctarget = event.currentTarget;
        var question_index = ctarget.dataset.value;
        var index = parseInt(question_index.replace("sel_", ""), 10); 
        component.set("v.branchingQuestnIndex", parseInt(index, 10));
    },
    addQuestnInSection: function(component, event, helper) {
        var index = parseInt(event.getSource().get("v.value"), 10);
        var listquestions = component.get("v.lstQQuesnnaire.lstQuestn");
        var data = listquestions[index];
        component.set("v.questionQuestnnaireInSection", data.GKN_FB__Question_Questionnaires__r[0]);
        component.set("v.isAddQuestionInSectionModal", true);
    },
    getbranchingCurrentLocation : function(component,event,helper){
        var branchingIndex = parseInt(event.getSource().get("v.name").replace("GeoBranchBtn_", ""), 10);
        var qutnIndex = parseInt(event.getSource().get("v.value").replace("GeoBranchBtn_", ""), 10);
        var listquestions = component.get("v.lstQQuesnnaire.lstQuestn");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                listquestions[qutnIndex].GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire[branchingIndex].Lat = position.coords.latitude;
                listquestions[qutnIndex].GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire[branchingIndex].Lng = position.coords.longitude;
                component.set("v.lstQQuesnnaire.lstQuestn", listquestions);
            });
        } else {
            helper.showToast(component, event, 'Geo Location is not supported');
        }
    },
    publishTemplate:function(component,event,helper){
        var vQnaireId = component.get("v.QnaireId");
        var action = component.get("c.setpublishStatusOnTemplate"); //Calling Apex class controller 'getTemplateRecrod' method
        action.setParams({
            templateId: vQnaireId
        });
        action.setCallback(this, function(res) {
            var state = res.getState();
            if (state === "SUCCESS") {
                var appEvent = $A.get("e.c:QFSetActiveHeaderEvt");
                appEvent.setParams({ "compName": "search"});
                appEvent.fire();
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
    sendBackToTemplate:function(component,event,helper){
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get("v.QnaireId"),
            "slideDevName": "detail",
            "isredirect": true
        });
        navEvt.fire();
    },
    
    handleCloseModelEvent:function(component,event,helper){
        var vQnaireId = component.get("v.QnaireId");
        var vSectionId = component.get("v.selTabId");
        var closeModel = event.getParam("closeModel");
        var isUpdateRecord = event.getParam("isUpdateRecord");
        var modelName = event.getParam("modelName");

        var signData = event.getParam("signData");
        if(signData!=undefined && signData!="")
        {
            var image = new Image();
            image.id = "pic"+component.get("v.questionId");
            image.src = signData;
            image.width=200;
            document.getElementById("sig_"+component.get("v.questionId")).innerHTML='';
            document.getElementById("sig_"+component.get("v.questionId")).appendChild(image);
        }

        component.set("v.is_BranchingUnder",false);
        //close modal when click on modal close icon of date
        if (closeModel === true && modelName === "Signature") {
            component.set("v.showSign", false);
            component.set("v.isShowSignatureModal", false);
        } else if (isUpdateRecord === true && modelName === "Signature") {
            helper.getAllQuestion(component, event, vQnaireId, vSectionId);
            component.set("v.isShowSignatureModal", false);
        } 
    }
})