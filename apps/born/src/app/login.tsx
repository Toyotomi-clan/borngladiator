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
  useColorModeValue, FormErrorMessage,
} from '@chakra-ui/react';

import {Link as ReactRouterLink} from "react-router-dom";

import useStartLoginFlow, {useMutateLogin} from "./Api/Api";
import {useForm} from "react-hook-form";
import {LoginFormModel} from "./models/registerFormModel";
import {SubmitSelfServiceLoginFlowBody} from "@ory/client/dist/api";
import {findCsrfToken} from "./helper/oryHelper";
import {errorIsValid} from "./helper/EmptyObjectHelper";


export default function Login() {

  const { status, data, error , isFetching } = useStartLoginFlow();
  const {handleSubmit, setError,register, formState: {errors}}  = useForm<LoginFormModel>();
  const mutation  = useMutateLogin();

  console.log({status,data,error,isFetching})
  console.log({mutation})

  return (
    <Flex
      minH={'100vh'}
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
        });

      })}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
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

            <FormControl isInvalid={errorIsValid(errors,errors.oryValidationGeneral)}>
              <Text {...register("oryValidationGeneral",{required: false})}/>

              <FormErrorMessage>{errors.oryValidationGeneral?.message}</FormErrorMessage>
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
