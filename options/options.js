document.getElementById('save').addEventListener('click', () => {
  const key = document.getElementById('api-key').value;
  chrome.storage.sync.set({ geminiApiKey: key }, () => {
    alert('API key saved!');
  });
});

// Load saved key
chrome.storage.sync.get('geminiApiKey', (data) => {
  if (data.geminiApiKey) {
    document.getElementById('api-key').value = data.geminiApiKey;
  }
});