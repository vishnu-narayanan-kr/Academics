"""
# Definition for a Node.
class Node(object):
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
"""

class Solution(object):
    visitedMap = dict()

    def cloneGraph(self, node):
        """
        :type node: Node
        :rtype: Node
        """
        if node is None:
            return None
        if len(node.neighbors) == 0:
            return Node(node.val, node.neighbors)

        self.createVisitMap(node)
        
        self.createClone(node)

        return self.visitedMap[node]

    def createVisitMap(self, node):
        if (node is None) or (node in self.visitedMap):
            return
        
        newNode = Node(node.val, [])
        self.visitedMap[node] = newNode

        for neighbor in node.neighbors:
            self.createVisitMap(neighbor)
    
    def createClone(self, node):
        for neighbor in node.neighbors:
            if self.visitedMap[neighbor] not in self.visitedMap[node].neighbors:
                self.visitedMap[node].neighbors.append(self.visitedMap[neighbor])

            if (self.visitedMap[node] not in self.visitedMap[neighbor].neighbors):
                self.createClone(neighbor)
