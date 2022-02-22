import {Box, Button, Center, Flex, Image, Text, VStack} from "@chakra-ui/react";
import {Link} from "react-router-dom"

export default function Error500()
{
  return (
  <Flex
    minH={'100vh'}
    align={'center'}
    justify={'center'}>

    <Box boxSize='lg'>
      <Image src={"../assets/Images/server_down.svg"} alt='Server error' />


      <Center mt={"20px"}>
        <VStack>
          <Text>This is a little embarrassing.. </Text>
          //Todo: check if user is logged in if so direct them to the main page
          <Text borderBottom={"2px"}><Link to={"/login"}>Lets try again  </Link></Text>
        </VStack>

      </Center>
    </Box>
  </Flex>
  );
}
