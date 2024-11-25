# find direction to move based on tDict counts
def findPointerToMove(tDict):
    for count in tDict.values():
        if count > 0:
            return "right"

    return "left"

def minWindow(s, t):
    # to keep track of letters in t
    tDict = dict()

    for i in range(len(t)):
        if t[i] not in tDict.keys():
            tDict[t[i]] = 1
        else:
            tDict[t[i]] += 1
    
    # to keep track of length, and substrings
    subDict = dict()

    left = 0
    right = 0

    if s[right] in tDict.keys():
        tDict[s[right]] -= 1

    while right < len(s):
        pointer = findPointerToMove(tDict)

        if pointer == "right":
            right += 1

            if right < len(s):
                if s[right] in tDict.keys():
                    tDict[s[right]] -= 1
        else:
            length = right - left + 1

            if s[left] in tDict.keys():
                tDict[s[left]] += 1

                if findPointerToMove(tDict) == "right":
                    subDict[length] = (left, right + 1)
            
            left += 1
    
    minLength = float("+inf")
    for length in subDict.keys():
        minLength = min(minLength, length)
    
    
    if len(subDict) > 0:
        (x, y) = subDict[minLength]
        return s[x: y]
    else:
        return ""
    
    
s1, k1 = "ADOBECODEBANC", "ABC"
s2, k2 = "a", "a"

print(minWindow(s2, k2))


        
