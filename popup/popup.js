document.addEventListener('DOMContentLoaded', function() {
  const analyzeBtn = document.getElementById('analyze-btn');
  const loading = document.getElementById('loading');
  const summaryContainer = document.getElementById('summary-container');
  const statusDiv = document.getElementById('status');
  
  // Check if current page might be a T&C page
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    if (isTermsPage(currentTab.url)) {
      statusDiv.textContent = "This appears to be a Terms & Conditions page. Click 'Analyze Page' to summarize.";
    } else {
      statusDiv.textContent = "This doesn't appear to be a T&C page. You can still try to analyze it.";
    }
  });

  analyzeBtn.addEventListener('click', function() {
    loading.classList.remove('hidden');
    summaryContainer.classList.add('hidden');
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      
      // Execute content script to get page text
      chrome.scripting.executeScript({
        target: {tabId: currentTab.id},
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(currentTab.id, {action: "analyzePage"}, function(response) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            statusDiv.textContent = "Error analyzing page. Please try again.";
            loading.classList.add('hidden');
            return;
          }
          
          if (response && response.success) {
            displaySummary(response.summary);
          } else {
            statusDiv.textContent = "Could not analyze this page. Make sure it's a Terms & Conditions page.";
          }
          loading.classList.add('hidden');
        });
      });
    });
  });

  function displaySummary(summary) {
    const summaryContent = document.getElementById('summary-content');
    const privacyAlerts = document.getElementById('privacy-alerts');
    const importantClauses = document.getElementById('important-clauses');
    
    summaryContent.innerHTML = summary.keyPoints || "No summary available.";
    privacyAlerts.innerHTML = summary.privacyAlerts || "No specific privacy alerts found.";
    importantClauses.innerHTML = summary.importantClauses || "No important clauses highlighted.";
    
    summaryContainer.classList.remove('hidden');
    statusDiv.textContent = "Analysis complete!";
  }

  function isTermsPage(url) {
    const termsKeywords = [
      'terms', 'conditions', 'privacy', 'policy', 
      'agreement', 'legal', 'tos', 'eula'
    ];
    return termsKeywords.some(keyword => 
      url.toLowerCase().includes(keyword)
    );
  }
});