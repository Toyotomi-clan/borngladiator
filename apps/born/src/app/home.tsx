import {
  Flex,
  Spinner, useToast,
} from "@chakra-ui/react";
import {useCurrentUser} from "./Api/Api";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";


export default function Home(){
  const {data,error, isFetching } = useCurrentUser();
  const navigator = useNavigate();
  const toast = useToast()

  useEffect(() =>{
    if(!data  && !isFetching){
      navigator("/login");
    }
  },[error])


  return (
    <Flex
      align={'center'}
      justify={'center'}>
      {isFetching &&   <Spinner size='xl' />}
      {data && !isFetching &&
      <h1>Hello world</h1>}
    </Flex>
  )
}
