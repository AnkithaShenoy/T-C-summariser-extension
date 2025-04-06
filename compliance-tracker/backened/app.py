from flask import Flask, request, jsonify
from gemini_analyser import analyze_violation
from utils.fetch_policy import get_privacy_policy_text

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    domain = data['domain']
    policy_url = data.get('url')  # ✅ Just add this line

    try:
        policy_text = get_privacy_policy_text(domain)
        result = analyze_violation(domain, policy_text)  # ✅ Pass it here
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
