# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution(object):
    maxSum = float('-inf')

    def maxPathSum(self, root):
        """
        :type root: Optional[TreeNode]
        :rtype: int
        """
        self.maxSubSum(root)
        return self.maxSum

    def maxSubSum(self, node):
        if (node is None):
            return 0

        leftSum = self.maxSubSum(node.left)
        rightSum = self.maxSubSum(node.right)

        bestSumWithCurrentNodeAsAnEndNode = node.val + max(leftSum, rightSum, 0)
        bestSumWithCurrentNodeSomewhereInTheMiddle = bestSumWithCurrentNodeAsAnEndNode + min(leftSum, rightSum)

        self.maxSum = max(self.maxSum, bestSumWithCurrentNodeAsAnEndNode, bestSumWithCurrentNodeSomewhereInTheMiddle)

        node.val = bestSumWithCurrentNodeAsAnEndNode

        return bestSumWithCurrentNodeAsAnEndNode