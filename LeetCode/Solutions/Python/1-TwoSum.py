class Solution(object):
    def twoSum(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        numDict = dict({})

        for i in range(len(nums)):
            y = target - nums[i]
            if y in numDict.keys():
                return [numDict[y], i]
            else:
                numDict[nums[i]] = i