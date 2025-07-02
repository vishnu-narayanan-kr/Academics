class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        sumActual = len(nums)
        sumNums = 0

        for i in range(0, len(nums)):
            sumActual += i
            sumNums += nums[i]

        return sumActual - sumNums