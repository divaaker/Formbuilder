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
            helper.showNewToast('Error: ', 'error', 'Geo Location is not supported');
        }
    },
    
    checkboxOption : function(component, event, helper){
        try
        {
            var mainQuestionOptionId ="";
            var index = parseInt(event.getSource().get("v.name").split("_")[1], 10);
            var col = event.getSource().get("v.name").split("_")[2];
            var sectionIndex = event.getSource().get("v.name").split("_")[3];
            var listsect = component.get("v.lstQQuesnnaire.sectionList");
            var listquestions = [];

            if(col=="col1Questions"){
                listquestions = listsect[sectionIndex].col1Questions;
            }
            else if(col=="col2Questions"){
                listquestions = listsect[sectionIndex].col2Questions;
            }
            else if(col=="col3Questions"){
                listquestions = listsect[sectionIndex].col3Questions;
            }

            var qstnOptionData = listquestions.lstQuestn[index].GKN_FB__Question_Options__r;
            if (event.getSource().get("v.checked")) {
                mainQuestionOptionId =qstnOptionData[0].Id;
            }
            if (!event.getSource().get("v.checked")) {
                mainQuestionOptionId =qstnOptionData[1].Id;
            }
            if (listquestions.lstQuestn[index].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Is_Allow_Branching__c === true) {            
                helper.setOptionBranching(component, event, mainQuestionOptionId, index,col,sectionIndex);
            }
        }
        catch(e)
        {
            console.log(e);
        }
    },
    
    setPicklistScore: function(component, event, helper) {
        try
        {
            var selctedOptionId = event.getSource().get("v.value");
            var index = parseInt(event.getSource().get("v.label").split("_")[1], 10);
            var col = event.getSource().get("v.label").split("_")[2];
            var sectionIndex = event.getSource().get("v.label").split("_")[3];
            
            var listsect = component.get("v.lstQQuesnnaire.sectionList");
            
            var listquestions = [];
            if(col=="col1Questions"){
                listquestions = listsect[sectionIndex].col1Questions;    
            }
            else if(col=="col2Questions"){
                listquestions = listsect[sectionIndex].col2Questions;    
            }
            else if(col=="col3Questions"){
                listquestions = listsect[sectionIndex].col3Questions;    
            }
            
            if (listquestions.lstQuestn[index].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Is_Allow_Branching__c === true) {            
                helper.setOptionBranching(component, event, selctedOptionId, index,col,sectionIndex);
            }
        }
        catch(e)
        {
            console.log(e);
        }
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
    
    getCharLimit: function(component, event, helper) {
        var ctarget = event.currentTarget;
        var id_str = ctarget.dataset.value;
        component.set("v.richTextCharLimit", parseInt(id_str, 10));
    },        
    showSignModel: function(component, event, helper) {
        var questionId = event.getSource().get("v.value");
        component.set("v.questionId",questionId);
        component.set('v.showSign', true);
    },
})