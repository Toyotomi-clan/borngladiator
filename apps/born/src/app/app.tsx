import { ChakraProvider } from "@chakra-ui/react";
import SignupCard from "./signup";

export function App() {
  return (
    <>
    <ChakraProvider> 
      <SignupCard />
    </ChakraProvider>
    </>
  );
}

export default App;
