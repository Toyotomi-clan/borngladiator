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
  useToast, FormErrorMessage, Center, Divider,
} from '@chakra-ui/react';
import {useState} from 'react';
import {ArrowForwardIcon, ViewIcon, ViewOffIcon} from '@chakra-ui/icons';
import {useForm} from "react-hook-form";
import {findCsrfToken} from "./helper/oryHelper";
import {registerFormModel} from "./models/registerFormModel";
import {errorIsValid} from "./helper/EmptyObjectHelper";
import {Link as ReactRouterLink, useNavigate} from "react-router-dom";
import {useMutationSignUp, useStartSignUpFlow} from "./Api/Api";
import {SubmitSelfServiceRegistrationFlowBody} from "@ory/client";
import {queryClient} from "./QueryClient";


export default function SignupCard() {
  const {register, handleSubmit, setError, formState} = useForm<registerFormModel>();

  const {data} = useStartSignUpFlow();

  const {mutate} = useMutationSignUp(setError);
  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();

  const navigate = useNavigate();
  const {errors} = formState;

  return (
    <Flex
      align={'center'}
      justify={'center'}>

      <form onSubmit={handleSubmit((form: registerFormModel) => {
        const csrfToken = findCsrfToken(data.data.ui);

        const submitRegistration: SubmitSelfServiceRegistrationFlowBody = {
          password: form.password,
          method: "password",
          csrf_token: csrfToken,
          traits: {
            username: form.traits.username,
            email: form.traits.email
          },
        }
        mutate({
          flow: data.data,
          model: submitRegistration
        }, {
          onSuccess: async () => {
            navigate("/new")
            await queryClient.invalidateQueries("deathClockUser")
            await queryClient.invalidateQueries("user")

            toast({
              status: "success",
              title: "Welcome to Stoictemple",
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
        <Stack spacing={8} mx={'auto'} minW={'sm'} py={12} px={6} maxW={"lg"}>
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
            bg={useColorModeValue('whiteAlpha.50', 'dark.900')}
          >
            <Stack spacing={4}>

              <FormControl id="userUniqueName" isRequired isInvalid={errorIsValid(errors, errors.traits?.username)}>
                <FormLabel>User Name</FormLabel>
                <Input  {...register("traits.username", {
                  required: "username is required",
                  minLength: {
                    value: 5,
                    message: "username must have 5 or more characters"
                  }
                })} />
                <FormErrorMessage>{errors.traits?.username?.message}</FormErrorMessage>
              </FormControl>

              <FormControl id="userName" isRequired isInvalid={errorIsValid(errors, errors.traits?.email)}>
                <FormLabel>Email address</FormLabel>
                <Input placeholder={"Socrates@gmail.com"} {...register("traits.email",
                  {
                    required: "email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "please add a valid email i.e. [me]@gmail.com"
                    }
                  })}/>
                <FormErrorMessage>{errors.traits?.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl id="password" isRequired isInvalid={errorIsValid(errors, errors.password)}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input autoComplete={"password"} type={showPassword ? 'text' : 'password'} {...register("password", {
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

              <FormControl isInvalid={errorIsValid(errors, errors.general)}>
                <Text {...register("general", {required: false})}/>

                <FormErrorMessage>{errors.general?.message}</FormErrorMessage>
              </FormControl>
              <Stack spacing={5} pt={2} align='center'>
                <Button
                  type={"submit"}
                  colorScheme='gray' variant='ghost'>
                  Sign up
                </Button>
              </Stack>
              <Divider orientation={"horizontal"} h={"5px"}/>

              <Stack pt={6}>
                <Center>
                  <ReactRouterLink to={"/login"}><Button  colorScheme='teal' variant='link' >Login</Button> </ReactRouterLink>
                </Center>

              </Stack>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Flex>
  );
}
