import requests, os, sys, base64
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

endpoint = "https://hackcambridge2020ecoscancustom.cognitiveservices.azure.com/customvision/v3.0/Prediction/b22c88e7-f18f-48a5-a47d-1fc90cf12440/classify/iterations/Iteration2/image"
subscription_key = "d0852ee0061e46c4ba82fe724ddfbf1a"

app = Flask(__name__)
CORS(app)

# The root route
@app.route('/',methods=['POST'])
def check_results():
    # Get the JSON passed to the request and extract the image
    # Convert the image to a binary stream ready to pass to Azure AI services
    body = request.get_json()
    print(body)
    image_bytes = base64.b64decode(body['image_base64'].split(',')[1])

    headers = {'Prediction-Key': subscription_key, 'Content-Type': 'application/octet-stream'}
    params = {'language': 'unk', 'detectOrientation': 'true'}
    response = requests.post(endpoint, headers=headers, params=params, data=image_bytes)
    response.raise_for_status()

    analysis = response.json()

    predictions = analysis['predictions']
    best_prediction = predictions[0]

    print(best_prediction)
    return jsonify({'object' : best_prediction['tagName'], 'probability': best_prediction['probability']})