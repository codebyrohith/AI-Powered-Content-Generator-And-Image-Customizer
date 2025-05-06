from flask import Blueprint, request, jsonify
import os
from backend.services.image_processing import get_marketing_content
from backend.utils.config import UPLOAD_FOLDER

# Create Flask Blueprint
text_generation_bp = Blueprint("text_generation", __name__)

@text_generation_bp.route("/generate_description", methods=["POST"])
def generate_description():
    """API route to handle image uploads and generate descriptions & marketing content."""
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files["image"]
    image_path = os.path.join(UPLOAD_FOLDER, image.filename)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    image.save(image_path)

    # Extract details from the image
    content = get_marketing_content(image_path)

    return jsonify({
        "marketing_content": content
    })
