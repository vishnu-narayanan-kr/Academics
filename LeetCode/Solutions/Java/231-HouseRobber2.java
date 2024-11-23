class Solution {
    public int rob(int[] nums) {
        if(nums.length == 1) {
            return nums[0];
        }
        if(nums.length == 2) {
            return Math.max(nums[0], nums[1]);
        }

        return Math.max(rob1(nums, 0), rob1(nums, 1));
    }

    public int rob1(int[] nums, int start) {
        int length = nums.length - 1;

        int m1 = nums[start];
        int m2 = length > 1 ? nums[start + 1] : 0;
        int m3 = length > 2 ? nums[start + 2] + nums[start] : nums[start];

        int m4 = 0;

        for(int i = start + 3; i < length + start; i++) {
            m4 = Math.max(m1, m2) + nums[i];
            
            m1 = m2;
            m2 = m3;
            m3 = m4;
        }

        return Math.max(m2, m3);
    }
}