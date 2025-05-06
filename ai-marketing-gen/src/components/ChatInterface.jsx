import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import MessageInput from "./MessageInput";
import PictureProcessing from "./PictureProcessing";
import ImageCustomization from "./ImageCustomization";
import Sidebar from "./SideBar";
import axios from "axios";

const ChatInterface = () => {
  const { uploadedImages, marketingContent, chatHistory } = useAppContext();
  const [activeTab, setActiveTab] = useState("marketing");
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectChat = async (item) => {
    console.log(item);
    if (activeTab === "customization") {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/get_customization_chain/${item.customization_id}`
        );
        if (response.data.success) {
          setSelectedChat({
            customization_id: response.data.chain.customization_id,
            image_base64: response.data.chain.original_image_base64,
            chat: response.data.chain.customizations.map((c) => ({
              role: "user",
              content: c.prompt,
              image_base64: c.image_base64,
            })),
          });
        }
      } catch (error) {
        console.error("Failed to fetch customization chain:", error);
      }
    } else {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/get_chat/${item.user_id}`
        );
        if (response.data) {
          setSelectedChat(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch marketing chat:", error);
      }
    }
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelectChat={handleSelectChat} activeTab={activeTab} />

      <div className="flex flex-col flex-1 items-center bg-[#343541] p-4">
        <div className="w-full max-w-3xl h-full flex flex-col bg-[#40414F] shadow-md rounded-xl border border-gray-700">
          <div className="flex-1 overflow-y-auto pr-1 h-0 grow">
            <div className="px-4 pb-2">
              {selectedChat ? (
                <>
                  <button
                    onClick={handleBack}
                    className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Back
                  </button>

                  {selectedChat.image_base64 && (
                    <img
                      src={`data:image/jpeg;base64,${selectedChat.image_base64}`}
                      alt="Uploaded"
                      className="w-48 h-48 object-cover rounded-lg shadow-md mx-auto mb-4"
                    />
                  )}

                  <div className="mt-4 space-y-4">
                    {selectedChat.chat && selectedChat.chat.length > 0 ? (
                      selectedChat.chat.map((message, index) => (
                        <div key={index} className="w-full">
                          {activeTab === "marketing" ? (
                            // Marketing tab → stay as-is
                            message.role === "user" ? (
                              <div className="flex justify-end w-full mb-2">
                                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-lg shadow-md">
                                  <strong>You:</strong> {message.content}
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-start w-full mb-2">
                                <div className="bg-gray-200 text-black p-3 rounded-lg max-w-lg shadow-md">
                                  <strong>AI:</strong> {message.content}
                                </div>
                              </div>
                            )
                          ) : (
                            // Customization tab → chat-style stack
                            <div className="flex flex-col w-full mb-4">
                              {/* User (Prompt) bubble on right */}
                              <div className="flex justify-end">
                                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-lg shadow-md">
                                  <strong>You:</strong> {message.content}
                                </div>
                              </div>
                              {/* AI (Image) bubble on left */}
                              {message.image_base64 && (
                                <div className="flex justify-start mb-2 w-full">
                                  <div className="bg-gray-200 text-black p-2 rounded-lg shadow-md flex flex-col items-center w-56">
                                    <img
                                      src={`data:image/png;base64,${message.image_base64}`}
                                      alt={`Customized ${index}`}
                                      className="w-48 h-48 object-cover rounded-lg"
                                    />
                                    <a
                                      href={`data:image/png;base64,${message.image_base64}`}
                                      download={`customized_image_${
                                        index + 1
                                      }.png`}
                                      className="mt-2 bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600 transition text-center"
                                    >
                                      Download
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No messages in this chat yet.</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-4 pt-2">
                    <button
                      onClick={() => setActiveTab("marketing")}
                      className={`px-4 py-2 rounded-l-lg ${
                        activeTab === "marketing"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      Marketing Content
                    </button>
                    <button
                      onClick={() => setActiveTab("customization")}
                      className={`px-4 py-2 rounded-r-lg ${
                        activeTab === "customization"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      Image Customization
                    </button>
                  </div>

                  {activeTab === "marketing" ? (
                    <>
                      <h2 className="text-2xl text-white font-bold mb-4 text-center">
                        Marketing Content Generator
                      </h2>
                      <PictureProcessing />

                      {uploadedImages.map((img, index) => (
                        <div
                          key={index}
                          className="mb-4 border border-none p-4 rounded-lg shadow-lg bg-[#343541]"
                        >
                          <img
                            src={img}
                            alt="Uploaded"
                            className="w-48 h-48 object-cover rounded-lg shadow-md mx-auto"
                          />
                          <p className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded">
                            <strong>Generated Content:</strong>{" "}
                            {marketingContent[index]}
                          </p>
                        </div>
                      ))}

                      <div className="mt-4 space-y-4">
                        {chatHistory.map((chat, index) => (
                          <div key={index} className="flex flex-col space-y-2">
                            <div className="flex justify-end">
                              <div className="bg-blue-500 text-white p-3 rounded-lg max-w-lg shadow-md">
                                <strong>You:</strong> {chat.user}
                              </div>
                            </div>
                            <div className="flex justify-start">
                              <div className="bg-gray-200 text-black p-3 rounded-lg max-w-lg shadow-md">
                                <strong>AI:</strong> {chat.ai}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <ImageCustomization />
                  )}
                </>
              )}
            </div>
          </div>

          <div className="px-4 pt-2 pb-2">
            {(activeTab === "marketing" || selectedChat) && ( // ✅ Only show input in marketing OR when a customization is opened
              <MessageInput
                activeTab={activeTab}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
