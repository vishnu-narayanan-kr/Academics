def mySqrt(x):
    left = 0
    right = x

    while(left <= right):
        middle = (left + right) // 2

        square = middle * middle

        if square == x: return middle
        elif square < x: left = middle + 1
        else: right = middle - 1

    return right

nums = [0, 1, 2, 3, 4, 10, 16, 624, 625]

[print(num, mySqrt(num)) for num in nums]