document.addEventListener("DOMContentLoaded", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab.url);
    const domain = url.hostname;
  
    document.getElementById("domain").textContent = `Domain: ${domain}`;
  
    fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain: domain, url: tab.url }),
    })
      .then((res) => res.json())
      .then((data) => {
        const resultEl = document.getElementById("result");
        if (data.flagged) {
          resultEl.textContent = ` Violation: ${data.message}`;
          resultEl.className = "status flagged";
        } else {
          resultEl.textContent = `Compliant: ${data.message}`;
          resultEl.className = "status safe";
        }
      })
      .catch((err) => {
        document.getElementById("result").textContent = "Error contacting backend";
        console.error(err);
      });
  });
  