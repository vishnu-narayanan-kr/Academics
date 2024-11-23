class Solution(object):
    def productExceptSelf(self, nums):
        """
        :type nums: List[int]
        :rtype: List[int]
        """
        pre = []
        suf = []
        prod = []

        for i in range(len(nums)):
            pre.append(1)
            suf.append(1)

        for i in range(len(nums)):
            if i > 0:
                pre[i] = pre[i - 1] * nums[i - 1]
        
        for i in range(-1, -1 -len(nums), -1):
            if i < -1:
                suf[i] = suf[i + 1] * nums[i + 1]

        for i in range(len(nums)):
            prod.append(pre[i] * suf[i])

        return prod