({
	getTemplatesHelper  : function(component){
		component.set("v.isShowSpinner",true);
		var options=[];
		var action = component.get("c.getTemplates");
		action.setCallback(this,function(a){
			component.set("v.isShowSpinner",false);
            var datas = JSON.parse(a.getReturnValue());
        	for(var i=0;i<datas.length;i++)
        	{
        		options.push({label:datas[i].Name,value:datas[i].Id})
        	}
        	component.set("v.templateList",options);
        })
        $A.enqueueAction(action);
	},
	getSectionsHelper  : function(component){
		component.set("v.isShowSpinner",true);
		var options=[];
		var action = component.get("c.getSections");
		action.setParams({qid:component.get("v.selectedTemplate")});
		action.setCallback(this,function(a){
			component.set("v.isShowSpinner",false);
            var datas = JSON.parse(a.getReturnValue());
        	for(var i=0;i<datas.length;i++)
        	{
        		options.push({label:datas[i].sectionName,value:datas[i].GKN_FB__Question_Group__c})
        	}
        	component.set("v.sectionList",options);
        })
        $A.enqueueAction(action);
	}
})