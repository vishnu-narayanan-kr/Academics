def longestPalindrome(s):
    if len(s) == 1:
        return s

    longest = ""

    for i in range(len(s)):
        left = right = i

        while(s[left] == s[right]):
            length = right - left + 1

            if length > len(longest):
                longest = s[left: right + 1]

            if (0 < left) and (right < len(s) - 1):
                left -= 1
                right += 1
            else:
                break
    
    for i in range(len(s) - 1):
        left = i
        right = i + 1

        while(s[left] == s[right]):
            length = right - left + 1

            if length > len(longest):
                longest = s[left: right + 1]
            
            if (0 < left) and (right < len(s) - 1):
                left -= 1
                right += 1
            else:
                break

    return longest

s1 = "babadkkdabab5"
s2 = "cbbc"

print(longestPalindrome(s2))

