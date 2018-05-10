({
    getParameterByName: function(name) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var url = window.location.href;
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
        
    },
    callScriptsLoaded: function(component, event) {
        //$(".dropSection").sortable();
        /*
        $(".selecttableField").draggable({
            helper: 'clone',
            revert: "invalid",
            tolerance: "fit",
            // appendTo: "body",
            zIndex: 10000,
            //connectToSortable: '.sortableArea',
            //cursorAt: { top: 200 },
            start: function(event, ui) {

                $(ui.helper).addClass("ui-draggable-helper");
                $(ui.helper).width($('.selecttableField').width());
                if ($(".qf-left-panel").hasClass("slds-is-fixed")) {

                } else {
                    $(ui.helper).css('margin-top', '-180px');
                }
            }

        });
        
        $(".questionBuilder-left-box").height($(window).height() - $(".cQFQuesLibraryComp").height() - 350);
        var win_height = $(window).height();
        window.onscroll = function() {
            var _top = 88; //$("#oneHeader").height()+20;
            if (document.body.scrollTop > 180 || document.documentElement.scrollTop > 180) {
                var questnLfPanel = component.get("v.questnLfPanel");
                if(!questnLfPanel) {
                    var styleVal ='width :'+$(".qf-left-panel").width()+'px;';
                    var questionBuilderleftbox = 'height :'+(win_height - $(".cQFQuesLibraryComp").height() - 250)+';'; 
                    styleVal =styleVal+' height :'+(win_height - 180)+'px;';
                    styleVal =styleVal+' top :'+( _top + 10)+'px;';
                    component.set("v.questionBuilderleftbox",questionBuilderleftbox);
                    component.set("v.questnLfPanelStyleValue",styleVal);
                    component.set("v.questnLfPanel"," slds-is-fixed");
                }
            } else {
                var questnLfPanel = component.get("v.questnLfPanel");
                if(questnLfPanel ===" slds-is-fixed") {
                    component.set("v.questnLfPanel","");
                    component.set("v.questnLfPanelStyleValue","");
                    component.set("v.questionBuilderleftbox",win_height - $(".cQFQuesLibraryComp").height() - 350);
                }
            }
        }*/
    },
    getQuestionnaireRecord: function(component, event) {
        var vQnaireId = component.get("v.QnaireId");
        var vSectionId = '';
        this.getTempRecord(component, event, vQnaireId);
        this.getQuesGroupRecord(component, event, vQnaireId);

    },
    getTempRecord: function(component, event, vQnaireId) {
        var action = component.get("c.getTemplateRecord"); //Calling Apex class controller 'getTemplateRecrod' method
        action.setParams({
            qnaireId: vQnaireId
        });
        action.setCallback(this, function(res) {
            var state = res.getState();
            if (state === "SUCCESS") {
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
    getQuesGroupRecord: function(component, event, vQnaireId) {
        var action = component.get("c.getAllQuestnGrpNameForQuesnnaire"); //Calling Apex class controller 'getAllQuestnGrpNameForQuesnnaire' method
        var self = this;
        action.setParams({
            sQnaireId: vQnaireId
        });
        action.setCallback(this, function(res) {
            component.set("v.Spinner",false);
            var state = res.getState();
            if (state === "SUCCESS") {
                component.set("v.lstQuesGroup", res.getReturnValue());
                var lstQGroup = component.get("v.lstQuesGroup");
				console.log("lstQGroup==========="+lstQGroup.length);
                if(lstQGroup.length===1){
                	component.set("v.ShowBtn", true);    
                }
                var btn = component.get("v.ShowBtn");
                console.log("ShowBtn==========="+btn);
                component.set("v.selTabId", lstQGroup[0].GKN_FB__Question_Group__c);
                self.getAllQuestion(component, event, vQnaireId, lstQGroup[0].GKN_FB__Question_Group__c);
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
            sectionId: vSectionId
        });
        action.setCallback(this, function(res) {
            var state = res.getState();
            if (state === "SUCCESS") {
                component.set("v.lstQQuesnnaire", res.getReturnValue());
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
                     duration: ' 5000',
                    "message": res.getError()[0].message
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    onlyReturnString: function(component, event, valueWithHtmlTag) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = valueWithHtmlTag;
        return tmp.textContent || tmp.innerText || "";
    },
    getAllQuestionNext: function(component, event, vQnaireId) {
      	
        if(!this.validateForm(component)){
            return;
        }
        component.set("v.Spinner",true);
        console.log(vQnaireId);
        var action = component.get("c.getQuestionGroup"); //Calling Apex class controller 'getQuestionGroup' method
        action.setParams({
            qnaireId: vQnaireId
        });
        console.log("vQnaireId++++++"+vQnaireId);
        action.setCallback(this, function(res) {
            var state = res.getState();     
            component.set("v.Spinner",false);
            if (state === "SUCCESS") {
                console.log(res.getReturnValue());
                component.set("v.lstQQuesnnaire", res.getReturnValue());
                var lstQGroup = component.get("v.lstQQuesnnaire");
                if(lstQGroup.groupId !==undefined){
                    component.set("v.prevBtn", true);
                    console.log('lstQGroup.lstSize'+lstQGroup.lstSize);
                    if(lstQGroup.lstSize<=1){
                        component.set("v.prevBtn", true);
                        component.set("v.nextBtn", false);
                    }
                    component.set("v.selTabId", lstQGroup.groupId);
                    console.log("v.selTabId++++++++"+lstQGroup.groupId);
                    this.getAllQuestion(component, event, vQnaireId, lstQGroup.groupId);
                }else{
                    component.set("v.nextBtn", false);
                }
            }
        });
        $A.enqueueAction(action);
    },
    getAllQuestionPrevious: function(component, event, vQnaireId) {
      	component.set("v.Spinner",true);
        console.log(vQnaireId);
        var action = component.get("c.getQuestionGroupPrevious"); //Calling Apex class controller 'getQuestionGroupPrevious' method
        action.setParams({
            qnaireId: vQnaireId
        });
        console.log("vQnaireId++++++"+vQnaireId);
        action.setCallback(this, function(res) {
            var state = res.getState();
            component.set("v.Spinner",false);
            console.log("state++++++"+state);
            if (state === "SUCCESS") {
                console.log("res.getReturnValue()++++++"+res.getReturnValue());
                component.set("v.lstQQuesnnaire", res.getReturnValue());
                var lstQGroup = component.get("v.lstQQuesnnaire");
                if(lstQGroup.groupId !==undefined){
                    component.set("v.nextBtn", true);
                    console.log('lstQGroup.lstSize'+lstQGroup.lstSize);
                    if(lstQGroup.lstSize<=1){
                        component.set("v.nextBtn", true);
                        component.set("v.prevBtn", false);
                    }
                    component.set("v.selTabId", lstQGroup.groupId);
                    console.log("v.selTabId++++++++"+lstQGroup.groupId);
                    this.getAllQuestion(component, event, vQnaireId, lstQGroup.groupId);
                }else{
                    component.set("v.prevBtn", false);
                }
            }
        });
        $A.enqueueAction(action);
    },
    validateForm: function (cmp) {
        var allValid = cmp.find('inputFields').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);        
        if(!allValid){
            this.showToast("Warning!","error","Please update the invalid form entries and try again!");
        }
        return allValid;
     },
     showToast:function(title,type,message){
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "type" : type,
            "message": message
        });
        toastEvent.fire();
     }
})