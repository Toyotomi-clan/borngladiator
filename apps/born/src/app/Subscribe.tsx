import {useNavigate, useSearchParams} from "react-router-dom";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Select,
  Spinner,
  Stack,
  Text, toast, useToast,
  VStack
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useMutationNewUser} from "./Api/SubscribeEndpoint";
import {errorIsValid} from "./helper/EmptyObjectHelper";
import {Controller, useForm} from "react-hook-form";
import {NewUserModel, SubscribeModel} from "./models/newUserModel";
import {queryClient} from "./QueryClient";

export  function Subscribe() {
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [subscribeId,setSubscribeId] = useState(String);
  const [subscribe,setSubscribe] = useState(Boolean);
  const {control,handleSubmit, setError,register, formState: {errors},setValue}  = useForm<SubscribeModel>();
  const mutation = useMutationNewUser(setError)
  const toast = useToast();
  const navigate = useNavigate();
  const [isError,setIsError] = useState(false);

  useEffect(() => {

    const searchParamSubscribeId : string = searchParams.get("subscribeId");
    const searchParamSubscribe : boolean = JSON.parse(searchParams.get("subscribe"));

    if(searchParamSubscribeId && !searchParamSubscribe){
      setSubscribeId(searchParamSubscribeId)
      setSubscribe(false)
    }

    if (searchParamSubscribeId && searchParamSubscribe){
      setSubscribeId(searchParamSubscribeId)
      setSubscribe(searchParamSubscribe)
    }

   if(subscribeId){
     const title = subscribe ? "subscribed" : "unsubscribed";
     mutation.mutate({
       subscribe: subscribe,
       unsubscribeId: subscribeId
     },
       {
         onSuccess: async () => {
           await queryClient.invalidateQueries('deathClockUser')

           setIsError(false)
           toast({
             status: "success",
             title: `You have been ${title}`,
             description: "We have updated your subscribe status"
           })
           navigate("/")
         },
         onError: () => {
           setIsError(true);
           toast({
             status: "error",
             title: "sorry about this",
             description: "double check your subscribe link"
           })
         }
       })
   }

  },[subscribeId,subscribe])


  return (<>
    <Flex
      marginTop={"10%"}
      align={'center'}
      justify={'center'}
      direction={"column"}
    >
          <Stack align={'center'} mb={"40px"}>
            <Heading>Subscribe Page</Heading>
          </Stack>
          <VStack  boxShadow={'lg'} bg={'gray.30'}
                   rounded={'xl'}  paddingTop={12} spacing={0}  w={{ base: "full",lg: "2xl",md: "lg"}} h={"full"}>

            <form>
              <VStack spacing={8} >
                {isError && <Text fontWeight={"bold"} color={"red.600"}>Invalid unsubscribe url</Text>}
                {!isError && <Text fontWeight={"bold"}>Thank you, you are now unsubscribed</Text>}
              </VStack>

            </form>

          </VStack>
    </Flex>


  </>);
}
