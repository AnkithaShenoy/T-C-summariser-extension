// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "analyzePage") {
    analyzePage().then(result => {
      sendResponse({success: true, summary: result});
    }).catch(error => {
      sendResponse({success: false, error: error.message});
    });
    return true; // Indicates we wish to send a response asynchronously
  }
});

async function analyzePage() {
  // Get all text content from the page
  const pageText = getPageText();
  
  // Check if we have enough text (likely a T&C page)
  if (pageText.length < 500) {
    throw new Error("Not enough text content to analyze");
  }
  
  // Send to background for processing
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: "processText",
      text: pageText
    }, function(response) {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}

function getPageText() {
  // Get all text content while ignoring script and style elements
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip text in script, style, or noscript elements
        if (node.parentNode.nodeName === 'SCRIPT' || 
            node.parentNode.nodeName === 'STYLE' ||
            node.parentNode.nodeName === 'NOSCRIPT') {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Skip empty or whitespace-only text nodes
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        
        return NodeFilter.FILTER_ACCEPT;
      }
    },
    false
  );
  
  let text = '';
  let node;
  while (node = walker.nextNode()) {
    text += node.nodeValue.trim() + '\n';
  }
  
  return text;
}