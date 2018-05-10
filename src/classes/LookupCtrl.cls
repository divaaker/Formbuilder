public class LookupCtrl {

    /**
     * 
     * @sobjectName - Name of SObject
     * @field_API_Text - API name of field to display to user while searching
     * @field_API_ID - API name of field to be returned by Lookup COmponent
     * @limit   - Total number of record to be returned
     * @field_API_Search - API name of field to be searched
     * @searchText - text to be searched
     * Returns JSON of list of LookupWrapper to Lookup Components
     * */
    @AuraEnabled 
    public static String searchDB(String sobjectName, String field_API_Name, String field_ID,String searchText ){
        List<LookupWrapper> lstLookup = new List<LookupWrapper>();
        searchText='\'%' + String.escapeSingleQuotes(searchText.trim()) + '%\'';
        SObjectType schemaType = ((SObject)Type.forName(sobjectName).newInstance()).getSObjectType();
        Map<String, SObjectField> fields = schemaType.getDescribe().fields.getMap();
        if (fields.get(field_API_Name).getDescribe().isAccessible()){
            String query = 'SELECT ' + field_ID+','+field_API_Name+ ' FROM ' + sobjectName +
                            ' WHERE '+field_API_Name+' LIKE '+searchText+ 
                        ' LIMIT 10';
            List<sObject> sobjList = Database.query(query);
            for(SObject s : sobjList){
                LookupWrapper obj = new LookupWrapper();
                obj.text = String.valueOf(s.get(field_API_Name)) ;
                obj.val = String.valueOf(s.get(field_ID))  ;
                lstLookup.add(obj);
            } 
        }
        return JSON.serialize(lstLookup) ;
    }
    /**
     * wrapper class for lookup
     */

    public class LookupWrapper{
        public String text{get;set;}
        public String val{get;set;}
    }

}