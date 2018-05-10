({    
    getQuestionnaireRecord: function(component, event) {
        var vQnaireId = component.get("v.QnaireId");
        var vSectionId = '';        
        this.getTempRecord(component, event, vQnaireId);
        this.getQuesGroupRecord(component, event, vQnaireId, "");
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
    getQuestionResponsesHelper:function(component,lstQuestion,vSectionId){
        
        var self = this;
        var data;
        var action = component.get("c.getQuestionResponses");        
        action.setParams({"questionnaireId":component.get("v.recordId")});
        action.setCallback(this,function(res){
            var state = res.getState();
            if (state === "SUCCESS") {
                var obj = JSON.parse(res.getReturnValue());
                component.set("v.questionResponses",obj);
                //console.log(JSON.stringify(lstQuestion.lstQuestn));
                try
                {
                    var lstUnderbranchingResponseOption =[];
                    var lstUnderbranchingResponseOption2 =[];                    
                    if (lstQuestion !== undefined && lstQuestion !== null && lstQuestion.lstQuestn !== undefined && lstQuestion.lstQuestn !== null && lstQuestion.lstQuestn.length > 0)
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
                                    for(var optionIndex =0;optionIndex<lstQuestionOptions.length;optionIndex++){                                                
                                        if(data ===lstQuestionOptions[optionIndex].Id) {
                                            lstUnderbranchingResponseOption2.push(lstQuestionOptions[optionIndex].Id);
                                        }
                                    }
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
                        for(var ind=0;ind<obj.length;ind++)
                        {
                            data = obj[ind].GKN_FB__Answer__c;
                            for (var resIndex = 0; resIndex < lstQuestion.lstQuestn.length; resIndex++)
                            {
                                if(lstQuestion.lstQuestn[resIndex].Id==obj[ind].GKN_FB__Question__c)
                                {
                                    if(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Question__r.GKN_FB__Type__c=='GPS Location')
                                    {
                                        lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue1 = obj[ind].GKN_FB__Answer__c.split(' ')[0];
                                        lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue2 = obj[ind].GKN_FB__Answer__c.split(' ')[1];
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
                                        console.log('Name__c: '+lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Options__r[0].GKN_FB__Name__c);
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
                                        lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue1 = obj[ind].GKN_FB__Answer__c;
                                        lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].responseValue2 = '';
                                    }
                                    
                                    if(obj[ind].GKN_FB__Comment__c!=undefined)
                                    lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].comment = obj[ind].GKN_FB__Comment__c;

                                    // set Attachment response
                                    if(obj[ind].Attachments!=undefined)
                                    {
                                        for(var i=0;i<obj[ind].Attachments.totalSize;i++)
                                        {
                                            if(lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].attachment==''){
                                                lstQuestion.lstQuestn[resIndex].GKN_FB__Question_Questionnaires__r[0].attachment = obj[ind].Attachments.records[i].Name;
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

                    if(obj.length==0){
                        lstUnderbranchingResponseOption = lstUnderbranchingResponseOption2    
                    }
                    self.setQuestionBranching(component, event, lstQuestion, vSectionId,lstUnderbranchingResponseOption);                  
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
    saveQuestionResponseHelper:function(component){
        var self = this;
        var resp = JSON.stringify(component.get("v.lstQQuesnnaire.lstQuestn"));
        var action = component.get("c.saveQuestionResponse");
        component.set("v.Spinner",true);

        var resp = resp.replace(/__c/g, "");
        resp = resp.replace(/GKN_FB__/g, "");
        resp = resp.replace(/__r/g, "r");

        console.log(resp);

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
                else
                {
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
    
    handleGPSHelper : function(component,fval,qid,type){
        /*var resp = component.get("v.responseList");
        var isExist=false;
        
        var qid,rtext='Latitude: 0, Longitude: 0';
        
        if(type=='latitude'){
            rtext = rtext.replace(/Latitude: ([0-9\.\-]+)/i,'Latitude: '+fval);
        }else{
            rtext = rtext.replace(/Longitude: ([0-9\.\-]+)/i,'Longitude: '+fval);
        }

        for(var i=0;i<resp.length;i++)
        {
            if(resp[i].iscomment==false && resp[i].qid==qid){
                rtext = resp[i].rtext;
                if(type=='latitude'){
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
                console.log(JSON.stringify(res.getReturnValue()));
                
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
        var self = this;
        component.set("v.Spinner", true);
        var action = component.get("c.getQuestnsForQuesGroup2"); //Calling Apex class controller 'getQuestnForQuesGroup' method
        action.setParams({
            qnaireId: vQnaireId,
            sectionId: vSectionId,
        });
        action.setCallback(this, function(res) {
            component.set("v.Spinner", false);
            var state = res.getState();
            if (state === "SUCCESS") {
                var totalSwitchScore = 0.0;
                var totalSwitchProbableScore = 0.0;
                var switchProbableScore = 0.0;
                var switchScoreValue = [];
                var selectedScore = component.get("v.selectedScore");
                var selectedScoreQstnIds = component.get("v.selectedScoreIds");
                
                var lstQuestion = res.getReturnValue();
                self.getQuestionResponsesHelper(component,lstQuestion,vSectionId);
                
            } else {
                self.showNewToast("Error: ",'error',res.getError()[0].message);
            }
        });
        $A.enqueueAction(action);
    },
    setQuestionBranching: function(component, event, lstQuestion, vSectionId,lstUnderbranchingResponseOption) {

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
            component.set("v.Spinner", true);
            action.setCallback(this, function(res) {
                

                component.set("v.Spinner", false);
                var state = res.getState();
                if (state === "SUCCESS") {
                    var lstQDynLogic = res.getReturnValue();
                    
                    try{
                        component.set("v.lstQDynLogicMain", lstQDynLogic);
                        var lstQuestnOption =lstUnderbranchingResponseOption;
                        /**for (var indexMainQuetn = 0; indexMainQuetn < question.length; indexMainQuetn++) {
                            if (question[indexMainQuetn].GKN_FB__Question_Options__r !== undefined && question[indexMainQuetn].GKN_FB__Question_Options__r.length > 0 && (question[indexMainQuetn].GKN_FB__Type__c === 'Switch' || question[indexMainQuetn].GKN_FB__Type__c === 'Checkbox')) {
                                lstQuestnOption.push(question[indexMainQuetn].GKN_FB__Question_Options__r[1].Id);
                            }
                        }**/

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
                                lstQuestion.lstQuestn = this.sortListQuestionQuestionnaire(component, event, question);
                                //this.setMainScore(component,lstQuestion);                                
                                component.set("v.lstQQuesnnaire", lstQuestion);
                                component.set("v.lstQQuesnnaireMain", lstQuestion);
                            }

                        } 
                        else {

                            lstQuestion.lstQuestn = this.sortListQuestionQuestionnaire(component, event, lstQuestion.lstQuestn);
                            //this.setMainScore(component,lstQuestion);
                            component.set("v.lstQQuesnnaire", lstQuestion);
                            component.set("v.lstQQuesnnaireMain", lstQuestion);
                        }
                    }
                    catch(e){
                        console.log(e);
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
            //this.setMainScore(component,lstQuestion);
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
                if (qstnsData[i].GKN_FB__Type__c === 'Switch') {
                    var swithQstnOptn = qstnsData[i].GKN_FB__Question_Options__r;
                    if (swithQstnOptn !== null) {

                        if (swithQstnOptn[1].GKN_FB__Score__c !== undefined) {
                            //console.log('data >>');
                            //console.log(data);
                            scoreMap.qstnId = qstnsData[i].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Question__c;
                            scoreMap.score = parseFloat(swithQstnOptn[1].GKN_FB__Score__c) * parseFloat(qstnsData[i].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Weight__c);
                            totalSwitchScore = parseFloat(swithQstnOptn[1].GKN_FB__Score__c) * parseFloat(qstnsData[i].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Weight__c) + totalSwitchScore;
                           
                            if(swithQstnOptn[0].GKN_FB__Score__c !== undefined){
                                switchScoreValue.push(swithQstnOptn[0].GKN_FB__Score__c);
                            }
                            if(swithQstnOptn[1].GKN_FB__Score__c !== undefined){
                                switchScoreValue.push(swithQstnOptn[1].GKN_FB__Score__c);
                            }
                            scoreMap.is_AddSroce = true;
                            var largestScoreValue = this.returnLargestSocreNumber(component, switchScoreValue);
                            switchProbableScore = parseFloat(largestScoreValue) * parseFloat(qstnsData[i].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Weight__c);
                            scoreMap.totalPosibile = parseFloat(switchProbableScore);
                            totalSwitchProbableScore += parseFloat(switchProbableScore);
                            switchScoreValue.splice(0, switchScoreValue.length);
                            if (selectedScoreQstnIds.indexOf(qstnsData[i].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Question__c) === -1) {
                                selectedScoreQstnIds.push(qstnsData[i].GKN_FB__Question_Questionnaires__r[0].GKN_FB__Question__c);
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
        component.set("v.Spinner", true);
        var vQues = component.get("v.objCrteQues");
        vQues.GKN_FB__Type__c = vDragId;
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
            component.set("v.Spinner", false);
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
            'GKN_FB__Label__c': '',
            'GKN_FB__Type__c': '',
            'GKN_FB__Help_Text__c': '',
            'GKN_FB__Allow_Comment__c': false,
            'GKN_FB__Allow_Attachments__c': false,
            'GKN_FB__Category__c': '',
            'GKN_FB__Required__c': false
        }

        component.set("v.objCrteQues", data);
        component.set("v.description", "");
    },
    deleteQuestion: function(component, event, vQuestnQuestnnaireId) {
        component.set("v.Spinner", true);
        var vQnaireId = component.get("v.QnaireId");
        var vSectionId = component.get("v.selTabId");
        var action = component.get("c.delQuestion"); //Calling Apex class controller 'delQuestion' method
        action.setParams({
            questnQuestnnaireId: vQuestnQuestnnaireId
        });
        action.setCallback(this, function(res) {
            component.set("v.Spinner", true);
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
        component.set("v.Spinner", true);
        var action = component.get("c.getQuesDetail"); //Calling Apex class controller 'getQuesDetail' method
        action.setParams({
            quesId: vQuesId
        });
        action.setCallback(this, function(res) {
            component.set("v.Spinner", false);
            var state = res.getState();
            if (state === "SUCCESS") {
                var data = res.getReturnValue();
                if (data.GKN_FB__Question_Options__r != null) {
                    for (var i = 0; i < data.GKN_FB__Question_Options__r.length; i++) {
                        data.GKN_FB__Question_Options__r[i].isEditOption = false;
                    }
                }
                component.set("v.objQues", data);
                component.set("v.description", component.get("v.objQues.GKN_FB__Label__c"));
                component.set("v.isEditQue", true);
                component.set("v.modalHeader", component.get("v.objQues.GKN_FB__Type__c"));

                if (component.get("v.objQues.GKN_FB__Type__c") === "Date") {
                    component.set("v.isShowDateModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "URL") {
                    component.set("v.isShowURLModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "DateTime") {
                    component.set("v.isShowDatetimeModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "TextPlain") {
                    component.set("v.isShowTextPlainModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "RichText") {
                    component.set("v.isShowRichTextModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "Address") {
                    component.set("v.isShowAddressModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "Email") {
                    component.set("v.isShowEmailModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "Phone") {
                    component.set("v.isShowPhoneModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "Information") {
                    component.set("v.isShowInformationModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "Checkbox") {
                    component.set("v.isShowCheckboxModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "Number") {
                    component.set("v.isShowNumberAndCurrencyModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "Picklist") {
                    component.set("v.isShowPicklistModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "Lookup") {
                    component.set("v.isShowLookupModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "Switch") {

                    component.set("v.isShowSwitchModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "Slider") {
                    component.set("v.isShowSliderModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "GPS Location") {
                    component.set("v.isShowGPSLocationModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "Media") {
                    component.set("v.isShowMediaModal", true);
                } else if (component.get("v.objQues.GKN_FB__Type__c") === "Signature") {
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
        component.set("v.Spinner", true);
        var vQnaireId = component.get("v.QnaireId");
        var vSectionId = component.get("v.selTabId");
        var vDesc = component.get("v.description");
        component.set("v.objQues.GKN_FB__Label__c", vDesc);
        var vQues = component.get("v.objQues");
        var action = component.get("c.saveEditQuesRecord"); //Calling Apex class controller 'saveEditQuesRecord' method
        action.setParams({
            oQues: vQues
        });
        action.setCallback(this, function(res) {
            component.set("v.Spinner", true);
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
        component.set("v.Spinner", true);
        var action = component.get("c.createSection");
        action.setParams({
            sectionName: sectionName,
            questionaryId: questionaryId,
            columnNumber: columnNo
        });
        action.setCallback(this, function(res) {
            component.set("v.Spinner", false);
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
    onlyReturnString: function(component, event, valueWithHtmlTag) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = valueWithHtmlTag;
        return tmp.textContent || tmp.innerText || "";
    },
    returnLargestSocreNumber: function(component, scoreArray) {
        return Math.max.apply(Math,scoreArray);
    },
    setOptionBranching: function(component, event, selctedOptionId, index) {
        try
        {
            var mainQuestion = component.get("v.lstQQuesnnaire.lstQuestn");
            var mainQuestionBranching = mainQuestion[index].GKN_FB__Question_Questionnaires__r[0].branchingQuestnQuetnnaire;
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
                component.set("v.lstQQuesnnaire.lstQuestn", mainQuestion);
            }
        }
        catch(e){
            console.log(e);
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
    }
})