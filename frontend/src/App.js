import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./components/Home";
import Login from "./components/login";
import Registration from "./components/Register";
import FileUpload from "./components/FileUpload";
import Navbar from "./components/Navbar";
import CarouselScreen from "./components/CarouselScreen";
import { BooksProvider } from "./context/BooksContext";

import LoadingIndicator from "./components/Loading"; // Import your loading component

function App() {
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  // Example function to toggle loading state
  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  return (
    <ChakraProvider>
      <Router>
        <BooksProvider>
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/read/:bookID" element={<CarouselScreen />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/books" element={<Home />} />
              <Route path="/create" element={<FileUpload />} />
              <Route path="/*" element={<Home />} />
            </Routes>
          </>
        </BooksProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
