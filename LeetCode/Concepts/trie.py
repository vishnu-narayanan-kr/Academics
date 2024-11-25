words = [
    "apple",
    "ape",
    "bananas",
    "bandit",
    "bandage",
    "oath",
    "oak"
]

def createTrie(words):
    root = dict()

    for word in words:
        node = root
        for c in word:
            if c not in node.keys():
                node[c] = { "isWord": False }
            node = node[c]
        node["isWord"] = True


    return root

trie = createTrie(words)

def searchTrie(trie, word):
    node = trie

    for c in word:
        if c in node.keys():
            node = node[c]
        else:
            return False
        
    return node["isWord"]

words2 = [
    "apple",
    "aper",
    "bananas",
    "bandrit",
    "bandage",
    "oahth",
    "oak"
]

for word in words2:
    print(searchTrie(trie, word))
