// N2 solution
class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] dpA = new int[nums.length];

        int index = 0;

        while(index < nums.length) {
            int subIndex = index - 1;

            dpA[index] = 1;

            while(subIndex >= 0) {
                if(nums[index] > nums[subIndex]) {
                    dpA[index] = Math.max(dpA[subIndex] + 1, dpA[index]);
                }

                subIndex--;
            }

            index++;
        }

        return Arrays.stream(dpA).max().getAsInt();
    }
}