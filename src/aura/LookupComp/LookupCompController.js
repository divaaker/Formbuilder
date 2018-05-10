({
    Selectedrecord: function(component, event, helper) {
        helper.helperSelectedrecord(component, event, helper);
    },
    recordCall: function(component, event, helper) {
    	helper.helperRecordCall(component, event, helper);
    },
    clearSelected: function(component, event, helper) {
        helper.helperclearSelected(component, event, helper);
    },
    handleSubmitButton:function(component, event, helper){
    	var ev = $A.get("e.c:getValidationInfoEvt");
        if($A.util.isEmpty(component.get("v.selrecord")))
    	{
    		var inputCmp = component.find('inputFields');
            inputCmp.showHelpMessageIfInvalid();
            ev.setParams({"isValid":false,"questionId":component.get("v.questionId")});
            console.log('in if')
    	}
        else
        {
            ev.setParams({"isValid":true,"questionId":component.get("v.questionId")});
            console.log('in else')
        }
        ev.fire();
    }
})