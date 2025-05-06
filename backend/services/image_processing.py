# import base64
# from groq import Groq
# from backend.utils.config import GROQ_API_KEY

# # Initialize Groq Client
# client = Groq(api_key=GROQ_API_KEY)

# def encode_image(image_path):
#     """Convert image to base64 format for Groq API."""
#     with open(image_path, "rb") as image_file:
#         return base64.b64encode(image_file.read()).decode("utf-8")

# def get_marketing_content(image_path):
#     """Extract product details from an image using Groq's LLaMA-3.2 Vision model."""
#     base64_image = encode_image(image_path)
    
#     completion = client.chat.completions.create(
#         model="llama-3.2-11b-vision-preview",
#         messages=[
#             {
#                 "role": "user",
#                 "content": [
#                     {"type": "text", "text": "Based on the details in the given image, generate product description and marketing content"},
#                     {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
#                 ]
#             }
#         ],
#         temperature=1,
#         max_completion_tokens=1024,
#         top_p=1,
#         stream=False,
#         stop=None,
#     )
#     print(completion)
#     return completion.choices[0].message.content  # Extract textual description


import base64
from groq import Groq
from backend.utils.config import GROQ_API_KEY

# Initialize Groq Client
client = Groq(api_key=GROQ_API_KEY)

# Temporary chat history storage
chat_history = {}

def encode_image(image_path):
    """Convert image to base64 format for Groq API."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def get_marketing_content(image_path, user_id):
    """Extract product details and marketing content from an image using Groq's LLaMA-3.2 Vision model."""
    base64_image = encode_image(image_path)
    
    completion = client.chat.completions.create(
        model="llama-3.2-11b-vision-preview",
        messages=[
            {"role": "user", "content": [
                {"type": "text", "text": "Based on the details in the given image, generate product description and marketing content"},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]}
        ],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
        stop=None,
    )

    if completion and completion.choices:
        content = completion.choices[0].message.content
        # Store the first response in chat history
        chat_history[user_id] = {"image_details": content, "chat": []}
        return content

    return "Error: Unable to generate marketing content from the image."

