import {Box,Button, Center, Flex, Image, Text, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {ArrowForwardIcon} from "@chakra-ui/icons";
import {useEffect, useState} from "react";

export function NotAuthorized(props: {message: string, resetErrorBoundary: () => void }) {
    const [move,setNavigate] = useState(false);
    const navigator = useNavigate();

    useEffect(()=>{
      if(move){
        props.resetErrorBoundary();
        navigator("/login");
      }
    },[move])

        return (
            <Flex
                align={'center'}
                justify={'center'}>

                <Box role={"alert"} boxSize='xs'>
                    <Image src={"../assets/Images/server_down.svg"} alt='error'/>
                        <VStack>

                          <Text>{props.message}</Text>
                            <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant='link' onClick={() =>{
                              setNavigate(x => !x);
                            }}>Login</Button>
                        </VStack>
                </Box>
            </Flex>
        )

}
