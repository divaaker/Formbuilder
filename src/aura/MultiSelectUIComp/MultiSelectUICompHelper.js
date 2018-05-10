({
    setInfoText: function(component, labels) {
        if (labels.length === 0) {
            component.set("v.infoText", "Select an option...");
        }
        if (labels.length === 1) {
            component.set("v.infoText", labels[0]);
        }
        else if (labels.length > 1) {
            component.set("v.infoText", labels.length + " options selected");
        }
    },
    
    getSelectedValues: function(component){
        var options = component.get("v.options_");
        var values = [];
        if(options!==undefined){
            options.forEach(function(element) {
                if (element.selected) {
                    values.push(element.GKN_FB__Name__c);
                }
            });
        }
        return values;
    },
    
    getSelectedLabels: function(component){
        var options = component.get("v.options_");
        var labels = [];
        if(options!==undefined){
            options.forEach(function(element) {
                if (element.selected) {
                    labels.push(element.GKN_FB__Name__c);
                }
            });  
        }
        
        return labels;
    },
    
    despatchSelectChangeEvent: function(component,values){
        var compEvent = component.getEvent("selectChange");
        compEvent.setParams({ "values": values });
        compEvent.fire();
    }
})