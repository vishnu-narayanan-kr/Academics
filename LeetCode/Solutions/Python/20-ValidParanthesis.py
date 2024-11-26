from collections import deque

def isValid(s):
    if len(s) == 1: return False

    charStack = deque()

    closeDict = {
    ')': '(',
    '}': '{',
    ']': '['
    }

    for c in s:
        if (c == '(') or (c == '{') or (c == '['):
            charStack.append(c)
        elif len(charStack) == 0:
            return False
        elif charStack.pop() != closeDict[c]:
            return False
        
    if len(charStack) > 0: return False

    return True
            


