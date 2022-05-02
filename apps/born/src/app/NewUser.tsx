import {
  Button,
  Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Link, Select,
  Spinner, Stack, Text, useToast, VStack,
} from "@chakra-ui/react";
import {useCurrentUser} from "./Api/Api";
import {useEffect, useState} from "react";
import {useMutationNewUser} from "./Api/CreateUserEndPoint";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useForm,Controller} from "react-hook-form";
import {NewUserModel} from "./models/newUserModel";
import {errorIsValid} from "./helper/EmptyObjectHelper";


export default function NewUser(){
  const {data,error, isFetching } = useCurrentUser();
  const {control,handleSubmit, setError,register, formState: {errors},setValue}  = useForm<NewUserModel>();
  const mutation = useMutationNewUser(setError);

  const toast = useToast()

  useEffect(() =>{
    if(!data  && !isFetching){
      throw  error;
    }
  },[error])


  return (
    <Flex
      marginTop={"10%"}
      align={'center'}
      justify={'center'}
      direction={"column"}
    >
      {isFetching &&   <Spinner size='xl' />}
      {data && !isFetching &&
        <>
          <Stack align={'center'} mb={"40px"}>
            <Heading fontSize={'4xl'}>Just one more step left!</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              ❤️
            </Text>
          </Stack>
          <VStack  boxShadow={'lg'} bg={'gray.30'}
                   rounded={'xl'}  paddingTop={12} spacing={0}  w={{ base: "full",lg: "2xl",md: "lg"}} h={"full"}>


            <form onSubmit={handleSubmit((form) =>{

              const [withoutTime] = form.dateOfBirth.toISOString().split("T");

              mutation.mutate({
                dateOfBirth: withoutTime,
                gender: form.gender
              })
            })}>
              <VStack spacing={8} >
                <FormControl isRequired isInvalid={errorIsValid(errors,errors.gender)}>
                  <FormLabel htmlFor='gender'>Gender</FormLabel>

                  <Select id={"gender"} {...register("gender", {
                    required: "Please select a gender"
                  })} placeholder='Select Gender'>
                    <option label={"male"} value='male'>Male</option>
                    <option label={"female"} value='female'>Female</option>
                  </Select>

                  <FormErrorMessage>{errors["gender"]?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired  isInvalid={errorIsValid(errors,errors.dateOfBirth)}>
                  <FormLabel htmlFor='dateOfBirth'>Date of birth</FormLabel>

                  <Controller

                    control={control}
                    name='dateOfBirth'
                    rules={{
                      required: "Please enter valid birthday",

                      validate: {
                        currentYear: x =>{
                          const today = new Date();
                          return  today.getFullYear() > x.getFullYear()  || "You are born in the future?" ;
                        },
                        min18: x =>{
                          const today = new Date();
                          const requiredAge = today.getFullYear() - 18
                          return  requiredAge >= x.getFullYear() || "You must be 18 or above" ;
                        },

                        max70: x =>{
                          const today = new Date();
                          const maxAge = today.getFullYear() - 70
                          return   x.getFullYear() > maxAge || "You are older than 70? Don't believe it" ;
                        }
                      },

                    }}
                    render={({ field }) => (
                      <DatePicker
                        id={"dateOfBirth"}
                        placeholderText='Select date'
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"

                      />
                    )}
                  />

                  <FormErrorMessage>{errors["dateOfBirth"]?.message}</FormErrorMessage>
                </FormControl>

                <Button
                  type={"submit"}
                  colorScheme='gray' variant='ghost'
                 width={"full"}
                >
                  Enter
                </Button>
              </VStack>


            </form>

          </VStack>
          </>}

    </Flex>
  )
}
