// import React, { createContext, useContext, useState } from "react";

// const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [userId, setUserId] = useState(null);
//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [marketingContent, setMarketingContent] = useState([]);
//   const [chatHistory, setChatHistory] = useState([]);

//   const addNewImage = (imageURL, content, id) => {
//     setUploadedImages((prevImages) => [...prevImages, imageURL]);
//     setMarketingContent((prevContent) => [...prevContent, content]);
//     setUserId(id);
//   };

//   const addChatResponse = (userMessage, aiResponse) => {
//     setChatHistory((prevChat) => [
//       ...prevChat,
//       { user: userMessage, ai: aiResponse },
//     ]);
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         uploadedImages,
//         marketingContent,
//         userId,
//         addNewImage,
//         chatHistory,
//         addChatResponse,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useAppContext = () => useContext(AppContext);

import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [marketingContent, setMarketingContent] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [customizedImages, setCustomizedImages] = useState([]);

  const addNewImage = (imageURL, content, id) => {
    setUploadedImages((prevImages) => [...prevImages, imageURL]);
    setMarketingContent((prevContent) => [...prevContent, content]);
    setUserId(id);
  };

  const addChatResponse = (userMessage, aiResponse) => {
    setChatHistory((prevChat) => [
      ...prevChat,
      { user: userMessage, ai: aiResponse },
    ]);
  };

  const addCustomizedImage = (base64Image) => {
    setCustomizedImages((prevImages) => [...prevImages, base64Image]);
  };

  return (
    <AppContext.Provider
      value={{
        uploadedImages,
        marketingContent,
        userId,
        addNewImage,
        chatHistory,
        addChatResponse,
        customizedImages,
        addCustomizedImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
