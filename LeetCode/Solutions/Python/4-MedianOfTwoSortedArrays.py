nums1, nums2 = [2, 4, 5, 6, 7], [1, 3, 8, 9]
# 1, 2, 3, 4, 5, 6, 7, 8, 9

def findMedianSortedArrays(nums1, nums2):
    # Ensure nums1 is the smaller array
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    m, n = len(nums1), len(nums2)
    total = m + n
    half = total // 2
    
    left, right = 0, m
    while left <= right:
        i = (left + right) // 2  # Partition for nums1
        j = half - i             # Partition for nums2

        # Get values around the partition (use -inf/inf for edges)
        left1 = nums1[i - 1] if i > 0 else float("-inf")
        right1 = nums1[i] if i < m else float("inf")
        left2 = nums2[j - 1] if j > 0 else float("-inf")
        right2 = nums2[j] if j < n else float("inf")

        # Check if correct partition
        if left1 <= right2 and left2 <= right1:
            # Odd total length → median is min(right1, right2)
            if total % 2:
                return min(right1, right2)
            # Even total length → median is average of max(lefts) and min(rights)
            return (max(left1, left2) + min(right1, right2)) / 2
        
        elif left1 > right2:
            # Too far right in nums1, move left
            right = i - 1
        else:
            # Too far left in nums1, move right
            left = i + 1


print(findMedianSortedArrays(nums1, nums2))
