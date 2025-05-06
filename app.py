# from flask import Flask
# from backend.routes.generate_text import text_generation_bp
# from backend.routes.chat import chat_bp

# app = Flask(__name__)

# # Register Blueprints
# app.register_blueprint(text_generation_bp, url_prefix="/api")
# app.register_blueprint(chat_bp, url_prefix="/api")

# if __name__ == "__main__":
#     app.run(debug=True)


from flask import Flask
from flask_cors import CORS
from backend.routes.chat import chat_bp  # Import chat routes

app = Flask(__name__)
CORS(app)  # Enable CORS

# Register Blueprints
app.register_blueprint(chat_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)




