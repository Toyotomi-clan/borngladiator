import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box, Button,
  Center, CloseButton,
  Divider,
  Flex, Heading, HStack,
  Image, Stack,
  Text,
  VStack
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCurrentUser} from "./Api/Api";

export function GenericError(props: {resetErrorBoundary: () => void, code: number}) {
  const [move,setNavigate] = useState(false);
  const navigator = useNavigate();
  const {error} = useCurrentUser();

  useEffect(()=>{
    if(move && error){
      props.resetErrorBoundary();
      navigator("/login");
    }
    if(move && !error){
      props.resetErrorBoundary();
    }
  },[move])
  return (
      <Flex
        align={'center'}
        justify={'center'}>

        <Box role={"alert"} boxSize='xs'>
          <Image src={"../assets/Images/server_down.svg"} alt='error'/>

          <Center mt={"20px"}>
            <VStack>
              {!error && <Text>{props.code && "|"} This is a little bit embarrassing..</Text>}
              {!error && <Button colorScheme='teal' variant='link'  onClick={() => {setNavigate(x => !x)}}>Try again</Button>}
              {error && <Text>{props.code && "|"} You need to be authorized</Text>}
              {error && <Button colorScheme='teal' variant='link'  onClick={() => {setNavigate(x => !x)}}>Login</Button>}
            </VStack>
          </Center>
        </Box>
    </Flex>


  )
}
