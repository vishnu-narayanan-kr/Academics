import tkinter as tk
from tkinter import messagebox
import csv
import os

FILENAME = "french_vocab.csv"
FIELDS = ["French Word", "English Meaning", "Part of Speech", "Theme/Category", "Example Sentence", "Notes", "Learned (Y/N)"]

def load_vocab():
    if not os.path.exists(FILENAME):
        with open(FILENAME, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=FIELDS)
            writer.writeheader()
        return []
    with open(FILENAME, mode='r', encoding='utf-8') as file:
        return list(csv.DictReader(file))

def save_vocab(data):
    with open(FILENAME, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(data)

def find_word(data, word):
    for i, row in enumerate(data):
        if row["French Word"].strip().lower() == word.strip().lower():
            return i, row
    return None, None

class VocabApp:
    def __init__(self, root):
        self.root = root
        self.root.title("French Vocabulary Tracker")
        self.vocab_data = load_vocab()
        self.entries = {}
        
        for idx, field in enumerate(FIELDS):
            tk.Label(root, text=field).grid(row=idx, column=0, sticky="e")
            entry = tk.Entry(root, width=50)
            entry.grid(row=idx, column=1)
            self.entries[field] = entry

        self.status_label = tk.Label(root, text="", fg="blue")
        self.status_label.grid(row=len(FIELDS), column=0, columnspan=2, pady=5)

        button_frame = tk.Frame(root)
        button_frame.grid(row=len(FIELDS)+1, column=0, columnspan=2, pady=10)

        tk.Button(button_frame, text="Search/Edit", command=self.search_word).grid(row=0, column=0, padx=5)
        tk.Button(button_frame, text="Save Entry", command=self.save_entry).grid(row=0, column=1, padx=5)
        tk.Button(button_frame, text="Clear", command=self.clear_fields).grid(row=0, column=2, padx=5)

        self.update_status()

    def update_status(self):
        total = len(self.vocab_data)
        learned = sum(1 for entry in self.vocab_data if entry["Learned (Y/N)"].strip().lower() == 'y')
        self.status_label.config(text=f"📚 Total Words: {total} | ✅ Learned: {learned}")

    def clear_fields(self):
        for entry in self.entries.values():
            entry.delete(0, tk.END)

    def search_word(self):
        word = self.entries["French Word"].get().strip()
        if not word:
            messagebox.showwarning("Input Needed", "Enter a French word to search.")
            return

        idx, entry = find_word(self.vocab_data, word)
        if entry:
            for field in FIELDS:
                self.entries[field].delete(0, tk.END)
                self.entries[field].insert(0, entry.get(field, ""))
        else:
            messagebox.showinfo("Not Found", f"'{word}' is not in your list. You can add it as a new word.")

    def save_entry(self):
        new_entry = {field: self.entries[field].get().strip() for field in FIELDS}
        if not new_entry["French Word"]:
            messagebox.showerror("Missing Word", "French Word field is required.")
            return

        idx, existing = find_word(self.vocab_data, new_entry["French Word"])
        if existing:
            self.vocab_data[idx] = new_entry
        else:
            self.vocab_data.append(new_entry)
        
        save_vocab(self.vocab_data)
        self.update_status()
        self.clear_fields()

if __name__ == "__main__":
    root = tk.Tk()
    app = VocabApp(root)
    root.mainloop()
