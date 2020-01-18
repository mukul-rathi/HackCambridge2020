import os, io, base64
from flask import Flask, render_template, request, jsonify
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import TextOperationStatusCodes
from azure.cognitiveservices.vision.computervision.models import TextRecognitionMode
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials

credentials = CognitiveServicesCredentials(os.environ['COMPUTER_VISION_SUBSCRIPTION_KEY'])
computervision_client = ComputerVisionClient(os.environ['COMPUTER_VISION_ENDPOINT'], credentials)

app = Flask(__name__)

# The root route, returns the home.html page
@app.route('/')
def home():
    # Add any required page data here
    page_data = {}
    return render_template('home.html', page_data = page_data)

@app.route('/process_image', methods=['POST'])
def check_results():
    # Get the JSON passed to the request and extract the image
    # Convert the image to a binary stream ready to pass to Azure AI services
    body = request.get_json()
    image_bytes = base64.b64decode(body['image_base64'].split(',')[1])
    image = io.BytesIO(image_bytes)

    # Send the image to the Computer Vision service
    description_results = computervision_client.describe_image_in_stream(image)

    # Get the captions (descriptions) from the response, with confidence level
    description = 'Description of remote image: '
    if (len(description_results.captions) == 0):
        description = description + 'No description detected.'
    else:
        for caption in description_results.captions:
            description = description + '\n"{}" with confidence {:.2f}%'.format(caption.text, caption.confidence * 100)

    ######################################################
    #                                                   #
    # Add your code here to use the Computer Vision SDK #
    #                                                   #
    #####################################################

    # Return a result
    print(description_results)
    return jsonify({'description' : description})