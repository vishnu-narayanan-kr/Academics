# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution(object):
    def levelOrder(self, root):
        """
        :type root: Optional[TreeNode]
        :rtype: List[List[int]]
        """
        self.levelValues = list()
        
        if (root is None):
            return self.levelValues

        self.findLevelValues(root, 0)

        return self.levelValues

    def findLevelValues(self, node, index):
        if (node is None):
            return

        if (len(self.levelValues) == index):
            self.levelValues.append([])

        self.levelValues[index].append(node.val)

        self.findLevelValues(node.left, index + 1)
        self.findLevelValues(node.right, index + 1)