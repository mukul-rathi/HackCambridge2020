from azure.cognitiveservices.vision.customvision.training import CustomVisionTrainingClient
from azure.cognitiveservices.vision.customvision.training.models import ImageFileCreateEntry, Region

from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient

ENDPOINT = "https://hackcambridge2020ecoscancustom.cognitiveservices.azure.com/"

# Replace with a valid key
training_key = "09bef4c8adc949a09cee02d032b5b58b"
prediction_key = "d0852ee0061e46c4ba82fe724ddfbf1a"
prediction_resource_id = "/subscriptions/6b72b363-a73b-4962-982e-b320efdda701/resourceGroups/EcoScan/providers/Microsoft.CognitiveServices/accounts/HackCambridge2020EcoScanCustom"

publish_iteration_name = "detectModel"

trainer = CustomVisionTrainingClient(training_key, endpoint=ENDPOINT)

# Find the object detection domain
obj_detection_domain = next(domain for domain in trainer.get_domains() if domain.type == "ObjectDetection" and domain.name == "General")

# Create a new project
print ("Creating project...")
project = trainer.create_project("My Detection Project", domain_id=obj_detection_domain.id)

# Now there is a trained endpoint that can be used to make a prediction

predictor = CustomVisionPredictionClient(prediction_key, endpoint=ENDPOINT)

print(project.id)
print(publish_iteration_name)
print(test_data)

# Open the sample image and get back the prediction results.
with open("banana.jpg", mode="rb") as test_data:
    results = predictor.detect_image(project.id, publish_iteration_name, test_data)

# Display the results.
for prediction in results.predictions:
    print("\t" + prediction.tag_name + ": {0:.2f}% bbox.left = {1:.2f}, bbox.top = {2:.2f}, bbox.width = {3:.2f}, bbox.height = {4:.2f}".format(prediction.probability * 100, prediction.bounding_box.left, prediction.bounding_box.top, prediction.bounding_box.width, prediction.bounding_box.height))