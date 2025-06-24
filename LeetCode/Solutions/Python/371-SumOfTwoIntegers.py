a = -50
b = 100

mask = 0xffff

print(bin(a), bin(b))
while((b&mask) > 0):
    a, b = a^b, (a&b) << 1
    print(bin(a), bin(b))

a = a if (b == 0) else (a&mask)

print(a)
