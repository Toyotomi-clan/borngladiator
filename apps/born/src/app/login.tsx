import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue, FormErrorMessage, toast, useToast,
} from '@chakra-ui/react';

import {Link as ReactRouterLink, useNavigate} from "react-router-dom";

import {useStartLoginFlow, useMutateLogin} from "./Api/Api";
import {useForm} from "react-hook-form";
import {SubmitSelfServiceLoginFlowBody} from "@ory/client/dist/api";
import {findCsrfToken} from "./helper/oryHelper";
import {errorIsValid} from "./helper/EmptyObjectHelper";
import {LoginFormModel} from "./models/loginModels";

export default function Login() {

  const {handleSubmit, setError,register, formState: {errors}}  = useForm<LoginFormModel>();

  //Todo: if data is empty / error redirect user to error boundary
  const {data} = useStartLoginFlow();

  const mutation  = useMutateLogin(setError);
  const navigate = useNavigate();
  const toast = useToast();


  return (
    <Flex
      minW={"lg"}
      align={'center'}
      justify={'center'}>
      <form onSubmit={handleSubmit((form) =>{
          //Todo handle error on empty data that can happen
          const csrfToken = findCsrfToken(data.data.ui);

          const submitLogin : SubmitSelfServiceLoginFlowBody = {
            password: form.password,
            method: "password",
            password_identifier:form.email,
            csrf_token: csrfToken
          }
          mutation.mutate({
          flow: data.data,
          model:submitLogin
        },{
            onSuccess: () => {
              navigate("/")
              toast({
                status: "success",
                title: "Welcome back death clock",
                description: "remember you will die."
              })
            },
            onError: () => {
              toast({
                status: "error",
                title: "double check please",
                description: "there seems to be some validation errors"
              })
            }
          });
          })}>
        <Stack spacing={8} mx={'auto'} minW={'xl'} py={12} px={6} maxW={"xl"}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email"  isInvalid={errorIsValid(errors,errors.email)}>
              <FormLabel>Email address</FormLabel>
              <Input type="email" {...register("email")}/>
            </FormControl>
            <FormControl id="password"  isInvalid={errorIsValid(errors,errors.password)}>
              <FormLabel>Password</FormLabel>
              <Input type="password" {...register("password")}/>
            </FormControl>

            <FormControl isInvalid={errorIsValid(errors,errors.general)}>
              <Text {...register("general",{required: false})}/>

              <FormErrorMessage>{errors.general?.message}</FormErrorMessage>
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Link color={'blue.400'}>Forgot password?</Link>
              </Stack>
              <Button
                type={"submit"}
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign in
              </Button>
              <Box>
                <ReactRouterLink to={"/register"}>  New? Sign Up!</ReactRouterLink>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      </form>
    </Flex>
  );
}
