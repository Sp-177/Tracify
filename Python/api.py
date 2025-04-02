from flask import Flask, request, jsonify
import face_recognition
import os
import numpy as np
from pymongo import MongoClient
from dotenv import load_dotenv
from scipy.spatial.distance import cosine
import cv2

load_dotenv()

app = Flask(__name__)

UPLOAD_FOLDER = "uploads/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Connect to MongoDB
mongo_uri = "mongodb://localhost:27017/"  # Replace with your MongoDB URI
client = MongoClient(mongo_uri)
db = client["Tracify"]
collection = db["images"]

def get_embedding(image_path):
    image = face_recognition.load_image_file(image_path)
    embedding = face_recognition.face_encodings(image)
    if not embedding:
        print(f"No face detected in {image_path}")
        return None
    return embedding[0]

def find_closest_match(new_embedding, threshold=0.95):  
    all_images = collection.find({})
    best_match = None
    best_similarity = -1  
    
    # while True:
    #     video=cv2.VideoCapture(0)
        
    for img in all_images:
        existing_embedding = np.array(img["embedding"])
        similarity = 1 - cosine(new_embedding, existing_embedding)

        # print(f"Similarity with {img['_id']}: {similarity}")  

        if similarity > best_similarity and similarity > threshold:
            best_similarity = similarity
            best_match = img["_id"]

    print(f"Final best match: {best_match} with similarity {best_similarity}")
    return best_match

def process_video(video_path):
    """Extract frames and get embeddings from a video."""
    video_capture = cv2.VideoCapture(video_path)
    embeddings = []
    
    while True:
        success, frame = video_capture.read()
        if not success:
            break
        # Convert frame from BGR to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_encodings = face_recognition.face_encodings(rgb_frame)
        if face_encodings:
            embeddings.append(face_encodings[0])
    
    video_capture.release()
    return embeddings

@app.route("/process", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files["image"]
    image_path = os.path.join(app.config["UPLOAD_FOLDER"], image_file.filename)
    image_file.save(image_path)

    embedding = get_embedding(image_path)
    if embedding is None:
        return jsonify({"error": "No face detected"}), 400

    match_id = find_closest_match(embedding)  # Compare with existing images
    match = match_id is not None
    
    if not match:
        collection.insert_one({
            "embedding": list(map(float, embedding)),
            # Optionally include additional metadata like image name or path
        })
    else:
        collection.delete_one({"_id": match_id})
        

    return jsonify({"embedding": list(map(float, embedding)), "match": match, "match_id": str(match_id) if match else None})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)

