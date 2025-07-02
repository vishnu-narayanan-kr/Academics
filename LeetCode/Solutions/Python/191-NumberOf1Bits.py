def findSetBits(num):
    x = 0

    while(num > 0):
        r = num % 2

        if (r == 1):
            x += 1
        
        num = int(num / 2)
    
    return x

testNum = 100
ans = findSetBits(testNum)
print(ans, bin(testNum))