class Solution(object):
    def lengthOfLIS(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        dpa = []

        for index in range(len(nums)):
            dpa.append(1)

            subIndex = index - 1
            while(subIndex >= 0):
                if(nums[subIndex] < nums[index]):
                    dpa[index] = max(dpa[subIndex] + 1, dpa[index])
                subIndex -= 1

        return max(dpa)