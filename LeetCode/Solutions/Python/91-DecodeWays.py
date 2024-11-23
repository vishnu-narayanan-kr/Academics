class Solution(object):
    def numDecodings(self, s):
        """
        :type s: str
        :rtype: int
        """
        if s[0] == '0':
            return 0
        
        dpArr = [1, 1]

        for i in range(1, len(s)):
            ways = 0

            if s[i] != '0':
                ways = dpArr[i]
            
            num = int(s[i - 1] + s[i])
            if 10 <= num <= 26:
                ways += dpArr[i - 1]

            dpArr.append(ways)

            if ways == 0:
                return 0

        return dpArr[len(s)]
        