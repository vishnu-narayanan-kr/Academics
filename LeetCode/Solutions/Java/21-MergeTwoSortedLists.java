/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        if(list1 == null) {
            return list2;
        } else if(list2 == null) {
            return list1;
        }

        ListNode headNode = null;
        ListNode currNode = headNode;

        ListNode list1Curr = list1;
        ListNode list2Curr = list2;

        // Assign the headnode, and currentnode
        if(list1Curr.val > list2Curr.val) {
            headNode = list2Curr;
            currNode = list2Curr;
            list2Curr = list2Curr.next;
        } else {
            headNode = list1Curr;
            currNode = list1Curr;
            list1Curr = list1Curr.next;
        }

        // Add nodes as long as either one is not empty
        while(list1Curr != null && list2Curr != null) {
            if(list1Curr.val > list2Curr.val) {
                currNode.next = list2Curr;
                currNode = list2Curr;
                list2Curr = list2Curr.next;
            } else {
                currNode.next = list1Curr;
                currNode = list1Curr;
                list1Curr = list1Curr.next;
            }
        }

        // When one of them ends first, link the other
        if(list1Curr == null) {
            currNode.next = list2Curr;
        } else if(list2Curr == null) {
            currNode.next = list1Curr;
        }

        return headNode;
    }
}