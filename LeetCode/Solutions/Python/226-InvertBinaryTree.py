# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution(object):
    def invertTree(self, root):
        """
        :type root: Optional[TreeNode]
        :rtype: Optional[TreeNode]
        """
        node = root

        if (node is not None):
            tempNode = node.left
        
            node.left = node.right
            node.right = tempNode

            self.invertTree(node.left)
            self.invertTree(node.right)
        
        return node
