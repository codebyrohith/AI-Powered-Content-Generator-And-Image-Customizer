from pymongo import MongoClient
import os

# MongoDB Configuration
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "chat_database"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
chat_collection = db["chat_history"]
customizations_collection = db["customizations_history"]


GROQ_API_KEY = os.getenv("GROQ_API_KEY", "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")