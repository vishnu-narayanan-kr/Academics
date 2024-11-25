# be careful of equality checks
class Solution(object):
    def binarySearchSorted(self, nums, target, l, r):
        m = int((l + r) / 2)

        if(l >= r):
            return -1
        elif(nums[m] == target):
            return m
        elif(nums[l] < nums[m]):
            if(nums[l] <= target < nums[m]):
                return self.binarySearchSorted(nums, target, l, m)
            else:
                return self.binarySearchSorted(nums, target, m + 1, r)
        else:
            if(nums[m] < target <= nums[r - 1]):
                return self.binarySearchSorted(nums, target, m + 1, r)
            else:
                return self.binarySearchSorted(nums, target, l, m)

    def search(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: int
        """
        return self.binarySearchSorted(nums, target, 0, len(nums))