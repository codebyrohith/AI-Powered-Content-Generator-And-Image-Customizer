import React, { useState, useEffect } from "react";
import axios from "axios";

const Sidebar = ({ onSelectChat, activeTab }) => {
  const [chats, setChats] = useState([]);
  const [customizations, setCustomizations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "marketing") {
          const response = await axios.get(
            "http://127.0.0.1:5000/api/get_all_chats"
          );
          if (response.data.chats) {
            setChats(response.data.chats.reverse());
          }
        } else if (activeTab === "customization") {
          const response = await axios.get(
            "http://127.0.0.1:5000/api/get_all_customizations"
          );
          if (response.data.success) {
            console.log(response.data.customizations);
            setCustomizations(response.data.customizations.reverse());
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleChatClick = async (userId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/get_chat/${userId}`
      );
      if (response.data) {
        onSelectChat(response.data);
      }
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };

  const handleCustomizationClick = (customization) => {
    onSelectChat(customization);
  };

  return (
    <div className="w-64 bg-gray-900 text-white p-4 h-full overflow-y-auto shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {activeTab === "marketing" ? "Chat History" : "Customization History"}
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {activeTab === "marketing"
            ? chats.map((chatItem, index) => (
                <li
                  key={index}
                  className="mb-2 cursor-pointer p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-200 shadow-sm"
                  onClick={() => handleChatClick(chatItem.user_id)}
                >
                  {chatItem.chat && chatItem.chat.length > 0
                    ? chatItem.chat[0].user || `Chat ${index + 1}`
                    : `Chat ${index + 1}`}
                </li>
              ))
            : customizations.map((item, index) => (
                <li
                  key={index}
                  className="mb-2 cursor-pointer p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-200 shadow-sm"
                  onClick={() => handleCustomizationClick(item)}
                >
                  {`Customization ${index + 1}`}
                </li>
              ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
