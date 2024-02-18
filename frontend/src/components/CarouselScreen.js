import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Carousel from "./Carousel";
import { Box, Text } from "@chakra-ui/react";
import axios from "axios";

function CarouselScreen() {
  const [items, setItems] = useState([]);
  let { bookID } = useParams();
  console.log("here");

  useEffect(() => {
    if (bookID) {
      const init = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/nohpt/books/${bookID}/sections`
          );
          console.log(response.data);
          const sectionsData = response.data.map((section) => ({
            imageUrl: section.image_path, // Adjust according to your API response
            audioBase64: section.audio_path, // Adjust according to your API response
            musicBase64: section.music_path, // Adjust according to your API response
          }));
          setItems(sectionsData);
        } catch (error) {
          console.error("Error fetching sections:", error);
        }
      };
      init();
    }
  }, [bookID]); // Include bookId in the dependency array

  // This useEffect will log items every time it changes

  // Placeholder text, replace or remove as needed
  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="2xl" mb="4">
        Book Sections
      </Text>
      <Carousel items={items} />
    </Box>
  );
}

export default CarouselScreen;
