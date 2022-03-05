import {Box,Button, Center, Flex, Image, Text, VStack} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import {ArrowForwardIcon} from "@chakra-ui/icons";

export function AlreadyLoggedInPage(props: {message: string, resetErrorBoundary: () => void }) {

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>

      <Box role={"alert"} boxSize='lg'>
        <Image src={"../assets/Images/server_down.svg"} alt='error'/>

        <Center mt={"20px"}>
          <VStack>

            <Text>{props.message}</Text>
            <Link to={"/"}>
            <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant='link' onClick={() =>{
              props.resetErrorBoundary();
            }}>Home</Button>
            </Link>
          </VStack>
        </Center>
      </Box>
    </Flex>
  )

}
