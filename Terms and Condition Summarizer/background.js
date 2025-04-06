// API Configuration
const GEMINI_API_KEY = "your key";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;
// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "processText") {
    processWithGemini(request.text)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Keep the message channel open
  }
});

// Main processing function
async function processWithGemini(text) {
  const truncatedText = text.substring(0, 30000); // Gemini's context limit
  
  try {
    const prompt = buildPrompt(truncatedText);
    const responseText = await callGeminiAPI(prompt);
    return parseResponse(responseText);
  } catch (error) {
    console.error("Gemini processing error:", error);
    throw error;
  }
}

// Build the prompt template
function buildPrompt(text) {
  return `Analyze this Terms & Conditions document and provide structured output:

===SUMMARY===
1. List 3-5 most important points in bullet format
2. Highlight unusual clauses

===PRIVACY==-
⚠️ List data collection practices
⚠️ Identify third-party sharing
✅ Note user rights

===CLAUSES===
1. [Clause name]: [Explanation]
2. [Clause name]: [Explanation]

Document:
${text}`;
}

// Call Gemini API
async function callGeminiAPI(prompt) {
  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.5,
        topP: 0.9,
        maxOutputTokens: 1500
      },
      safetySettings: [
        {
          "category": "HARM_CATEGORY_HATE_SPEECH",
          "threshold": "BLOCK_NONE"
        },
        {
          "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          "threshold": "BLOCK_NONE"
        },
        {
          "category": "HARM_CATEGORY_HARASSMENT",
          "threshold": "BLOCK_NONE"
        },
        {
          "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
          "threshold": "BLOCK_NONE"
        }
      ]
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || `API request failed (HTTP ${response.status})`);
  }
  
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("No response generated - check safety settings");
  }

  return data.candidates[0].content.parts[0].text;
}

// Parse the structured response
function parseResponse(responseText) {
  // Convert markdown bullets to HTML
  const markdownToHtml = (text) => 
    text.replace(/\n⚠️/g, '<br>⚠️')
        .replace(/\n✅/g, '<br>✅')
        .replace(/\n•/g, '<br>•');

  const getSection = (section) => {
    const regex = new RegExp(`===${section}===([\\s\\S]*?)(?===|$)`, 'i');
    const match = responseText.match(regex);
    return match ? markdownToHtml(match[1].trim()) : `No ${section.toLowerCase()} found`;
  };

  return {
    keyPoints: getSection("SUMMARY"),
    privacyAlerts: getSection("PRIVACY"),
    importantClauses: getSection("CLAUSES")
  };
}
