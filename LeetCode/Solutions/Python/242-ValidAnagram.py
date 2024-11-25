class Solution(object):
    def isAnagram(self, s, t):
        """
        :type s: str
        :type t: str
        :rtype: bool
        """
        sDict = dict()

        for i in range(len(s)):
            if s[i] not in sDict.keys():
                sDict[s[i]] = 1
            else:
                sDict[s[i]] += 1

        tDict = dict()

        for i in range(len(t)):
            if t[i] not in tDict.keys():
                tDict[t[i]] = 1
            else:
                tDict[t[i]] += 1

        if len(sDict) != len(tDict): return False

        for sKey in sDict.keys():
            if sKey not in tDict.keys():
                return False
            elif sDict[sKey] != tDict[sKey]:
                return False

        return True