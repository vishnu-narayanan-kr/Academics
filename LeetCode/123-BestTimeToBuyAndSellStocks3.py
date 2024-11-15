class Solution(object):
    def maxProfit(self, prices):
        """
        :type prices: List[int]
        :rtype: int
        """
        lossOnFirstBuy = float('inf')
        maxProfitGlobal = 0
        lossOnSecondBuy = float('inf')
        maxProfitSecond = 0

        for price in prices:
            lossOnFirstBuy = min(lossOnFirstBuy, price)
            maxProfitGlobal = max(maxProfitGlobal, price - lossOnFirstBuy)
            # until here it's buy and sell stock one
            lossOnSecondBuy = min(lossOnSecondBuy, price - maxProfitGlobal)
            maxProfitSecond = max(maxProfitSecond, price - lossOnSecondBuy)

        return maxProfitSecond