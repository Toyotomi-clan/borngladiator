import {Container, Flex, Grid, useColorModeValue} from "@chakra-ui/react";
import Nav from "./navbar";
import {ErrorBoundary} from "react-error-boundary";
import {useQueryErrorResetBoundary} from "react-query";
import {errorHandler} from "./errorHandler";
import {GlobalErrorPageHandler} from "./GlobalErrorPageHandler";
import {Footer} from "./footer";

export function Layout({children}) {
  return (
    <Grid bg={useColorModeValue('whiteAlpha.50', 'gray.900')}>
      <Nav/>
      {children}
      <Footer />
    </Grid>

);
}
export function App(props: {children}){
  const {reset} = useQueryErrorResetBoundary();
  return (
    <Grid width={"100vw"} height={"100vh"}>
      <ErrorBoundary onError={errorHandler} fallbackRender={GlobalErrorPageHandler} onReset={reset}>
        <Nav/>
        {props.children}
        <Footer />
      </ErrorBoundary>
    </Grid>)
}


export default App;
