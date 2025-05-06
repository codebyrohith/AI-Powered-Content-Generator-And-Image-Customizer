import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";

const MessageInput = ({ activeTab, selectedChat, setSelectedChat }) => {
  const { userId, addChatResponse } = useAppContext();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);

    try {
      if (activeTab === "marketing") {
        if (selectedChat) {
          const response = await axios.post("http://127.0.0.1:5000/api/chat", {
            user_id: selectedChat.user_id,
            prompt: message,
          });

          const updatedChat = [
            ...selectedChat.chat,
            { role: "user", content: message },
            { role: "assistant", content: response.data.response },
          ];

          setSelectedChat({
            ...selectedChat,
            chat: updatedChat,
          });
        } else {
          if (!userId) {
            alert("Please upload an image first.");
            setLoading(false);
            return;
          }

          const response = await axios.post("http://127.0.0.1:5000/api/chat", {
            user_id: userId,
            prompt: message,
          });

          addChatResponse(message, response.data.response);
        }
      } else {
        // IMAGE CUSTOMIZATION TAB
        const customizationId = selectedChat?.customization_id;
        const latestImage = selectedChat?.chat?.length
          ? selectedChat.chat[selectedChat.chat.length - 1].image_base64
          : selectedChat.image_base64;

        // 1️⃣ Generate new customization
        const customizeResponse = await axios.post(
          "https://bond-basket-growing-humor.trycloudflare.com/customize",
          {
            image: latestImage,
            prompt: message,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (customizeResponse.data.success) {
          const modifiedImageBase64 = customizeResponse.data.modified_image;

          // 2️⃣ Save to backend, only send original_image_base64 if new chain
          const savePayload = {
            customization_id: customizationId,
            image_base64: modifiedImageBase64,
            prompt: message,
          };

          if (!customizationId) {
            savePayload.original_image_base64 = latestImage;
          }

          console.log("saved payload :" + savePayload["customization_id"]);

          const saveResponse = await axios.post(
            "http://127.0.0.1:5000/api/save_customization",
            savePayload
          );

          if (saveResponse.data.success) {
            const updatedChat = [
              ...selectedChat.chat,
              {
                role: "user",
                content: message,
                image_base64: modifiedImageBase64,
              },
            ];

            setSelectedChat({
              ...selectedChat,
              chat: updatedChat,
              customization_id: saveResponse.data.customization_id,
            });
          } else {
            alert("Failed to save customization to the backend.");
          }
        } else {
          alert("Failed to generate customized image.");
        }
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Request failed! Please try again.");
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <form
      className="flex p-4 w-full max-w-3xl mx-auto bg-[#40414F] rounded-xl shadow-lg"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="flex-1 p-3 text-white bg-transparent placeholder-gray-300 focus:outline-none"
        style={{ backgroundColor: "transparent" }}
        placeholder={
          activeTab === "marketing"
            ? "Enter prompt for AI..."
            : "Describe the image customization..."
        }
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg ml-2"
        disabled={loading}
      >
        {loading ? "Processing..." : "Send"}
      </button>
    </form>
  );
};

export default MessageInput;
