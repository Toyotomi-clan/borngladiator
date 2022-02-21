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
  Divider, useToast, toast,
  FormErrorMessage, Link,
} from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import {Flow, InitFlow, Ui} from "./models/registerRequest"
  import {useForm} from "react-hook-form";
import oryRegisterFormErrorSetter from "./helper/oryHelper";
import {registerFormModel, validateField} from "./models/registerFormModel";
import {errorIsValid} from "./helper/EmptyObjectHelper";
import {Link as ReactRouterLink} from "react-router-dom";


export default function SignupCard() {

    const {register, handleSubmit,setError, formState} = useForm<registerFormModel>();
    const {errors} = formState;
    const [showPassword, setShowPassword] = useState(false);

    const [data,setData] = useState<Flow>(InitFlow);

    const toast = useToast();

    useEffect(() => {
      fetch("/.ory/self-service/registration/browser",{
        headers:{
          accept: "application/json"
        }
      }).then(response => response.json()).then(response => {

        const flow = response as Flow;

        if(data.id == "" && flow !== null){
          setData(() => flow)
        }

      }).catch(x => console.log(x));
    },[data.id])

    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}>


      <form onSubmit={handleSubmit((form: registerFormModel ) => {

          if(!data.ui){
            return;
          }

          const csrfToken = data.ui.nodes.find(x => x.attributes.name === "csrf_token");

          if(!csrfToken.attributes.value || !csrfToken.attributes.name){
            return;
          }

          fetch(data.ui.action,{
              method: "POST",
              headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                method: "password",
                password: form.password,
                [csrfToken.attributes.name]:csrfToken.attributes.value,
                traits: {
                  email: form.traits.email,
                  username: form.traits.username,
                }
              })
            }
          )
            .then(response => {
              if(!response.ok){
                const error = {
                  error:
                    {
                      response: response,
                      code: response.status,
                    }
                }
                throw error;
              }
              return response;
            })
            .then(response => response.json()).then(data =>
            {
              if(data.error){
                throw data;
              }
              if(data.session.active){
                toast({
                  title: 'Account created.',
                  description: "Welcome to death clock",
                  status: 'success',
                  duration: 9000,
                  isClosable: true,
                })
              }
            }
          )
            //Todo: extract this to a method and pass in a type
            .catch(async x => {
              if(x.error?.code === 410){
                setData(() => InitFlow);
              }
              if(x.error?.code === 400) {
                const response = await x.error.response.json();

                if (response.error) {
                  console.log({"errorBeforeJson": x.error, response: response})

                  if(response.error.id === "session_already_available"){
                    //redirect the user
                    setError("oryValidationGeneral", {
                      message: "You already logged in",
                      type: "logged in"
                    })
                  }
                  if(response.error.id === "security_csrf_violation"){
                    //redirect the user
                    setError("oryValidationGeneral", {
                      message: "please try again later",
                      type: "csrf violation"
                    })
                  }
                  if(response.error.id === "security_identity_mismatch"){
                    //let the user know the browser needs to be opened to loggin with 0Auth 3rd party i.e. google
                  }
                  if(response.error.id === "browser_location_change_required"){
                    //redirect the user

                  }
                }
                const oryResponse: Ui = response.ui;

                if (oryResponse) {
                  console.log({OryResponse: oryResponse})
                  const attributes = oryRegisterFormErrorSetter(oryResponse);

                  for (const attribute of attributes) {

                    for (const message of attribute.messages) {
                      const name: validateField = (attribute.attributes.name as validateField);

                      setError(name,
                        {
                          type: "oryCloudValidationError",
                          message: message.text
                        });

                    }
                    console.log({validation: attribute, errors: errors})
                  }

                  if (!oryResponse.messages) {
                    return;
                  }
                  for (const message of oryResponse.messages) {
                    setError("oryValidationGeneral", {
                      message: message.text,
                      type: message.type,
                    })
                  }
                }
                console.log({"error thrown": x})
              }
            })

        })}>
        <Stack spacing={8} mx={'auto'} minW={'xl'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
            <Text>
              "Death may be the greatest of all human blessings" - Socrates
              {data?.id}
            </Text>
          </Stack>

          <Box
            rounded={'lg'}
            boxShadow={'lg'}
            p={8}
            bg={useColorModeValue('white', 'gray.700')}
          >
            <Stack spacing={4}>
              <FormControl id="userName" isRequired isInvalid={errorIsValid(errors,errors.traits?.username)}>
                    <FormLabel>User Name</FormLabel>
                    <Input type="text" {...register("traits.username")} />
                    <FormErrorMessage>{errors.traits?.username?.message}</FormErrorMessage>
              </FormControl>
              <FormControl id="email" isRequired isInvalid={errorIsValid(errors,errors.traits?.email)}>
                <FormLabel>Email address</FormLabel>
                <Input type="email" {...register("traits.email")}/>
                <FormErrorMessage>{errors.traits?.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isRequired isInvalid={errorIsValid(errors,errors.password)}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'} {...register("password")}/>
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors["password"]?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errorIsValid(errors,errors.oryValidationGeneral)}>
                <FormErrorMessage>{errors.oryValidationGeneral?.message}</FormErrorMessage>
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
                  <ReactRouterLink to={"/login"}>Already a user? <Link color={'blue.400'}>Login</Link> </ReactRouterLink>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
        </form>
      </Flex>
    );
  }
