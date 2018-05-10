({
    init: function(component, event, helper) {

        //note, we get options and set options_
        //options_ is the private version and we use this from now on.
        //this is to allow us to sort the options array before rendering
        /*var opts = [
              {
                  'label': 'All',
                  'value': 'All'
              },
            {
                'label': 'Watching Rates',
                'value': 'Watching Rates'
            },
            {
                'label': 'Initial Contact',
                'value': 'Initial Contact'
            },
            {
                'label': 'Application',
                'value': 'Application'
            },
            {
                'label': 'Waiting for Qualifying Documentation',
                'value': 'Waiting for Qualifying Documentation'
            },
            {
                'label': 'Qualifying Documentation Review',
                'value': 'Qualifying Documentation Review'
            }
           ];
           component.set("v.options", opts);*/
        /*var options = component.get("v.options");
        options.sort(function compare(a,b) {
            console.log("a.value==="+a.value);
            if (a.value == 'All'){
                return -1;
            }
            else if (a.value < b.value){
                return -1;
            }
            if (a.value > b.value){
                return 1;
            }
            return 0;
        });

        component.set("v.options_",options);*/
        var values = helper.getSelectedValues(component);
        helper.setInfoText(component, values);
    },

    handleClick: function(component, event, helper) {
        var mainDiv = component.find('main-div');
        $A.util.addClass(mainDiv, 'slds-is-open');
    },

    handleSelection: function(component, event, helper) {
        var item = event.currentTarget;
        if (item && item.dataset) {
            var value = item.dataset.value;
            var selected = item.dataset.selected;
            var options = component.get("v.options_");


            //shift key ADDS to the list (unless clicking on a previously selected item)
            //also, shift key does not close the dropdown (uses mouse out to do that)
            if (event.ctrlKey) {
                options.forEach(function(element) {

                    if (element.Name__c === value) {
                        element.selected = selected === "true" ? false : true;
                    }
                });
            } else {
                options.forEach(function(element) {
                    if (element.Name__c === value) {
                        element.selected = selected === "true" ? false : true;
                    } else {
                        element.selected = false;
                    }
                });
                var mainDiv = component.find('main-div');
                $A.util.removeClass(mainDiv, 'slds-is-open');
            }
            component.set("v.options_", options);

            var values = helper.getSelectedValues(component);
            var labels = helper.getSelectedLabels(component);

            helper.setInfoText(component, labels);
            helper.despatchSelectChangeEvent(component, values);

        }
    },

    handleMouseLeave: function(component, event, helper) {
        component.set("v.dropdownOver", false);
        var mainDiv = component.find('main-div');
        $A.util.removeClass(mainDiv, 'slds-is-open');
    },

    handleMouseEnter: function(component, event, helper) {
        component.set("v.dropdownOver", true);
    },

    handleMouseOutButton: function(component, event, helper) {
        window.setTimeout(
            $A.getCallback(function() {
                if (component.isValid()) {
                    //if dropdown over, user has hovered over the dropdown, so don't close.
                    if (component.get("v.dropdownOver")) {
                        return;
                    }
                    var mainDiv = component.find('main-div');
                    $A.util.removeClass(mainDiv, 'slds-is-open');
                }
            }), 200
        );
    }
})