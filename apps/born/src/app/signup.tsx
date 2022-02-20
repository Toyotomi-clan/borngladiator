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
  Link,
  Divider, useToast, toast,
} from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import {Flow,InitFlow} from "./models/registerRequest"
  import {useForm} from "react-hook-form";


export default function SignupCard() {

    const {register, handleSubmit} = useForm<registerFormModel>();
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

  console.log(new Date(data?.expires_at))

    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
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
                  email: form.email,
                  username: form.username,
                }
              })
            }
          ).then(x => x.json()).then(x =>
            {
              console.log(x)
              if(x.session.active){
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
            .catch(x => console.log(x))

        })}>
        <Stack spacing={8} mx={'auto'} minW={'xl'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
            <Text fontSize={'lg'} color={'gray.900'}>
              "Death may be the greatest of all human blessings" - Socrates
              {data?.id}
            </Text>
          </Stack>

          <Divider color={"red.900"}/>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl id="userName" isRequired>
                    <FormLabel>User Name</FormLabel>
                    <Input type="text" {...register("username")} />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" {...register("email")}/>
              </FormControl>
              <FormControl id="password" isRequired>
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
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  type={"submit"}
                  loadingText="Submitting"
                  size="lg"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user? <Link color={'blue.400'}>Login</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
        </form>
      </Flex>
    );
  }
