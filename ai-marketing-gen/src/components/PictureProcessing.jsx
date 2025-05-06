import React, { useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const PictureProcessing = () => {
  const { addNewImage } = useAppContext();
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/upload_image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Upload response:", response.data);

      if (response.data && response.data.user_id) {
        addNewImage(
          previewURL,
          response.data.marketing_content,
          response.data.user_id
        );
      } else {
        alert("Error: No user_id returned.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Upload failed! Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-xl p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        className="flex items-center gap-2 text-white text-lg font-medium cursor-pointer hover:opacity-80"
      >
        <span>Upload an Image</span>
        <BsFillPlusCircleFill className="text-blue-500 hover:text-blue-400 text-3xl transform hover:scale-110 transition-all duration-200" />
      </label>
      {previewURL && (
        <img
          src={previewURL}
          alt="Preview"
          className="w-48 h-48 mt-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
        />
      )}
      {image && (
        <button
          onClick={handleUpload}
          className="mt-4 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-xl shadow"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      )}
    </div>
  );
};

export default PictureProcessing;
