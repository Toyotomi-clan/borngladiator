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
import {useNavigate} from "react-router-dom";

export function GenericError(props: {resetErrorBoundary: () => void, code: number}) {

  const navigate = useNavigate();
  const toLoginAndClearError = function(){
    navigate("/login");
    props.resetErrorBoundary();
  }
  return (
      <Flex
      align={'center'}
      justify={'center'}
      flexDirection={"column"}>

      <Box role={"alert"} boxSize='lg'>
        <Image src={"../assets/Images/server_down.svg"} alt='error'/>
        <Center>
          <HStack>
            <Heading as='h2' size='xl'>
              {props.code || "sorry"}
            </Heading>

          </HStack>
        </Center>
        <Divider width={"lg"} border={"2px"}/>
        <VStack>
          <Text>This is a little bit embarrassing.. </Text>
          <Button color={"green"} borderBottom={"green"}  onClick={props.resetErrorBoundary}>Try again</Button>
        </VStack>

        <VStack>
          <Text onClick={toLoginAndClearError}>Login</Text>

        </VStack>
      </Box>
    </Flex>
  )
}
