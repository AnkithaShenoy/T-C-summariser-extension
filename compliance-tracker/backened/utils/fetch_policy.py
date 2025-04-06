# import requests
# from bs4 import BeautifulSoup
# from urllib.parse import urljoin

# def get_privacy_policy_text(domain):
#     urls = [
#         f"https://{domain}/privacy",
#         f"https://{domain}/privacy-policy",
#         f"https://{domain}/terms",
#     ]
#     for url in urls:
#         try:
#             res = requests.get(url, timeout=5)
#             if res.ok:
#                 soup = BeautifulSoup(res.text, "html.parser")
#                 return soup.get_text(separator=" ", strip=True),url
#         except:
#             continue
#     return "No policy found"



import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def get_privacy_policy_text(domain):
    base_url = f"https://{domain}"

    # Try known paths
    paths = ["/privacy", "/privacy-policy", "/terms"]
    for path in paths:
        try:
            url = urljoin(base_url, path)
            res = requests.get(url, timeout=5)
            if res.ok:
                soup = BeautifulSoup(res.text, "html.parser")
                return soup.get_text(separator=" ", strip=True), url
        except:
            continue

    # Fallback: search for links on homepage
    try:
        res = requests.get(base_url, timeout=5)
        if res.ok:
            soup = BeautifulSoup(res.text, "html.parser")
            links = soup.find_all("a", href=True)
            for link in links:
                href = link["href"].lower()
                if "privacy" in href:
                    policy_url = urljoin(base_url, link["href"])
                    try:
                        res2 = requests.get(policy_url, timeout=5)
                        if res2.ok:
                            policy_soup = BeautifulSoup(res2.text, "html.parser")
                            return policy_soup.get_text(separator=" ", strip=True), policy_url
                    except:
                        continue
    except:
        pass

    return "No policy found", None
