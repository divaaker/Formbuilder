@IsTest
private class FBUtilTest {

    private static testMethod void testInsertRecords()
    {
        List<FBUtils.KeyValuePair> listObj = new List<FBUtils.KeyValuePair>();
        listObj.add(new FBUtils.KeyValuePair('Answer__c','Girikon'));
        listObj.add(new FBUtils.KeyValuePair('IsComment__c','9717414575'));
        listObj.add(new FBUtils.KeyValuePair('Question__c',5));
        
        Map<Integer,List<FBUtils.KeyValuePair>> recordsToInsert = new Map<Integer,List<FBUtils.KeyValuePair>>();
        recordsToInsert.put(0,listObj);
        
        //Test insertRecords() method
        FBUtils.FBResponse response = FBUtils.insertRecords('Account', recordsToInsert);
        System.assertEquals(response.isSuccess, true);
        
        //Test getRecords() method
        List<sObject> dbRecords = FBUtils.getRecords('Account', 'Id,Name,Fax,NumberofLocations__c', 'Select Id,Name,Fax from Account Where Name=\'Girikon\'');
        if(dbRecords.size()>0){
            System.assertEquals('Girikon', dbRecords[0].get('Name'));
        }
        System.assertEquals(1, dbRecords.size());
        
        //Test updateRecords() method
        recordsToInsert.get(0).add(new FBUtils.KeyValuePair('Id',dbRecords[0].get('Id')));
        recordsToInsert.get(0).add(new FBUtils.KeyValuePair('Name','Girikon LLC'));
        FBUtils.FBResponse response2 = FBUtils.updateRecords('Account', recordsToInsert);
        System.debug(response2);
        System.assertEquals(response2.isSuccess, true);
    }
}