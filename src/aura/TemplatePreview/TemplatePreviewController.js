({
    scriptsLoaded: function(component, event, helper) {
        helper.callScriptsLoaded(component, event);        
    },
    doInit: function(component, event, helper) {
        var vQnaireId = helper.getParameterByName('id');
        console.log('vQnaireId: '+vQnaireId);
        if(vQnaireId==undefined || vQnaireId==null || vQnaireId=='null' || vQnaireId==''){
            return;
        }
        component.set("v.Spinner",true);
        component.set("v.QnaireId",vQnaireId);
        helper.getQuestionnaireRecord(component, event);
        helper.getQuesCategory(component, event);                
        helper.getQuesGroupRecord(component, event, vQnaireId);        
    },
    onBlurEvent: function(component, event, helper){
        var resp = component.get("v.responseList");
        var isExist=false;
        if(event.getSource().get('v.validity').valid)
        {            
            var isComment =false,qid;
            var fval = event.getSource().get("v.value");
            if(fval==null){return;}
            var fname = event.getSource().get("v.name").split('_');
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
                else if(resp[i].qid==qid){
                    resp.splice(i, 1);
                    resp.push({"qid":qid,"rtext":fval,"iscomment":isComment});
                    isExist=true;
                }
            }
            if(!isExist){
                resp.push({"qid":qid,"rtext":fval,"iscomment":isComment});
            }        
        }
        console.log(JSON.stringify(resp));
    },
    
    handleDateTypeField:function(component, event, helper){
        var resp = component.get("v.responseList");
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
            else if(!resp[i].iscomment && resp[i].qid==qid){
                resp.splice(i, 1);
                resp.push({"qid":qid,"rtext":fval,"iscomment":isComment});
                isExist=true;
            }
        }
        if(!isExist){
            resp.push({"qid":qid,"rtext":fval,"iscomment":isComment});
        }
        console.log(JSON.stringify(resp));
    },
    handleClick: function(component, event, helper) {
        
    },
    hideModal: function(component, event, helper) {
        component.set("v.isShowModal", false);
        component.set("v.isEditQue", false);
        component.set("v.isShowSection", false);
        $(".dropSection").removeClass("dropSectionHighlight");
        //helper.removeQuesValue(component, event);
        component.set("v.isShowHelpText", false);
        component.set("v.alertMsg", '');
        component.set("v.questionDeleteModal", false);
    },
    tabSelected: function(component, event, helper) {
        var vQnaireId = component.get("v.QnaireId");
        var vSectionId = component.get("v.selTabId");
        console.log("vSectionId+++++"+vSectionId);
        helper.getAllQuestion(component, event, vQnaireId, vSectionId);
        helper.callScriptsLoaded(component, event); 
    },
    tabNext: function(component, event, helper) {
        var vQnaireId = component.get("v.QnaireId");
        console.log("vQnaireId+++++"+vQnaireId);
        helper.getAllQuestionNext(component, event, vQnaireId);
        helper.callScriptsLoaded(component, event);
        
    },
    tabPrevious: function(component, event, helper) {
        var vQnaireId = component.get("v.QnaireId");
        console.log("vQnaireId+++++"+vQnaireId);
        helper.getAllQuestionPrevious(component, event, vQnaireId);
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
        component.set("v.questionDeleteModal", true);
        var target = event.getSource();
        var vQId = target.get("v.value");
        component.set("v.deleteQuestionId", vQId);
        
    },
    delQuestionRecord: function(component, event, helper) {
        
        helper.deleteQuestion(component, event, component.get("v.deleteQuestionId"));
        component.set("v.questionDeleteModal", false);
    },
    getOnlyOneQuestionRecrod: function(component, event, helper) {
        var target = event.getSource();
        var vQId = target.get("v.value");
        helper.editQuestion(component, event, vQId);
    },
    saveEditQuesrecord: function(component, event, helper) {
        var richTextId = component.find("qustNameRich");
        var qustnlabel = richTextId.get("v.value");
        
        if (qustnlabel.length <= 255) {
            helper.helperSaveEditQues(component, event);
        } else {
            showToast(component, event,"character's Length should not exceed 255.");
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
    minMaxWindow: function(component, event, helper) {
        helper.minMaxWindowHelper(component, event, 'articleOne');
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
    handleCloseModelEvent: function(component, event, helper) {
        var vQnaireId = component.get("v.QnaireId");
        var vSectionId = component.get("v.selTabId");
        var closeModel = event.getParam("closeModel");
        var isUpdateRecord = event.getParam("isUpdateRecord");
        var modelName = event.getParam("modelName");
        //close modal when click on modal close icon of date
        if (closeModel === true && modelName === "Date") {
            component.set("v.isShowDateModal", false);
        } else if (closeModel === true && modelName === "URL") {
            component.set("v.isShowURLModal", false);
        } else if (closeModel === true && modelName === "DateTime") {
            component.set("v.isShowDatetimeModal", false);
        }
        //close modal after save the record of date input
            else if (isUpdateRecord === true && modelName === "Date") {
                helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                component.set("v.isShowDateModal", false);
            }
        //close modal after save the record of URL input
                else if (isUpdateRecord === true && modelName === "URL") {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowURLModal", false);
                } else if (isUpdateRecord === true && modelName === "DateTime") {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowDatetimeModal", false);
                } else if (closeModel === true && (modelName === "TextPlain" || modelName === "Text (Plain)")) {
                    component.set("v.isShowTextPlainModal", false);
                } else if (isUpdateRecord === true && (modelName === "TextPlain" || modelName === "Text (Plain)")) {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowTextPlainModal", false);
                } else if (closeModel === true && (modelName === "RichText" || modelName === "Text (Rich)")) {
                    component.set("v.isShowRichTextModal", false);
                } else if (isUpdateRecord === true && (modelName === "RichText" || modelName === "Text (Rich)")) {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowRichTextModal", false);
                } else if (closeModel === true && modelName === "Address") {
                    component.set("v.isShowAddressModal", false);
                } else if (isUpdateRecord === true && modelName === "Address") {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowAddressModal", false);
                } else if (closeModel === true && modelName === "Email") {
                    component.set("v.isShowEmailModal", false);
                } else if (isUpdateRecord === true && modelName === "Email") {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowEmailModal", false);
                } else if (closeModel === true && modelName === "Phone") {
                    component.set("v.isShowPhoneModal", false);
                } else if (isUpdateRecord === true && modelName === "Phone") {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowPhoneModal", false);
                } else if (closeModel === true && (modelName === "Information" || modelName === "Information/Instruction")) {
                    component.set("v.isShowInformationModal", false);
                } else if (isUpdateRecord === true && (modelName === "Information" || modelName === "Information/Instruction")) {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowInformationModal", false);
                } else if (closeModel === true && modelName === "Checkbox") {
                    component.set("v.isShowCheckboxModal", false);
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                } else if (isUpdateRecord === true && modelName === "Checkbox") {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowCheckboxModal", false);
                } /*else if (closeModel === true && modelName === "MultiSelect") {
                    component.set("v.isShowMultiSelectModal", false);
                } else if (isUpdateRecord === true && modelName === "MultiSelect") {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowMultiSelectModal", false);
                } */
                else if (closeModel === true && modelName === "Picklist") {
                    component.set("v.isShowPicklistModal", false);
                } else if (isUpdateRecord === true && modelName === "Picklist") {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowPicklistModal", false);
                }else if (closeModel === true && (modelName === "Number/Currency" || modelName === "Number")) {
                    component.set("v.isShowNumberAndCurrencyModal", false);
                } else if (isUpdateRecord === true && (modelName === "Number/Currency" || modelName === "Number")) {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowNumberAndCurrencyModal", false);
                } else if (closeModel === true && modelName === "Lookup") {
                    component.set("v.isShowLookupModal", false);
                } else if (isUpdateRecord === true && modelName === "Lookup") {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowLookupModal", false);
                } else if (closeModel === true && modelName === "Signature") {
                    component.set("v.showSign", false);
                    component.set("v.isShowSignatureModal", false);
                } else if (isUpdateRecord === true && modelName === "Signature") {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowSignatureModal", false);
                } else if (closeModel === true && modelName === "Switch") {
                    component.set("v.isShowSwitchModal", false);
                } else if (isUpdateRecord === true && modelName === "Switch") {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowSwitchModal", false);
                } else if (closeModel === true && modelName === "Slider") {
                    component.set("v.isShowSliderModal", false);
                } else if (isUpdateRecord === true && modelName === "Slider") {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowSliderModal", false);
                } else if (closeModel === true && modelName === "GPS Location") {
                    component.set("v.isShowGPSLocationModal", false);
                } else if (isUpdateRecord === true && modelName === "GPS Location") {
                    helper.getAllQuestion(component, event, vQnaireId, vSectionId);
                    component.set("v.isShowGPSLocationModal", false);
                }//
        $(".dropSection").removeClass("dropSectionHighlight");
    },
    deleteSection: function(component, event, helper) {
        component.set("v.openDeleteModal", true);
        component.set("v.deleteModal", true);
        component.set("v.deleteModalContent", "Do you want to delete section along with questions?");
        
    },
    nullify: function(comp, ev, hel) {
        var target = ev.getSource();
        //target.set("v.value", "");
    },
    
    nullifyDate: function(comp, ev, hel) {
        var target = ev.getSource();
        //target.set("v.value", "");
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
            helper.getQuesGroupRecord(component, event, vQnaireId);
            component.set("v.deleteModal", false);
        }
    },
    checkTextLenght: function(component, event, helper) {
        var target = event.getSource();
        var qustnlabel = target.get("v.value");
        if (qustnlabel !== undefined && qustnlabel !== "" && qustnlabel.trim().length !==0) {
            qustnlabel = helper.onlyReturnString(component, event, qustnlabel);
            var allowTextLength = parseInt(component.get("v.richTextCharLimit"),10);
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
        component.set("v.richTextCharLimit", parseInt(id_str,10));
    },
    onRadio: function(cmp, evt) {
        var resultCmp;
        var selected = evt.getSource().get("v.label");
        resultCmp = cmp.find("radioResult");
        resultCmp.set("v.value", selected);
    },
    openBranchingPopup: function(component, event, helper) {
        component.set("v.openBranchingModal", true);
    },
    showSignModel: function(component, event, helper) {
        component.set('v.showSign', true);
    },
    getCurrentLocation : function(component,event,helper){
        var latId = component.find("latitudeId");
        var longId = component.find("longitudeId");
        if(navigator.geolocation){ 
            navigator.geolocation.getCurrentPosition(function(position){     
                //event.getSource().set("v.value",position.coords.longitude);
                //event.getSource().set("v.value",position.coords.latitude);
                latId.set("v.value",position.coords.latitude);
                longId.set("v.value",position.coords.longitude);
            });
        }else {
            helper.showToast(component, event, 'Geo Location is not supported');
        }
    },
    setScore:function(component,event,helper){
        var scoreAndWeight=event.getSource().get("v.value");
        var qstnId=event.getSource().get("v.name");
        var selectedScore=component.get("v.selectedScore");
        var selectedScoreIds = component.get("v.selectedScoreIds");
        
        var scoreAndWeightSplit=scoreAndWeight.split("~");
        var scoreValArray=[];
        var qstnOptionData;
        //alert(selectedScoreIds.indexOf(qstnId));
        var scoreMap = {
            qstnId: qstnId,
            score: scoreAndWeightSplit[0],
            totalPosibile:0.0
        };
        if(selectedScoreIds.indexOf(qstnId)===-1)
        {
            selectedScoreIds.push(qstnId);
            selectedScore.push(scoreMap);
        }
        
        
        
        var action=component.get("c.getScoreAndWeight");
        action.setParams({
            qstnId: qstnId,
        }); 
        action.setCallback(this, function(res) {
            var state = res.getState();
            if (state === "SUCCESS") {
                qstnOptionData=res.getReturnValue();
                for(var i=0;i<qstnOptionData.length;i++){
                    scoreValArray.push(qstnOptionData[i].Score__c);
                }
                var largestScoreValue=helper.returnLargestSocreNumber(component,scoreValArray);
                var totalScoreWithWith=largestScoreValue*scoreAndWeightSplit[1];
                scoreMap.totalPosibile = totalScoreWithWith;
                var index = selectedScoreIds.indexOf(qstnId);
                selectedScore.splice(index,1,scoreMap);
                var totalpossible = 0.0;
                var totalscore = 0.0;
                for(var i=0;i<selectedScore.length;i++){
                    totalpossible += parseFloat(selectedScore[i].totalPosibile);
                    totalscore += parseFloat(selectedScore[i].score);
                }
                component.set("v.selectedScoreIds",selectedScoreIds);
                component.set("v.selectedScore",selectedScore);
                component.set("v.scoreTotalValues",totalpossible);
                component.set("v.calculatedScore",totalscore);
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
    getSwitchScore:function(component, event, helper){
        var element = event.getSource().get("v.value");
    },
    redirectPreview: function(component, event, helper) {
        var vQnnaireId = component.get("v.QnaireId");
        var urlEvent = $A.get("e.force:navigateToURL");
        console.log("vQnnaireId====="+vQnnaireId);
        console.log("urlEvent====="+urlEvent);
        console.log(window.location.href);
        var vUrl = window.location.toString().replace('?previewTemp','?tempId');
        urlEvent.setParams({
                "url": vUrl
        });
        urlEvent.fire();
    }
})