import * as ReactDOM from 'react-dom';
import { BrowserRouter, Routes,Route } from 'react-router-dom';

import App from './app/app';
import SignupCard from "./app/signup";
import {ChakraProvider} from "@chakra-ui/react";
import Login from "./app/login";
import Error500 from "./app/500Error";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient();

ReactDOM.render(
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
          <BrowserRouter>
                <Routes>
                  <Route path="/" element={<App children={<Login/>}/>}/>
                  <Route path="/register" element={<App children={<SignupCard/>}/>}/>
                  <Route path="/login" element={<App children={<Login/>}/>}/>
                  <Route path="/error" element={<App children={<Error500/>}/>}/>
                </Routes>
        </BrowserRouter>
      </QueryClientProvider>
  </ChakraProvider>,
document.getElementById('root')
);
