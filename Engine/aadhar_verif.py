from flask import Flask, request, jsonify
import cv2
import pytesseract
import re
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
from pymongo.mongo_client import MongoClient

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

# Path to Tesseract OCR (Modify if needed)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Upload folder
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

def extract_aadhar_number(image_path):
    """ Extracts Aadhar number from an image using OCR """
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not read the image {image_path}")
        return None, "Error: Unable to read image."

    # Convert to grayscale
    gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply preprocessing (better OCR accuracy)
    _, gray_image = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Perform OCR
    extracted_text = pytesseract.image_to_string(gray_image)

    # Extract Aadhaar number (Handles spaces or dashes)
    aadhar_match = re.search(r'\d{4}[\s-]?\d{4}[\s-]?\d{4}', extracted_text)
    aadhar_number = aadhar_match.group().replace(" ", "").replace("-", "") if aadhar_match else None

    return aadhar_number, extracted_text

@app.route("/upload", methods=["POST"])
def upload_file():
    """ API Endpoint to upload image and extract Aadhaar number """
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    aadhar_number, extracted_text = extract_aadhar_number(filepath)
    os.remove(filepath)

    if aadhar_number:
        return jsonify({"success": True, "aadhar_number": aadhar_number, "extracted_text": extracted_text})
    else:
        return jsonify({"success": False, "error": "Aadhaar number not found", "extracted_text": extracted_text})

# MongoDB Connection
uri = "mongodb+srv://sp177:1772003.Sp.00@govtweb.bg28wov.mongodb.net/test?retryWrites=true&w=majority&appName=GovtWeb"
client = MongoClient(uri)
db = client["GovtWeb"]
collection=db["AadharDetails"]

@app.route("/verify", methods=["POST"])
def verify_details():
    try:
        data = request.json
        aadhar_number = data.get("aadhar", "").strip()
        first_name = data.get("first", "").strip().lower()
        last_name = data.get("last", "").strip().lower()
        date_of_birth = data.get("dob", "").strip()

    # Validate required fields
        if not (aadhar_number and first_name and last_name and date_of_birth):
            return jsonify({"success": False, "message": "All fields are required"}), 400

    # Fetch only required fields from MongoDB

        user_details = collection.find_one(
            {"aadhar": aadhar_number},
            {"_id": 0, "first": 1, "last": 1, "dob": 1}
        )

        if not user_details:
            return jsonify({"success": False, "message": "Aadhar not found"}), 404

    # Normalize stored data for comparison
        stored_first = user_details.get("first", "").strip().lower()
        stored_last = user_details.get("last", "").strip().lower()
        stored_dob = str(user_details.get("dob", "")).strip()  # Ensure DOB is string for comparison

    # Validate credentials
        if stored_first == first_name and stored_last == last_name and stored_dob == date_of_birth:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False, "message": "False Credentials"}), 200

    except Exception as e:
        return jsonify({"success": False, "message": "Internal Server Error", "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
