# should find index of closest greatest number of the number, to replace that number
# for better solution for leetcode 300

nums = [1, 5, 7, 9, 15]

def findIndex(nums, target):
    left = 0
    right = len(nums)

    if(nums[right - 1] < target): return right
    if(nums[left] > target): return left

    while left < right: 
        middle = int((left + right) / 2)

        if(target <= nums[middle]):
            right = middle
        else:
            left = middle + 1

    return left

print(findIndex(nums, 20))
