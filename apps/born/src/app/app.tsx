import {Container, useColorModeValue} from "@chakra-ui/react";
import Nav from "./navbar";
import {ErrorBoundary} from "react-error-boundary";
import {useQueryErrorResetBoundary} from "react-query";
import {errorHandler} from "./errorHandler";
import {GlobalErrorPageHandler} from "./GlobalErrorPageHandler";

export function App({children}) {
  const {reset} = useQueryErrorResetBoundary();
  return (
    <Container minW={"100vw"} bg={useColorModeValue('gray.100', 'gray.900')}>
      <Nav/>

    <ErrorBoundary onError={errorHandler} fallbackRender={GlobalErrorPageHandler} onReset={reset}>
        {children}
    </ErrorBoundary>
    </Container>

  );
}

export default App;
