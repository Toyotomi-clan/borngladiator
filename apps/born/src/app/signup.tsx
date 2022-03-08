import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast, FormErrorMessage, Spinner,
} from '@chakra-ui/react';
  import { useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {useForm} from "react-hook-form";
import {findCsrfToken} from "./helper/oryHelper";
import {registerFormModel} from "./models/registerFormModel";
import {errorIsValid} from "./helper/EmptyObjectHelper";
import {Link as ReactRouterLink, useNavigate} from "react-router-dom";
import {useMutationSignUp, useStartLoginFlow, useStartSignUpFlow} from "./Api/Api";
import {SubmitSelfServiceRegistrationFlowBody} from "@ory/client";
import {LoadingComponent} from "./loadingComponent";


export default function SignupCard() {
  const {register, handleSubmit, setError, formState} = useForm<registerFormModel>();

  //Todo: if data is empty / error redirect user to error boundary
  const {data} = useStartSignUpFlow();

  const mutation = useMutationSignUp(setError);
  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();

  const navigate = useNavigate();
  const {errors} = formState;


    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}>


        <form onSubmit={handleSubmit((form: registerFormModel) => {
          //Todo handle error on empty data that can happen
          const csrfToken = findCsrfToken(data.data.ui);

          const submitRegistration: SubmitSelfServiceRegistrationFlowBody = {
            password: form.password,
            method: "password",
            traits: {
              username: form.traits.username,
              email: form.traits.email
            },
            csrf_token: csrfToken
          }
          mutation.mutate({
            flow: data.data,
            model: submitRegistration
          }, {
            onSuccess: () => {
              navigate("/")
              toast({
                title: "Welcome to death watch",
                description: "Every day matters"
              })
            },
            onError: () => {
              toast({
                title: "Error with sign up :(",
                description: "please check the validation errors",
                status: "error"
              });
            }
          });

        })}>
          <Stack spacing={8} mx={'auto'} minW={'xl'} py={12} px={6} maxW={"xl"}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'} textAlign={'center'}>
                Sign up
              </Heading>

              <Text>
                "Death may be the greatest of all human blessings" - Socrates

              </Text>
            </Stack>

            <Box
              rounded={'lg'}
              boxShadow={'lg'}
              p={8}
              bg={useColorModeValue('white', 'gray.700')}
            >
              <Stack spacing={4}>
                <FormControl id="userName" isRequired isInvalid={errorIsValid(errors, errors.traits?.username)}>
                  <FormLabel>User Name</FormLabel>
                  <Input  {...register("traits.username",{
                    required: "username is required",
                    minLength:{
                      value: 5,
                      message: "username must have 5 or more characters"
                    }
                  })} />
                  <FormErrorMessage>{errors.traits?.username?.message}</FormErrorMessage>
                </FormControl>
                <FormControl id="email" isRequired isInvalid={errorIsValid(errors, errors.traits?.email)}>
                  <FormLabel>Email address</FormLabel>
                  <Input placeholder={"Socrates@gmail.com"} {...register("traits.email",
                    {required: "email is required",
                            pattern: {
                                  value:  /\S+@\S+\.\S+/,
                                  message: "please add a valid email i.e. [me]@gmail.com"
                            }})}/>
                  <FormErrorMessage>{errors.traits?.email?.message}</FormErrorMessage>
                </FormControl>
                <FormControl id="password" isRequired isInvalid={errorIsValid(errors, errors.password)}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input type={showPassword ? 'text' : 'password'} {...register("password",{
                      required: "password is required",
                      minLength: {
                        value: 8,
                        message: "password length must be 8 or more"
                      }
                    })}/>
                    <InputRightElement h={'full'}>
                      <Button
                        variant={'ghost'}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }>
                        {showPassword ? <ViewIcon/> : <ViewOffIcon/>}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors["password"]?.message}</FormErrorMessage>
                </FormControl>
                //Todo:
                <FormControl isInvalid={errorIsValid(errors, errors.general)}>
                  <Text {...register("general", {required: false})}/>

                  <FormErrorMessage>{errors.general?.message}</FormErrorMessage>
                </FormControl>
                <Stack spacing={10} pt={2}>
                  <Button
                    type={"submit"}
                    loadingText="Submitting"
                    size="lg"
                    bg={'blue.400'}
                    _hover={{
                      bg: 'blue.500',
                    }}>
                    Sign up
                  </Button>
                </Stack>
                <Stack pt={6}>
                  <Text align={'center'}>
                    <ReactRouterLink to={"/login"}>Already a user? Login </ReactRouterLink>
                  </Text>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </form>
      </Flex>
    );
}
