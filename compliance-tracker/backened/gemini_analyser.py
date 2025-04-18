import google.generativeai as genai
import os


genai.configure(api_key="your key")

model = genai.GenerativeModel("gemini-2.0-flash")

def analyze_violation(domain, policy_text):
    prompt = f"""
    You are a compliance auditor. A website made a request to a third-party domain: "{domain}".
    Here is the privacy policy content of the site:
    {policy_text[:4000]}

    Does this website disclose usage of the domain {domain}? 
    If not, flag this as a potential policy violation.
    Answer 'Yes , it's disclosed' or 'No its not disclosed, it is a potential violation' and give a reason.
    """

    response = model.generate_content(prompt)
    reply = response.text.strip()

    flagged = "violation" in reply.lower() or "no" in reply.lower()

    return {
        "flagged": flagged,
        "message": reply
    }
