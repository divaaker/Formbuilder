({
    doInit: function(component, event, helper) {
        var isEditQue = component.get("v.isEditQue");
        if (isEditQue === true) {
            component.set("v.description", component.get("v.objeditQues.GKN_FB__Label__c"));
            component.set("v.colorCode", component.get("v.objeditQues.GKN_FB__Metadata__c"));
        }
        var colorCodes = [
            { value: "#e3abec", name: "background: rgb(227, 171, 236)" },
            { value: "#c2dbf7", name: "background: rgb(194, 219, 247)" },
            { value: "#9fd6ff", name: "background: rgb(159, 214, 255)" },
            { value: "#9de7da", name: "background: rgb(157, 231, 218)" },
            { value: "#9df0c0", name: "background: rgb(157, 240, 192)" },
            { value: "#fff099", name: "background: rgb(255, 240, 153)" },
            { value: "#FFFFFF", name: "background: rgb(255,255,255)" }
        ];
        component.set("v.lstColorCodes", colorCodes);
    },
    showHelpText: function(component, event, helper) {
        var helpText = component.get("v.isShowHelpText");
        if (helpText === false)
            component.set("v.isShowHelpText", true);
        else
            component.set("v.isShowHelpText", false);
        //alert('ffr');
    },
    hideModal: function(component, event, helper) {
        helper.crudModalEvent(component, event, true, false);
    },
    saveQues: function(component, event, helper) {
        var message;
        var vQnaireId = component.get("v.QnaireId");
        var vSectionId = component.get("v.QuestnGroupId");
        var dropColNumber = component.get("v.dropColNumber");
        var vDragId = component.get("v.fieldType");
        var categoryId = component.find("categoryId");
        //var categoryValue = categoryId.get("v.value");
        //var richTextId = component.find("qustNameRich");
        var qustnlabel = component.get("v.description");
        var colorCode = component.get("v.colorCode");
        var vQues = component.get("v.objCrteQues");
        qustnlabel = helper.onlyReturnString(component, event, qustnlabel);
        /*if (!categoryValue) {
            message = "Select category!";
            helper.showToast(component, event, message);
            return false;
        } else*/
        if (!qustnlabel || qustnlabel.trim().length ===0) {
            message = "write your question";
            helper.showToast(component, event, message);
            return false;
        }


        if (qustnlabel.trim().length <= 10000 && qustnlabel.trim().length !==0) {
            helper.createQuestion(component, event, vQnaireId, vSectionId, vDragId, dropColNumber, colorCode);
        } else {
            message = "Character's Length should not exceed 10000.";
            helper.showToast(component, event, message);
        }
    },
    saveEditQuesrecord: function(component, event, helper) {
        var message;
        var categoryId = component.find("categoryId");
        var vQues = component.get("v.objeditQues");
        var vDesc = component.get("v.description");
        var qustnlabel = helper.onlyReturnString(component, event, vDesc);
        /*if (!(categoryValue)) {
            message = "Select category!";
            helper.showToast(component, event, message);
            return false;
        } else*/
        if (!qustnlabel || qustnlabel.trim().length ===0) {
            message = "write your question";
            helper.showToast(component, event, message);
            return false;
        }

        if (qustnlabel.trim().length <= 10000 && qustnlabel.trim().length !==0) {
            helper.helperSaveEditQues(component, event);
        } else {
            message = "Character's Length should not exceed 10000";
            helper.showToast(component, event, message);
            return false;
        }
    },
    showColorModal: function(component, event, helper) {
        var acc = component.find("articleOne");
        for (var cmp in acc) {
            $A.util.toggleClass(acc[cmp], 'slds-show');
            $A.util.toggleClass(acc[cmp], 'slds-hide');
        }
    },
    getColorCode: function(component, event, helper) {
        var colorCode = event.getSource().get("v.value");
        component.set("v.colorCode", colorCode);
        var bgColorCode = event.getSource().get("v.name");
        component.set("v.bgcolor", bgColorCode);
        var isEditQue = component.get("v.isEditQue");
        if (isEditQue === true) {
            component.set("v.objeditQues.GKN_FB__Metadata__c", colorCode);
        }
        var acc = component.find("articleOne");
        for (var cmp in acc) {
            $A.util.toggleClass(acc[cmp], 'slds-show');
            $A.util.toggleClass(acc[cmp], 'slds-hide');
        }
    },
    checkTextLength: function(component, event, helper) {
        var target = event.getSource();
        var qustnlabel = target.get("v.value");
        qustnlabel = helper.onlyReturnString(component, event, qustnlabel);
        if (!qustnlabel) {

            if (qustnlabel.length > 10000) {
                var message = "Character's Length should not exceed 10000";
                helper.showToast(component, event, message);
                return false;

            }
        }
    }
})