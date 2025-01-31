def permute1(nums):
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

# Now let's do it using Backtracking


perms = list()
perm = list()

def permute(nums = []):
    for i in range(len(nums)):
      num = nums.pop(i)
      perm.append(num)
      permute(nums)
      perm.remove(num)
      nums.insert(i, num)
    
    if len(nums) == 0:
        perms.append(perm.copy())

permute(test1)

print(perms)

