class Solution {
    public boolean canJump(int[] nums) {
        int capacity = Integer.MIN_VALUE + 1;

        for(int i = 0; i < nums.length - 1; i++) {
            --capacity;

            if(nums[i] >= capacity) {
                capacity = nums[i];
            }

            if(capacity == 0) {
                return false;
            }
        }

        return true;
    }
}