import React, { useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { FaDownload } from "react-icons/fa";

const ImageCustomization = () => {
  const { addCustomizedImage } = useAppContext();
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [customizedImages, setCustomizedImages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [customizationId, setCustomizationId] = useState(null); // NEW

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleCustomize = async () => {
    if (!image || !prompt.trim()) {
      alert("Please upload an image and enter a customization prompt.");
      return;
    }

    setLoading(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = async () => {
        const base64Image = reader.result.split(",")[1];

        // 1️⃣ Step 1 → Call Colab Customize API
        const response = await axios.post(
          "https://bond-basket-growing-humor.trycloudflare.com/customize",
          { image: base64Image, prompt: prompt },
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("Customization Response:", response.data);

        if (response.data.success) {
          const customizedImage = `data:image/png;base64,${response.data.modified_image}`;
          addCustomizedImage(customizedImage, prompt);
          setCustomizedImages((prev) => [...prev, customizedImage]);

          // 2️⃣ Step 2 → Call Save Customization API
          const saveResponse = await axios.post(
            "http://127.0.0.1:5000/api/save_customization",
            {
              customization_id: customizationId, // null on first save; backend will create it
              original_image_base64: base64Image, // send only on first save
              image_base64: response.data.modified_image,
              prompt: prompt,
            }
          );

          if (saveResponse.data.success) {
            console.log("Saved customization:", saveResponse.data);
            setCustomizationId(saveResponse.data.customization_id); // update local id
          } else {
            console.warn("Save customization failed:", saveResponse.data);
          }
        } else {
          alert(
            `Error: Image customization failed. Server Response: ${JSON.stringify(
              response.data
            )}`
          );
        }
      };
    } catch (error) {
      console.error("Customization failed:", error);
      alert(`Failed to customize the image. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 text-white">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">
        Image Customization
      </h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        className="flex items-center gap-2 text-lg font-medium cursor-pointer hover:opacity-80 mb-2"
      >
        <span>Upload an Image</span>
        <BsFillPlusCircleFill className="text-blue-500 hover:text-blue-400 text-3xl" />
      </label>

      {previewURL && (
        <img
          src={previewURL}
          className="w-48 h-48 mt-2 rounded-lg shadow-md"
          alt="Preview"
        />
      )}

      <input
        type="text"
        className="mt-4 p-3 bg-[#40414F] border border-gray-600 rounded-lg w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter customization prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleCustomize}
        className="mt-4 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg shadow"
        disabled={loading}
      >
        {loading ? "Generating..." : "Customize"}
      </button>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {customizedImages.map((img, index) => (
          <div
            key={index}
            className="bg-[#343541] p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <img
              src={img}
              alt={`Customized ${index}`}
              className="w-48 h-48 rounded-lg shadow-md"
            />
            <a
              href={img}
              download={`customized_image_${index + 1}.png`}
              className="mt-3 flex items-center gap-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
            >
              <FaDownload />
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCustomization;
