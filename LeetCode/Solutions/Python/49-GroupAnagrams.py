"""
print(ord('a') - 97)

print(type("".join(str(x) for x in [1, 3, 4])))

key = [0] * 100
"""

def findKey(s):
    key = [0] * 26
    
    for c in s:
        i = ord(c) - 97
        key[i] += 1
    
    return ",".join(str(x) for x in key)

def groupAnagrams(strs):
    anaDict = dict()

    for word in strs:
        key = findKey(word)

        if key not in anaDict:
            anaDict[key] = [word]
        else:
            anaDict[key].append(word)

    groupedAnagrams = list()

    for anagrams in anaDict.values():
        groupedAnagrams.append(anagrams)

    return groupedAnagrams

strs1 = ["eat","tea","tan","ate","nat","bat"]
strs2 = [""]
strs3 = ["a"]

print(groupAnagrams(strs2))

