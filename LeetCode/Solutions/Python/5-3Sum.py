def threeSum(nums = []):
    nums.sort()

    i = 0
    triplets = list()

    kLimit = len(nums) - 1

    # we fix the i, in each loop
    while(i < kLimit):
        if i > 0:
            if nums[i] == nums[i - 1]:
                i += 1
                continue
        
        j = i + 1
        k = kLimit

        sum = nums[i] + nums[j] + nums[k]

        if sum > 0:
            kLimit -= 1
            continue
        
        # then we do the two sum with two pointers
        while(j < k):
            if j > (i + 1):
                if nums[j] == nums[j - 1]:
                    j += 1
                    continue
            
            if k < kLimit:
                if nums[k] == nums[k + 1]:
                    k -= 1
                    continue

            sum = nums[i] + nums[j] + nums[k]

            if sum <= 0:
                if sum == 0:
                    triplets.append([nums[i], nums[j], nums[k]])

                j += 1
            if sum > 0:
                k -= 1
        
        i += 1

    return triplets

nums1 = [-1,0,1,2,-1,-4]
nums2 = [0, 0, 0]
nums3 = [0, 1, 1]
nums4 = [-1,0,1,2,-1,-4,-2,-3,3,0,4]

print(threeSum(nums4))
