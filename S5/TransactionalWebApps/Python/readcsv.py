import csv
import os

CSV_FILE = "people.csv"

def read_csv(file_path):
    """Reads a CSV file and returns data as a list and dictionary."""
    data_list = []
    data_dict = {}
    
    if os.path.exists(file_path):
        with open(file_path, mode='r', encoding='utf-8') as file:
            csv_reader = csv.reader(file)
            next(csv_reader, None)
            for row in csv_reader:
                if len(row) == 3:
                    fname, lname, address = row
                    data_list.append((fname, lname, address))
                    data_dict[(fname, lname)] = address
    
    return data_list, data_dict

def write_csv(file_path, data_list):
    """Writes the list of tuples into a CSV file."""
    with open(file_path, mode='w', encoding='utf-8', newline='') as file:
        csv_writer = csv.writer(file)
        csv_writer.writerow(["First Name", "Last Name", "Address"])
        csv_writer.writerows(data_list)

def get_unique_entries(existing_dict):
    """Gets unique user entries while preventing duplicates."""
    while True:
        first_name = input("Enter First Name (or type 'exit' to stop): ").strip()
        if first_name.lower() == "exit":
            break

        last_name = input("Enter Last Name: ").strip()
        address = input("Enter Address: ").strip()

        key = (first_name, last_name)

        if key in existing_dict:
            print("❌ This name already exists! Please enter a different one.")
        else:
            existing_dict[key] = address
            print("✅ Entry added successfully!")

    return existing_dict

existing_list, existing_dict = read_csv(CSV_FILE)

updated_dict = get_unique_entries(existing_dict)

updated_list = [(fname, lname, addr) for (fname, lname), addr in updated_dict.items()]

write_csv(CSV_FILE, updated_list)

print("\n📁 Updated Data:")
print("🔹 List:", updated_list)
print("🔹 Dictionary:", updated_dict)
