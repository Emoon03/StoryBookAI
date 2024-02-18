// In src/components/LoadingIndicator.js
import { Spinner, Center } from '@chakra-ui/react';

const LoadingIndicator = () => (
  <Center h="100vh">
    <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
  </Center>
);

export default LoadingIndicator;
