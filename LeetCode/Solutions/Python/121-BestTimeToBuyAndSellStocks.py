class Solution(object):
    def maxProfit(self, prices):
        """
        :type prices: List[int]
        :rtype: int
        """
        buy = float('inf')
        maxProfit = 0

        for price in prices:
            buy = min(buy, price)
            maxProfit = max(maxProfit, price - buy)

        return maxProfit