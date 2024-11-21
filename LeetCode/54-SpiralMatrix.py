def spiralOrder(matrix):
    m = len(matrix)
    n = len(matrix[0])

    topLimit = -1
    rightLimit = n
    bottomLimit = m
    leftLimit = -1

    size = m * n
    count = 0

    serialList = []

    x = 0
    y = -1

    direction = "right"

    while(count < size):
        if(direction == "right"):
            if(y + 1 < rightLimit):
                y += 1
                serialList.append(matrix[x][y])
                count += 1
            else:
                direction = "down"
                topLimit += 1
        elif(direction == "down"):
            if(x + 1 < bottomLimit):
                x += 1
                serialList.append(matrix[x][y])
                count += 1
            else:
                direction = "left"
                rightLimit -= 1
        elif(direction == "left"):
            if(y - 1 > leftLimit):
                y -= 1
                serialList.append(matrix[x][y])
                count += 1
            else:
                direction = "up"
                bottomLimit -= 1
        elif(direction == "up"):
            if(x - 1 > topLimit):
                x -= 1
                serialList.append(matrix[x][y])
                count += 1
            else:
                direction = "right"
                leftLimit += 1
    
    return serialList

testmatrix1 = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

testmatrix2 = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
]

testmatrix3 = [
    [1, 2],
    [3, 4]
]

testmatrix4 = [
    [1]
]

print(spiralOrder(testmatrix4))