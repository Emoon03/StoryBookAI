import React, { useEffect, useState } from "react";
import "./FileUpload.css"; // Importing CSS for styling, make sure to create or adjust this
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useBooks } from "../context/BooksContext";
const FileUpload = ({ onClose }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { addBook } = useBooks();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    console.log("here");
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("text_file", selectedFile);
    formData.append("title", "Harry Potter");
    await axios
      .post("http://127.0.0.1:8000/nohpt/upload_book/", formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        console.log("File uploaded successfully", response.data);
        let data = {
          bookID: response.data.book_id,
          title: title,
        };

        addBook(data);
        setTitle(""); // Reset the title state
        setSelectedFile(null); // Reset the selected file
        setIsLoading(false);
        onClose();
        // Handle response
      })
      .catch((error) => {
        console.error("Error uploading file", error);
        // Handle error
      });
    // Implement the file upload logic here (e.g., sending the file to a server)
  };

  return (
    <form onSubmit={handleFileUpload} className="upload-form">
      <div className="input-group">
        <label htmlFor="title">Book Title</label>
        <input
          type="text"
          id="title"
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isLoading} // Disable input when loading
        />
      </div>
      <div className="input-group">
        <input
          type="file"
          onChange={handleFileChange}
          required
          disabled={isLoading}
        />
      </div>
      <button type="submit" className="upload-button" disabled={isLoading}>
        {isLoading ? "Uploading..." : "Upload"}{" "}
        {/* Change button text based on loading state */}
      </button>
    </form>
  );
};

export default FileUpload;
