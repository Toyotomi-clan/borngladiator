import {Container, Flex, Grid, useColorModeValue} from "@chakra-ui/react";
import Nav from "./navbar";
import {ErrorBoundary} from "react-error-boundary";
import {useQueryErrorResetBoundary} from "react-query";
import {errorHandler} from "./errorHandler";
import {GlobalErrorPageHandler} from "./GlobalErrorPageHandler";

export function Layout({children}) {
  return (
    <Grid bg={useColorModeValue('whiteAlpha.50', 'gray.900')}>
      <Nav/>
      {children}
  </Grid>

);
}
export function App(props: {children}){
  const {reset} = useQueryErrorResetBoundary();
  return (
    <Grid minH={"100vh"}>
      <ErrorBoundary onError={errorHandler} fallbackRender={GlobalErrorPageHandler} onReset={reset}>
        <Nav/>
        {props.children}
      </ErrorBoundary>
    </Grid>)
}

export default App;
