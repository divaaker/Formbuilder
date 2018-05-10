({
	getAllFormRecord : function(component, event) {
		this.getFormList(component);
		this.getStatusVal(component);
	},
	getStatusVal : function(component){
		var action = component.get("c.getFrmStatusPcklst"); //Calling Apex class controller 'getFrmStatusPcklst' method
        action.setParams({
        });
        action.setCallback(this, function(resp) {
            var state=resp.getState();
            if(state === "SUCCESS"){
                console.log(resp.getReturnValue());
                component.set("v.statusPicklist", resp.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	},
	getFormList: function(component){
		var action = component.get("c.getQnaireForm"); //Calling Apex class controller 'getQnaireForm' method
        action.setParams({
        });
        action.setCallback(this, function(resp) {
            var state=resp.getState();
            if(state === "SUCCESS"){
                console.log(resp.getReturnValue());
                component.set("v.pMasterWrapperlist", resp.getReturnValue());
                component.set("v.masterlistSize", component.get("v.pMasterWrapperlist").length);
                component.set("v.startPosn",0);
                component.set("v.endPosn",component.get("v.pageSize")-1);
                this.paginate(component);
            }
        });
        $A.enqueueAction(action);
	},
	performNavigation : function(component,event) {
        component.set("v.pWrapperlist",  event.getParam("pWrapperlist"));
        component.set("v.endPosn", event.getParam("endPosn"));
        component.set("v.startPosn", event.getParam("startPosn"));
    },
    paginate : function(component) {
        var wlist = component.get("v.pMasterWrapperlist");
        component.set("v.pWrapperlist", wlist);
        if(wlist.length > component.get("v.pageSize")){
            var subWrapperlist = [];
            for(var i=0; i<component.get("v.pageSize"); i++){
                subWrapperlist.push(wlist[i]);
            }
            component.set("v.pWrapperlist", subWrapperlist);
        }
    },
    next : function(component) {
        var wlist = component.get("v.pMasterWrapperlist");
        var endPosn = component.get("v.endPosn");
        var startPosn = component.get("v.startPosn");
        var subWrapperlist = [];
        for(var i=0; i<component.get("v.pageSize"); i++){
            endPosn++;
            if(wlist.length >= endPosn){
                subWrapperlist.push(wlist[endPosn]);
            }
            startPosn++;
        }
        component.set("v.pWrapperlist",subWrapperlist);
        component.set("v.startPosn",startPosn);
        component.set("v.endPosn",endPosn);
    },
    previous : function(component) {
        var wlist = component.get("v.pMasterWrapperlist");
        var startPosn = component.get("v.startPosn");
        var endPosn = component.get("v.endPosn");
        var subWrapperlist = [];
        var pageSize = component.get("v.pageSize");
        startPosn -= pageSize;
        if(startPosn > -1){
            for(var i=0; i<pageSize; i++){
                if(startPosn > -1){
                    subWrapperlist.push(wlist[startPosn]);
                    startPosn++;
                    endPosn--;
                }
            }
            startPosn -= pageSize;
            component.set("v.pWrapperlist",subWrapperlist);
            component.set("v.startPosn",startPosn);
            component.set("v.endPosn",endPosn);
        }
    }
})