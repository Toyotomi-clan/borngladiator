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
  useColorModeValue, FormErrorMessage, toast, useToast, Center, Divider,
} from '@chakra-ui/react';

import {Link as ReactRouterLink, useNavigate} from "react-router-dom";

import {useStartLoginFlow, useMutateLogin} from "./Api/Api";
import {useForm} from "react-hook-form";
import {SubmitSelfServiceLoginFlowBody} from "@ory/client/dist/api";
import {findCsrfToken} from "./helper/oryHelper";
import {errorIsValid} from "./helper/EmptyObjectHelper";
import {LoginFormModel} from "./models/loginModels";
import {useEffect, useState} from "react";

export default function Login() {

  const {handleSubmit, setError,register, formState: {errors}}  = useForm<LoginFormModel>();


  //Todo: if data is empty / error redirect user to error boundary
  const {data} = useStartLoginFlow();

  const mutation  = useMutateLogin(setError);
  const navigate = useNavigate();
  const toast = useToast();

  const [userIsLoggedIn,setUserLoggedIn] = useState(false);

  useEffect(() =>{
    if(userIsLoggedIn) {
      navigate("/")
    }
  },[userIsLoggedIn])

  return (
    <Flex
      align={'center'}
      justify={'center'}>
      <form onSubmit={handleSubmit((form) =>{
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
              toast({
                status: "success",
                title: "Welcome back death clock",
                description: "remember you will die."
              })
              setUserLoggedIn(x => !x)

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
        <Stack spacing={8} mx={'auto'} minW={'sm'} py={12} px={6} maxW={"lg"}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}  textAlign={'center'}>Sign in to your account</Heading>
          <Text>
            I cannot escape death, but at least I can escape the fear of it — Epictetus
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>

            <FormControl id="username" isRequired isInvalid={errorIsValid(errors,errors.email)}>
              <FormLabel>Email address</FormLabel>
              <Input type="email" {...register("email",{
                required: "email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "please add a valid email i.e. [me]@gmail.com"
                }
              })}/>
              <FormErrorMessage>{errors["email"]?.message}</FormErrorMessage>
            </FormControl>

            <FormControl id="password" isRequired isInvalid={errorIsValid(errors,errors.password)}>
              <FormLabel>Password</FormLabel>
              <Input type="password" {...register("password", {
                required: "password is required",
                minLength: {
                  value: 8,
                  message: "password length must be 8 or more"
                }
              })}/>
              <FormErrorMessage>{errors["password"]?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errorIsValid(errors,errors.general)}>
              <Text {...register("general",{required: false})}/>
              <FormErrorMessage>{errors.general?.message}</FormErrorMessage>
            </FormControl>
            <Stack spacing={5}  pt={2}  align='center'>
              <Button
                type={"submit"}
                colorScheme='gray' variant='ghost'
                size={"md"}
                 >
                Sign in
              </Button>
              <Divider orientation={"horizontal"} h={"5px"}/>

              <Stack>
                <Center>
                  <ReactRouterLink to={"/register"}><Button  colorScheme='teal' variant='link' >Create account</Button> </ReactRouterLink>
                </Center>
              </Stack>
              <Stack>
                <Center>
                  {/*Todo: add recover logic*/}
                  <ReactRouterLink to={"/forgot"}><Button  colorScheme='teal' variant='link' >Forgot account</Button> </ReactRouterLink>
                </Center>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      </form>
    </Flex>
  );
}
