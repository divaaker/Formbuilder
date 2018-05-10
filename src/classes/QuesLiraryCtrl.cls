public class QuesLiraryCtrl {
    /**
     * fetch defualt question record
     * @return Question record
     */
    @AuraEnabled
    public static List<Question__c> getDefualtLibraryQuestn() {
        return new List<Question__c>([SELECT id, Label__c From Question__c ORDER BY ID desc LIMIT 5]);
    }
}