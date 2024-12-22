def permute(nums):
    permutations = list()

    for num in nums:
        index = 0

        if index == len(permutations):
            permutations.append([num])
        else:
            temp = list()

            for perm in permutations:
                for j in range(len(perm) + 1):
                    permCopy = list(perm)
                    permCopy.insert(j, num)
                    temp.append(permCopy)
                
            permutations = temp


    return permutations

test1 = [1, 2, 3, 4]

print(permute(test1))

