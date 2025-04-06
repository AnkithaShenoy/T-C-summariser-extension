// Part 1: Detect third-party domains
function getThirdPartyDomains() {
    const currentDomain = window.location.hostname;
    const resources = performance.getEntriesByType("resource");
    const domains = new Set();
  
    for (let r of resources) {
      try {
        const url = new URL(r.name);
        if (!url.hostname.includes(currentDomain)) {
          domains.add(url.hostname);
        }
      } catch (e) {
        continue;
      }
    }
  
    return Array.from(domains);
  }
  
  const thirdPartyDomains = getThirdPartyDomains();
  console.log("🔍 Third-party domains detected:", thirdPartyDomains);
  
  // Optional: send to popup or background if needed
  chrome.runtime.sendMessage({ type: "THIRD_PARTY_DOMAINS", domains: thirdPartyDomains });
  
  // Part 2: Analyze current domain's privacy policy
  (async () => {
    const domain = window.location.hostname;
    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
  
      const data = await res.json();
      if (data.flagged) {
        console.warn(` Violation Detected on ${domain}: ${data.message}`);
      } else {
        console.log(`${domain} is clean.`);
      }
    } catch (err) {
      console.error(" Error analyzing policy:", err);
    }
  })();
  