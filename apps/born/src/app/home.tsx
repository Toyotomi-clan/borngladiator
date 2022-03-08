import {
  Flex,
  Spinner, useToast,
} from "@chakra-ui/react";
import {useCurrentUser} from "./Api/Api";
import {useNavigate} from "react-router-dom";
import {queryCache, queryClient} from "./QueryClient";
import {JsonError, Session} from "@ory/client";
import {Query} from "react-query";


export default function Home(){
  const {data,error, isFetching } = useCurrentUser();
  const navigator = useNavigate();
  const toast = useToast()

  if(data === null || data === undefined){
    navigator("/login");
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
      {isFetching &&   <Spinner size='xl' />}

      {error &&  toast({
        title: 'Login',
        description: "Thank you for wanting to try death clock, do please sign in ",
        status: 'error',
        duration: 9000,
        isClosable: false,
      })}
      {!isFetching && !error &&
      <h1>Hello world</h1>}
    </Flex>
  )
}
