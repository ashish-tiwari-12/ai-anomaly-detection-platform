from flask import Flask, request, jsonify
from flask_cors import CORS
from model import AnomalyDetector
import os

app = Flask(__name__)
CORS(app)

# Initialize the detector
detector = AnomalyDetector(contamination=0.05)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "ML Service is running"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        req_data = request.get_json()
        
        if not req_data or 'data' not in req_data:
            return jsonify({"error": "No data provided"}), 400
            
        data = req_data['data']
        
        if not isinstance(data, list):
            return jsonify({"error": "Data must be a list of records"}), 400
            
        result = detector.process_data(data)
        
        if "error" in result:
            return jsonify(result), 400
            
        return jsonify({
            "success": True,
            "results": result
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
