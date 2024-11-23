class Solution {
    public int rob(int[] nums) {
        int length = nums.length;

        int m1 = nums[0];
        int m2 = length > 1 ? nums[1] : 0;
        int m3 = length > 2 ? nums[2] + nums[0] : nums[0];

        int m4 = 0;

        for(int i = 3; i < length; i++) {
            m4 = Math.max(m1, m2) + nums[i];
            
            m1 = m2;
            m2 = m3;
            m3 = m4;
        }

        return Math.max(m2, m3);
    }
}