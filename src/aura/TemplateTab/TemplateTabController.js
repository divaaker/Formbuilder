({
    doInit: function(component, event, helper) {
        var tempId = helper.getParameterByName(component, event, 'tempId');
        var previewId = helper.getParameterByName(component, event, 'previewTemp');        
        if (tempId !== undefined && tempId !== "" && tempId !== null) {
            component.set("v.QnaireId", tempId);
            component.set("v.activeTab", "createTemplate");
        }
        if (previewId !== undefined && previewId !== "" && previewId !== null) {
            component.set("v.QnaireId", previewId);
            component.set("v.activeTab", "previewTemplate");
        }
        var recordId = component.get("v.recordId");        
        if(recordId !== undefined && recordId !=="" && recordId !== null){
            component.set("v.QnaireId", recordId);
            component.set("v.activeTab", "createTemplate")
        }
    },
    handleApplicationEvent: function(component, event, helper) {

        var vCompName = event.getParam("compName");
        var vQnaireId = event.getParam("QuesnaireId");
        component.set("v.QnaireId", vQnaireId);
        component.set("v.activeTab", vCompName);
    }

})