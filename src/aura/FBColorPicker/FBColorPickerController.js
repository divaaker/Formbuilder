({
	doInit  : function(component, event, helper) {
		component.set("v.rcolorCode",component.get('v.colorCode'));
	},
	openBox : function(component, event, helper) {

		var colorbox = component.find('colorbox');
		$A.util.toggleClass(colorbox,'slds-show');
		$A.util.toggleClass(colorbox,'slds-hide');
	},
	updateColor:function(component, event, helper) {
		try{
			alert(event.getSource().targetId);
		}
		catch(e){
			console.log(e);
		}
	},
	resetColor : function(component, event, helper) {
		var colorbox = component.find('colorbox');
		$A.util.removeClass(colorbox,'slds-show');
		$A.util.addClass(colorbox,'slds-hide');
		component.set("v.colorCode",component.get('v.rcolorCode'));
	},
	selectColor : function(component, event, helper) {
		var colorbox = component.find('colorbox');
		$A.util.removeClass(colorbox,'slds-show');
		$A.util.addClass(colorbox,'slds-hide');
		//fire event
		alert(1);
	}
})