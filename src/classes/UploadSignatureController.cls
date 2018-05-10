public with sharing class UploadSignatureController {
	
    @AuraEnabled
    public static String saveSignatureResponse(String questionId,String questionerId,String base64Data)
    {
        FBUtils.FBResponse response = new FBUtils.FBResponse();
        
        //set user response data
        List<FBUtils.KeyValuePair> listObj = new List<FBUtils.KeyValuePair>();
        listObj.add(new FBUtils.KeyValuePair('Questionnaire__c',questionerId));
        listObj.add(new FBUtils.KeyValuePair('Question__c',questionId));
        listObj.add(new FBUtils.KeyValuePair('User__c',UserInfo.getUserId()));
        Map<Integer,List<FBUtils.KeyValuePair>> recordsToInsert = new Map<Integer,List<FBUtils.KeyValuePair>>();
        
        String query = 'Select Id,Answer__c,Comment__c,Question__c,Score__c,Questionnaire__c from Question_Response__c WHERE Questionnaire__c=\''+String.escapeSingleQuotes(questionerId)+'\' AND Question__c=\''+String.escapeSingleQuotes(questionId)+'\' AND User__c=\''+UserInfo.getUserId()+'\'';
        List<sObject> objList = FBUtils.getRecords('Question_Response__c', 'Id', query);

        if(!objList.isEmpty()){
            //If exist answer by user for same question then upload signature only
            String Id = saveTheFile(String.valueOf(objList[0].get('Id')), base64Data);
            if(Id!=''){

                listObj.add(new FBUtils.KeyValuePair('Id',objList[0].get('Id')));
                listObj.add(new FBUtils.KeyValuePair('Answer__c', Url.getSalesforceBaseUrl().toExternalForm()+'/servlet/servlet.FileDownload?file='+Id));
                
                recordsToInsert.put(0,listObj);
                
                FBUtils.updateRecords('Question_Response__c', recordsToInsert);

                response.isSuccess = true;
                response.message = 'Signature uploaded successfully';    
            }else{
                response.isSuccess = false;
                response.message = 'Failed!';
            }
        }
        else
        {
            // create new response for a question
            
            recordsToInsert.put(0,listObj);
            response = FBUtils.insertRecords('Question_Response__c', recordsToInsert);
            
            
            String Id =  saveTheFile(response.firstRecordId,base64Data);
            recordsToInsert.clear();
            listObj.add(new FBUtils.KeyValuePair('Id',response.firstRecordId));
            listObj.add(new FBUtils.KeyValuePair('Answer__c', Url.getSalesforceBaseUrl().toExternalForm()+'/servlet/servlet.FileDownload?file='+Id));
            recordsToInsert.put(0,listObj);
            FBUtils.updateRecords('Question_Response__c', recordsToInsert);

            return JSON.serialize(response);
            
        }
        return JSON.serialize(response);
    }
    
    public static String saveTheFile(Id parentId, String base64Data) { 
        System.debug(base64Data);
        String fileName = UserInfo.getName()+' Signature.png';
        Delete([Select id from Attachment WHERE Name =: fileName AND ParentId=:parentId AND CreatedById=:UserInfo.getUserId()]);

        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        
        Attachment a = new Attachment();
        a.parentId = parentId;
        
        a.Body = EncodingUtil.base64Decode(base64Data);
        a.Name = fileName;
        a.ContentType = 'image/png';
        
        insert a;        
        return a.Id;
    }

}