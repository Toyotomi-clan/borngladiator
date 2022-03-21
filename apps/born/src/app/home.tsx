import {
  Flex,
  Spinner, useToast,
} from "@chakra-ui/react";
import {useCurrentUser} from "./Api/Api";
import {useNavigate} from "react-router-dom";


export default function Home(){
  const {data,error, isFetching } = useCurrentUser();
  const navigator = useNavigate();
  const toast = useToast()

  if(data === null || data === undefined){
    navigator("/login");
  }

  return (
    <Flex
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
