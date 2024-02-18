import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import { useBooks } from "../context/BooksContext";
import Card from "./Card";
import axios from "axios";

function BookCard({ book, onClick }) {
  return <Card title={book.title} onClick={onClick} />;
}

function BooksGrid({ books }) {
  const navigate = useNavigate();
  const handleCardClick = (bookID) => {
    navigate(`/read/${bookID}`);
    console.log("Clicked book ID:", bookID);
  };

  return (
    <div className="books-grid">
      {books.map((book) => (
        <BookCard
          key={book.bookID}
          book={book}
          onClick={() => handleCardClick(book.bookID)}
        />
      ))}
    </div>
  );
}

function SimpleModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={stopPropagation}>
        <FileUpload onClose={onClose} />
      </div>
    </div>
  );
}

function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { books, initBooks } = useBooks();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // useEffect(() => {
  //   const init = async () => {
  //     const response = await axios
  //       .get("http://127.0.0.1:8000/nohpt/books", {
  //         headers: {
  //           Authorization: `Token ${token}`,
  //         },
  //       })
  //       .then((res) => initBooks(res.data));
  //   };
  //   init();
  // });

  return (
    <div className="home">
      <h1>Welcome to the Book Library</h1>
      <button className="open-modal-button" onClick={() => setModalOpen(true)}>
        Upload Book
      </button>
      <BooksGrid books={books} />
      <SimpleModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default Home;
