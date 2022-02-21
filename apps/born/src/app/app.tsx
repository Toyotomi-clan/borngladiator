import {ChakraProvider, Container, Flex, useColorModeValue} from "@chakra-ui/react";
import SignupCard from "./signup";
import Nav from "./navbar";
import Login from "./login";


export function App({children}) {
  return (
    <>
      <Container minW={"100vw"} bg={useColorModeValue('gray.100', 'gray.900')}>
        <Nav/>
        {children}
      </Container>
    </>
  );
}

export default App;
