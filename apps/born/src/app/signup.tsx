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
import {Link as ReactRouterLink, useNavigate} from "react-router-dom";
import {Session} from "@ory/client";
import useStore from "../app/store/createstore"
import {SuccessfulSelfServiceRegistrationWithoutBrowser} from "@ory/client/api";


export default function SignupCard() {

    const {register, handleSubmit,setError, formState} = useForm<registerFormModel>();
    const {errors} = formState;
    const [showPassword, setShowPassword] = useState(false);

    const [data,setData] = useState<Flow>(InitFlow);

    const [apiErrorRetry,setApiErrorRetry] = useState(false);
    const [apiErrorRetryCount,setApiRetryCount] = useState(0);
    const navigate = useNavigate();
    const setAuth = useStore(state => state.SetSession);


  const toast = useToast();

    useEffect(() => {
      fetch("/.ory/self-service/registration/browser",{
        headers:{
          accept: "application/json"
        }
      }).then(response => {
        //Network error
        if(!response.ok){
          const error = {
                response: response,
                code: response.status,
          }
          throw error;
        }
        return response;
      })
        .then(response => response.json()).then(response => {

        const flow = response as Flow;

        if(flow === null){
          throw new Error("response unable to parse");
        }

        const csrfToken = flow.ui.nodes.find(x => x.attributes.name === "csrf_token");

        if(!csrfToken.attributes.value || !csrfToken.attributes.name){
          throw new Error("csrfToken not specified");
        }

        if(data.id == "" && flow !== null){
          setData(() => flow)
        }

      }).catch( async exception => {
        //Todo: maybe gradual retry
        //log error to some log store
        const {code,response} = exception;
        if(code === 400){
          const {error} = await response.json();

          if(error.id && error.id === "session_already_available"){
            //Todo Redirect user to the main page

          }
        }
        if(apiErrorRetryCount < 3) {
          setApiRetryCount(x => x + 1);
          setApiErrorRetry(singleRetry => !singleRetry);
        }
        else if(apiErrorRetryCount >= 3 && !data.id){
            navigate("/error")
        }
      });
    },[apiErrorRetry,data.id])

    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}>


      <form onSubmit={handleSubmit((form: registerFormModel ) => {

          if(!data.ui){
            //retry data should not be in this state
            setError("oryValidationGeneral",{
              message: "Sorry, try to resubmit, if this error persist try again later",
              type: "state error",
            })
            setApiErrorRetry(x => !x);
          }

          const csrfToken = data.ui.nodes.find(x => x.attributes.name === "csrf_token");

          if(!csrfToken.attributes.value || !csrfToken.attributes.name){
            //retry data should not be in this state
            setError("oryValidationGeneral",{
              message: "Sorry, try to resubmit, if this error persist try again later",
              type: "state error",
            })
            setApiErrorRetry(x => !x);
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
            .then(response => response.json()).then(data  =>
            {
              if(data.error){
                throw data;
              }
              const user = data as SuccessfulSelfServiceRegistrationWithoutBrowser;
              if(!user){
                return;
              }
              setAuth(user);

              if(user.session.active){
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
              //410 -> resource no longer available
              if(x.error?.code === 410){
                setError("oryValidationGeneral",{
                  message: "You waited too long,please try again",
                  type: "user error",
                })
                setData(() => InitFlow);
              }
              //Bad request what could it be?
              if(x.error?.code === 400) {
                const response = await x.error.response.json();

                if (response.error) {
                  if(response.error.id === "session_already_available"){
                    //redirect the user
                    setError("oryValidationGeneral", {
                      message: "You already logged in",
                      type: "logged in"
                    })
                    //Todo: Redirect user to the main area
                  }
                  if(response.error.id === "security_csrf_violation"){
                    //redirect the user
                    setError("oryValidationGeneral", {
                      message: "please try again later",
                      type: "csrf violation"
                    })
                    //Todo gradual retry is needed here
                    setData(() => InitFlow);
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
              }
            })

        },(errors,e) =>{
        console.log({
          errors,e
        })
      })}>
        <Stack spacing={8} mx={'auto'} minW={'xl'} py={12} px={6}>
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
              //Todo:
              <FormControl isInvalid={errorIsValid(errors,errors.oryValidationGeneral)}>
                <Text {...register("oryValidationGeneral",{required: false})}/>

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
