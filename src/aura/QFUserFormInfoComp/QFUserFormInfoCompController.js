({
	doInit : function(component, event, helper) {
		helper.getAllFormRecord(component, event);
	},
    next:function(component,event,helper){
        helper.next(component);
    },
    previous:function(component,event,helper){
        helper.previous(component);
    },
    sortByName: function(component, event, helper) {
        helper.sortBy(component,helper, "Name"); 
        var a=component.get("v.sortAsc");
        component.set("v.Name",a);
    },
    sortByPhone: function(component, event, helper) {
        helper.sortBy(component,helper, "Phone");
        var a=component.get("v.sortAsc");
        component.set("v.phone",a);
    },
    sortByEmail: function(component, event, helper) {
        helper.sortBy(component,helper, "Email");
         var a=component.get("v.sortAsc");
        component.set("v.email",a);
    }
})