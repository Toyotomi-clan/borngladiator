import {Box, Center, Flex, Image, Text, VStack} from "@chakra-ui/react";

export function GenericError(props: {resetErrorBoundary: () => void}) {

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>

      <Box role={"alert"} boxSize='lg'>
        <Image src={"../assets/Images/server_down.svg"} alt='error'/>

        <Center mt={"20px"}>
          <VStack>
            <Text>This is a little embarrassing.. </Text>
            <Text borderBottom={"green"}  onClick={props.resetErrorBoundary}>Try again</Text>
          </VStack>
        </Center>
      </Box>
    </Flex>
  )
}
