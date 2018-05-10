({
	doInit:function(component, event, helper) {
		console.log('setpup screen loaded');
		helper.getTemplatesHelper(component);
		component.set("v.sectionList",[{label:"None",value:""}]);
	},

	templateChange : function(component, event, helper) {
		helper.getSectionsHelper(component);
	},

	sectionChange : function(component, event, helper) {
	
	},

	colorSetupButton : function(component, event, helper) {
		component.set("v.isOpenSectionColorModal",true);
	},
	
	hideModal : function(component,event,helper){
		component.set("v.isOpenSectionColorModal",false);
	},

	mapAnswerToObjectFields : function(component, event, helper) {
	
	},

})