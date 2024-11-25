class Solution(object):
    def maxSubArray(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        
        largestSubSum = float('-inf')
        subSum = float('-inf')

        for num in nums:
            subSum = max(num, subSum + num)
            largestSubSum = max(largestSubSum, subSum)

        return largestSubSum