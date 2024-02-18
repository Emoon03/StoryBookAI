import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Button, Flex, Image, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const narrationAudioRef = useRef(new Audio());
  const backgroundAudioRef = useRef(new Audio());

  useEffect(() => {
    // Start playing the background music of the first item if user has interacted
    if (isUserInteracted && items.length > 0) {
      playBackgroundMusic(currentIndex);
    }

    // Cleanup function to pause music when component unmounts or before new music starts
    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
      if (narrationAudioRef.current) {
        narrationAudioRef.current.pause();
      }
    };
  }, [currentIndex, items, isUserInteracted]);

  const playBackgroundMusic = useCallback(
    (index) => {
      const musicBase64 = items[index]?.musicBase64;
      if (musicBase64) {
        backgroundAudioRef.current.src = `data:audio/mp3;base64,${musicBase64}`;
        backgroundAudioRef.current.volume = 0.3; // Lower volume for background music
        backgroundAudioRef.current.loop = true; // Loop the background music
        backgroundAudioRef.current
          .play()
          .catch((error) =>
            console.error("Background audio play error:", error)
          );
      }
    },
    [items]
  );

  const playNarrationAudio = useCallback((audioBase64) => {
    narrationAudioRef.current.src = `data:audio/mp3;base64,${audioBase64}`;
    narrationAudioRef.current
      .play()
      .catch((error) => console.error("Narration audio play error:", error));
  }, []);

  const changeItem = useCallback(
    (direction) => {
      setCurrentIndex((prevIndex) => {
        const newIndex =
          direction === "next"
            ? (prevIndex + 1) % items.length
            : (prevIndex - 1 + items.length) % items.length;
        if (isUserInteracted) {
          playNarrationAudio(items[newIndex]?.audioBase64);
          playBackgroundMusic(newIndex);
        }
        return newIndex;
      });
    },
    [items, isUserInteracted, playNarrationAudio, playBackgroundMusic]
  );

  const startCarousel = () => {
    setIsUserInteracted(true);
    playBackgroundMusic(currentIndex);
  };

  if (!isUserInteracted) {
    return (
      <Box textAlign="center" mt="20">
        <Button onClick={startCarousel} colorScheme="blue">
          Start Carousel
        </Button>
      </Box>
    );
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      position="relative"
      w="full"
    >
      <IconButton
        aria-label="Previous"
        icon={<ChevronLeftIcon />}
        onClick={() => changeItem("prev")}
        position="absolute"
        left={2}
        zIndex={10}
        variant="solid"
        colorScheme="teal"
      />
      <Image
        src={items[currentIndex]?.imageUrl}
        fallbackSrc="https://via.placeholder.com/500"
        boxSize="500px"
        objectFit="cover"
      />
      <IconButton
        aria-label="Next"
        icon={<ChevronRightIcon />}
        onClick={() => changeItem("next")}
        position="absolute"
        right={2}
        zIndex={10}
        variant="solid"
        colorScheme="teal"
      />
    </Flex>
  );
};

export default Carousel;
