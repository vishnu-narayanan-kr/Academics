def countSubstrings(s):
    if len(s) == 1:
        return 1

    count = 0

    for i in range(len(s)):
        left = right = i

        while(s[left] == s[right]):
            count += 1

            if (0 < left) and (right < len(s) - 1):
                left -= 1
                right += 1
            else:
                break
    
    for i in range(len(s) - 1):
        left = i
        right = i + 1

        while(s[left] == s[right]):
            count += 1
            
            if (0 < left) and (right < len(s) - 1):
                left -= 1
                right += 1
            else:
                break

    return count

s1 = "abc"
s2 = "aaa"

print(countSubstrings(s1))

