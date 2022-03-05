import {Box,Button, Center, Flex, Image, Text, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {ArrowForwardIcon} from "@chakra-ui/icons";

export function NotAuthorized(props: {message: string, resetErrorBoundary: () => void }) {
    const navigator = useNavigate();

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
                            <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant='link' onClick={() =>{
                              props.resetErrorBoundary();
                              navigator("/login")

                            }}>Login</Button>
                        </VStack>
                    </Center>
                </Box>
            </Flex>
        )

}
