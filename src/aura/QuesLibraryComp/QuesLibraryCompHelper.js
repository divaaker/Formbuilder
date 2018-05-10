({
    minMaxWindowHelper: function(component, event, secId) {
        var acc = component.find(secId);
        for (var cmp in acc) {
            $A.util.toggleClass(acc[cmp], 'slds-show');
            $A.util.toggleClass(acc[cmp], 'slds-hide');
        }
        if ($('.qf-library-box').hasClass('slds-show')) {
            if (!$(".qf-left-panel").hasClass("slds-is-fixed")) {
                $(".questionBuilder-left-box").height($(window).height() - $(".cQFQuesLibraryComp").height() - 170);

            } else {
                $(".questionBuilder-left-box").height($(window).height() - $(".cQFQuesLibraryComp").height() - 70);
            }

        } else {
            if (!$(".qf-left-panel").hasClass("slds-is-fixed")) {
                $(".questionBuilder-left-box").height($(window).height() - $(".cQFQuesLibraryComp").height() - 520);

            } else {

                $(".questionBuilder-left-box").height($(window).height() - $(".cQFQuesLibraryComp").height() - 420);
            }
        }
    },
    helperDefaultQuestionLibrary: function(component, event, secId) {
        var action = component.get("c.getDefualtLibraryQuestn"); //Calling Apex class controller 'getDefualtLibraryQuestn' method
        //action.setParams({ sCountryName : name });
        action.setCallback(this, function(res) {
            var state = res.getState();
            if (state === "SUCCESS") {
                component.set("v.ListQuestion", res.getReturnValue());
            } else {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title: 'Error :',
                    message: res.getError()[0].message,
                    duration: ' 5000',
                    key: 'error',
                    type: 'error',
                    mode: 'dismissible'
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    }
})