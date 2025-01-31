# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Codec:

    def serialize(self, root):
        """Encodes a tree to a single string.
        
        :type root: TreeNode
        :rtype: str
        """
        return self.seHelper(root)
    
    def seHelper(self, node):
        if (node is None):
            return 'N '
        else:
            return str(node.val) + ' ' + self.seHelper(node.left) + self.seHelper(node.right)

    dataList = list()

    def deserialize(self, data):
        """Decodes your encoded data to tree.
        
        :type data: str
        :rtype: TreeNode
        """
        self.dataList = data.rstrip().split(' ')

        return self.deHelper()

    index = 0

    def deHelper(self, node=None):
        if (self.index == 0) and (self.dataList[self.index] == 'N'):
            return node
        elif (self.index == 0):
            node = TreeNode(self.dataList[self.index])

        lNode = rNode = None

        if (self.index + 1 < len(self.dataList)):
            self.index += 1
        if (self.dataList[self.index] != 'N'):
            lNode = TreeNode(self.dataList[self.index])
            self.deHelper(lNode)

        node.left = lNode

        if (self.index + 1 < len(self.dataList)):
            self.index += 1
        if (self.dataList[self.index] != 'N'):
            rNode = TreeNode(self.dataList[self.index])
            self.deHelper(rNode)

        node.right = rNode

        return node


# Your Codec object will be instantiated and called as such:
# ser = Codec()
# deser = Codec()
# ans = deser.deserialize(ser.serialize(root))