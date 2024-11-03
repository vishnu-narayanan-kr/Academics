class Solution {
    public int combinationSum4(int[] nums, int target) {
        int[] targetArr = new int[target + 1];

        targetArr[0] = 1;

        for(int i = 1; i < target + 1; i++) {
            for(int num : nums) {
                if(num <= i) {
                    targetArr[i] += targetArr[i - num];
                }
            }
        }

        return targetArr[target];
    }
}