global class DynamicPicklist extends VisualEditor.DynamicPickList{
    
    global override VisualEditor.DataRow getDefaultValue(){
        List<Questionnaire__c> tempList = getTemplates();
        VisualEditor.DataRow defaultValue;
        if(!tempList.isEmpty()){
        	defaultValue = new VisualEditor.DataRow(tempList[0].Name, tempList[0].Id);    
        }else{
            defaultValue = new VisualEditor.DataRow('None', '');
        }
        return defaultValue;
    }
    global override VisualEditor.DynamicPickListRows getValues() {
        List<Questionnaire__c> tempList = getTemplates();
        VisualEditor.DynamicPickListRows  myValues = new VisualEditor.DynamicPickListRows();        
        myValues.addRow(new VisualEditor.DataRow('None', ''));        
        for(Questionnaire__c questObj : tempList){
            myValues.addRow(new VisualEditor.DataRow(questObj.Name,questObj.Id));
        }
        return myValues;
    }
    
    global List<Questionnaire__c> getTemplates()
    {
        return [Select Id,Name From Questionnaire__c where is_Published__c=:true order by createddate desc limit 2000];
    }
    
}