// chrome.webRequest.onCompleted.addListener(
//     (details) => {
//       const url = new URL(details.url);
//       const domain = url.hostname;
  
//       console.log("✅ Web request completed to:", domain);
  
//       // You can send this to your Flask backend
//       fetch("http://localhost:5000/analyze", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ domain })
//       })
//         .then(res => res.json())
//         .then(data => {
//           if (data.flagged) {
//             console.warn(`🚨 Violation on ${domain}: ${data.message}`);
//           }
//         })
//         .catch(console.error);
//     },
//     { urls: ["<all_urls>"] },
//     ["responseHeaders"]
//   );
  



console.log("🛠️ Service worker started");

if (chrome.webRequest && chrome.webRequest.onCompleted) {
  chrome.webRequest.onCompleted.addListener(
    (details) => {
      const url = new URL(details.url);
      const domain = url.hostname;

      console.log(" Web request completed to:", domain);

      fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ domain })
      })
        .then(res => res.json())
        .then(data => {
          if (data.flagged) {
            console.warn(`Violation on ${domain}: ${data.message}`);
          }
        })
        .catch(console.error);
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
  );
} else {
  console.error("chrome.webRequest is undefined. Check permissions and context.");
}
