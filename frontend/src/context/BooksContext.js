// BooksContext.js
import React, { createContext, useContext, useState } from "react";

const BooksContext = createContext();

export function useBooks() {
  return useContext(BooksContext);
}

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  const addBook = (book) => {
    setBooks((prevBooks) => [...prevBooks, book]);
  };

  const initBooks = (books) => {
    setBooks(
      books.map((book) => ({
        bookID: book.book_id,
        title: book.title,
      }))
    );
  };

  return (
    <BooksContext.Provider value={{ books, addBook, initBooks }}>
      {children}
    </BooksContext.Provider>
  );
};
