def rotate(matrix):
    n = len(matrix)

    if n == 1:
        return matrix
    
    pivots = [
        { "x": 0, "y": 0},
        { "x": n - 1, "y": 0},
        { "x": n - 1, "y": n - 1},
        { "x": 0, "y": n - 1}
    ]

    size = n

    while size > 1:
        for i in range(size - 1):
            swap(matrix, pivots[0]['x'], pivots[0]['y'] + i, pivots[1]['x'] - i, pivots[1]['y'])
            swap(matrix, pivots[1]['x'] - i, pivots[1]['y'], pivots[2]['x'], pivots[2]['y'] - i)
            swap(matrix, pivots[2]['x'], pivots[2]['y'] - i, pivots[3]['x'] + i, pivots[3]['y'])
        
        pivots[0]['x'] += 1
        pivots[0]['y'] += 1

        pivots[1]['x'] -= 1
        pivots[1]['y'] += 1

        pivots[2]['x'] -= 1
        pivots[2]['y'] -= 1

        pivots[3]['x'] += 1
        pivots[3]['y'] -= 1

        size -= 2

    return matrix

def swap(matrix, x1, y1, x2, y2):
    temp = matrix[x1][y1]
    matrix[x1][y1] = matrix[x2][y2]
    matrix[x2][y2] = temp

testmatrix1 = [[1 , 2], [3 , 4]]
testmatrix2 = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

testmatrix3 = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
]

testmatrix4 = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25]
]

rotate(testmatrix4)

print(testmatrix4)