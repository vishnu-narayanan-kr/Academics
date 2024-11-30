def isPalindrome(s):
    sArr = list()

    for c in s:
        if c.isalnum():
            if c.isalpha():
                sArr.append(c.lower())
            else:
                sArr.append(c)

    left = 0
    right = len(sArr) - 1

    if right < 0: return True

    while(left < right):
        if sArr[left] == sArr[right]:
            left += 1
            right -= 1
        else:
            return False
        
    return True

s1 = "A man, a 9plan, a canal: P9anama"
s2 = "race a car 9"
s3 = " "

print(isPalindrome(s1))