from backend.utils.config import chat_collection, GROQ_API_KEY
from groq import Groq

client = Groq(api_key=GROQ_API_KEY)

def get_marketing_content(base64_image, user_id):
    """Extract product details and marketing content from an image using Groq's LLaMA-3.2 Vision model."""
    
    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
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
        # Store the first response in MongoDB
        chat_collection.update_one(
            {"user_id": user_id},
            {"$set": {"image_details": content}},
            upsert=True
        )
        return content

    return "Error: Unable to generate marketing content from the image."

def generate_response(user_id, user_prompt):
    """Generate AI responses using stored image details and past chats."""
    user_chat = chat_collection.find_one({"user_id": user_id})

    if not user_chat or "image_details" not in user_chat:
        return "Error: No image uploaded. Please upload an image first."

    previous_content = user_chat["image_details"]
    chat_history = user_chat["chat"]

    # Generate AI response using previous conversation history
    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {"role": "system", "content": "You are an AI marketing assistant that generates compelling product descriptions and marketing content."},
            {"role": "user", "content": f"Image Details: {previous_content}"},
            *chat_history,
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.9,
        max_completion_tokens=512,
        top_p=0.95,
        stream=False
    )

    if completion and completion.choices:
        response = completion.choices[0].message.content

        # Save chat history in MongoDB
        chat_collection.update_one(
            {"user_id": user_id},
            {"$push": {"chat": {"role": "user", "content": user_prompt}}},
            upsert=True
        )
        chat_collection.update_one(
            {"user_id": user_id},
            {"$push": {"chat": {"role": "assistant", "content": response}}},
            upsert=True
        )

        return response

    return "Error: Unable to generate a response."
