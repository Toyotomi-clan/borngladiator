import {Box,Button, Center, Flex, Image, Text, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {ArrowForwardIcon} from "@chakra-ui/icons";
import {useEffect, useState} from "react";

export function AlreadyLoggedInPage(props: {message: string, resetErrorBoundary: () => void }) {
  const [move,setNavigate] = useState(false);
  const navigator = useNavigate();

  useEffect(()=>{
    if(move){
      props.resetErrorBoundary();
      navigator("/");
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

            <Text>You are already logged in</Text>
            <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant='link' onClick={() =>{
              setNavigate(x => !x);
            }}>Home</Button>
          </VStack>
        </Center>
      </Box>
    </Flex>
  )

}
