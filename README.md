# AI-powered T&C Summarizer and Policy Compliance Web Extension

![Extension Screenshot](Terms-and-Condition-Summarizer/output.jpg)
## Problem Statement

Privacy policies and terms & conditions documents are:
- Excessively long and complex
- Difficult for users to understand key obligations and risks
- Often non-transparent about third-party data sharing
- Lacking automated systems to verify policy compliance

## Solution Overview

### AI-Powered Policy Summarizer
- Automatically extracts and condenses key clauses from T&Cs and privacy policies
- Identifies and highlights unusual or high-risk terms
- Presents information in simple, actionable format

### Real-Time Compliance Monitor
- Tracks all network requests and data transmissions
- Cross-references detected third-party services with policy disclosures
- Flags undisclosed data sharing and policy violations

## Tech Stack

### T&C Summarizer
- **Frontend**: Chrome Extension (HTML/CSS, Vanilla JS)
- **AI Processing**: Gemini API (text summarization)
- **Browser APIs**: 
  - `chrome.tabs`
  - `chrome.runtime`
  - `chrome.storage`
- **Data Handling**: JSON (structured output)

### Privacy Compliance Monitor
- **Network Monitoring**: `chrome.webRequest` API
- **Real-Time Analysis**: JavaScript (tracker detection)
- **Policy Matching**: Gemini API (allowed domains extraction)
- **Alerts**: `chrome.notifications` API
- **Storage**: `chrome.storage.sync` (rules caching)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/ai-policy-extension.git
