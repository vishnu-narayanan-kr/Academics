def findLength(s, t):
    dpA = [[0] * (len(s) + 1) for _ in range(len(t) + 1)]

    for i in range(0, len(t)):
        for j in range(0, len(s)):
            if s[j] == t[i]:
                dpA[i + 1][j + 1] = dpA[i][j] + 1
            else:
                dpA[i + 1][j + 1] = max(dpA[i][j + 1], dpA[i + 1][j])

    return dpA[len(t)][len(s)]


s = "ezupkr"
t = "ubmrapg"

print(findLength(s, t))