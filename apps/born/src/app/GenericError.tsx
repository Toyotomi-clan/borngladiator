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

export function GenericError(props: {resetErrorBoundary: () => void, code: number}) {

  return (
      <Flex
        align={'center'}
        justify={'center'}>

        <Box role={"alert"} boxSize='xs'>
          <Image src={"../assets/Images/server_down.svg"} alt='error'/>

          <Center mt={"20px"}>
            <VStack>
              <Text>{props.code && "|"} This is a little bit embarrassing..</Text>
              <Button colorScheme='teal' variant='link'  onClick={props.resetErrorBoundary}>Try again</Button>
            </VStack>
          </Center>
        </Box>
    </Flex>


  )
}
