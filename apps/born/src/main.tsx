import * as ReactDOM from 'react-dom';
import { BrowserRouter, Routes,Route } from 'react-router-dom';

import App from './app/app';
import SignupCard from "./app/signup";
import {ChakraProvider, Container, useColorModeValue} from "@chakra-ui/react";
import Nav from "./app/navbar";
import Login from "./app/login";
import Error500 from "./app/500Error";




ReactDOM.render(
<ChakraProvider>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<App children={<Login/>}/>}/>
          <Route path="/register" element={<App children={<SignupCard/>}/>}/>
          <Route path="/login" element={<App children={<Login/>}/>}/>
          <Route path="/error" element={<App children={<Error500/>}/>}/>
        </Routes>
      </BrowserRouter>
</ChakraProvider>
,
  document.getElementById('root')
);
