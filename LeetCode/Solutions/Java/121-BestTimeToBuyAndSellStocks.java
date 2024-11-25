class Solution {
    public int maxProfit(int[] prices) {
        int buyDay = 0;
        int sellDay = buyDay + 1;
        int profit = 0;
        int maxProfit = 0;


        while(sellDay < prices.length) {
            profit = prices[sellDay] - prices[buyDay];

            if(profit > maxProfit) {
                maxProfit = profit;
            } else if (profit < 0) {
                buyDay = sellDay;
            }

            sellDay++;
        }

        return maxProfit;
    }
}