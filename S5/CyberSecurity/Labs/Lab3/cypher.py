def encrypt_text(text):
    cipher_text = ""
    for index, char in enumerate(text):
        if char == " ":
            cipher_text += " "
        else:
            new_char = chr(((ord(char) - 65 + (index + 1)) % 26) + 65)
            cipher_text += new_char
    return cipher_text

while True:
    user_input = input("Enter a text with alphabet characters only (or '0' to exit): ")
    
    if user_input == '0':
        print("Exiting program...")
        break
    
    if not all(c.isalpha() or c.isspace() for c in user_input):
        print("Invalid input! Please enter only alphabetic characters and spaces.")
        continue
    
    uppercase_text = user_input.upper()
    encrypted_text = encrypt_text(uppercase_text)
    
    print(f"Cipher Text: {encrypted_text}")
