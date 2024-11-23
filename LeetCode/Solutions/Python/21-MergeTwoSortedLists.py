# Definition for singly-linked list.
# class ListNode(object):
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution(object):
    def mergeTwoLists(self, list1, list2):
        """
        :type list1: Optional[ListNode]
        :type list2: Optional[ListNode]
        :rtype: Optional[ListNode]
        """
        if list1 is None:
            return list2
        elif list2 is None:
            return list1

        headNode = None

        currNode1 = list1
        currNode2 = list2

        if currNode1.val > currNode2.val:
            headNode = currNode2
            currNode2 = currNode2.next
        else:
            headNode = currNode1
            currNode1 = currNode1.next
        
        currNode = headNode

        while (currNode1 is not None) and (currNode2 is not None):
            if currNode1.val > currNode2.val:
                currNode.next = currNode2
                currNode = currNode2
                currNode2 = currNode2.next
            else:
                currNode.next = currNode1
                currNode = currNode1
                currNode1 = currNode1.next

        if currNode1 is None:
            currNode.next = currNode2
        elif currNode2 is None:
            currNode.next = currNode1

        return headNode