from collections import deque

s = ""

def findLength(s):
    queue = deque([])
    charSet = set()

    maxSize = 0

    for c in s:
        queue.append(c)

        if(c not in charSet):
            maxSize = max(len(queue), maxSize)
            charSet.add(c)
        else:
            flush = True

            while(flush):
                removedChar = queue.popleft()
                
                if(removedChar != c):
                    charSet.remove(removedChar)
                else:
                    flush = False
    
    return maxSize

print(findLength(s))