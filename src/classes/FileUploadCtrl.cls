public with sharing class FileUploadCtrl 
{
	@AuraEnabled
    public static Id saveChunk(String questionId, String questionerId, String fileName, String base64Data, String contentType, String fileId,String fileDescription) {
        // check if fileId id ''(Always blank in first chunk), then call the saveTheFile method,
        //  which is save the check data and return the attachemnt Id after insert, 
        //  next time (in else) we are call the appentTOFile() method
        //   for update the attachment with reamins chunks   
        if (fileId == '') {
        	String parentId = getReponseId(questionId,questionerId);
            fileId = saveTheFile(parentId, fileName, base64Data, contentType,fileDescription);
        } else {
            appendToFile(fileId, base64Data);
        }
 
        return Id.valueOf(fileId);
    }
    public static Id saveTheFile(Id parentId, String fileName, String base64Data, String contentType,String fileDescription) {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
 
        Attachment attObj = new Attachment();
        attObj.ParentId = parentId;
 		attObj.Description = fileDescription;
        attObj.Body = EncodingUtil.base64Decode(base64Data);
        attObj.Name = fileName;
        attObj.ContentType = contentType;
 
        insert attObj;
 
        return attObj.Id;
    }
 
    private static void appendToFile(Id fileId, String base64Data) {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
 
        Attachment a = [SELECT Id, Body FROM Attachment WHERE Id =:fileId];
 
        String existingBody = EncodingUtil.base64Encode(a.Body);
 
        a.Body = EncodingUtil.base64Decode(existingBody + base64Data);
 
        update a;
    }

    private static String getReponseId(String questionId,String questionerId)
    {
    	String objectName='Question_Response__c',flsFields='',query='';

    	query = 'Select Id from Question_Response__c WHERE Question__c=\''+String.escapeSingleQuotes(questionId)+'\' AND User__c=\''+UserInfo.getUserId()+'\'';
        List<sObject> objList = FBUtils.getRecords('Question_Response__c', 'Id,User__c,Question__c', query);
        
        // if response exist then return id otherwise create a new response using loggedin user
        
        if(objList.size()>0)
        {
        	return String.valueOf(objList[0].get('Id'));	
        }
        else
        {
        	List<FBUtils.KeyValuePair> listObj = new List<FBUtils.KeyValuePair>();
	        listObj.add(new FBUtils.KeyValuePair('Questionnaire__c',questionerId));
	        listObj.add(new FBUtils.KeyValuePair('Question__c',questionId));
	        listObj.add(new FBUtils.KeyValuePair('User__c',UserInfo.getUserId()));
	        listObj.add(new FBUtils.KeyValuePair('Answer__c', ''));
	        Map<Integer,List<FBUtils.KeyValuePair>> recordsToInsert = new Map<Integer,List<FBUtils.KeyValuePair>>();
	        recordsToInsert.put(0,listObj);
	        
	        FBUtils.FBResponse response = FBUtils.insertRecords('Question_Response__c',recordsToInsert);
	        return response.firstRecordId;
        }
    }
}