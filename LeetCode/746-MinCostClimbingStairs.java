class Solution {
    public int minCostClimbingStairs(int[] cost) {
        int cost1 = cost[0];
        int cost2 = cost[1];
        int temp = 0;

        for(int i = 2; i < cost.length; i++) {
            temp = Math.min(cost1, cost2) + cost[i];
            cost1 = cost2;
            cost2 = temp;
        }

        return Math.min(cost1, cost2);
    }
}