import {
  Button,
  Flex, FormControl, FormErrorMessage, FormLabel, Input, Select,
  Spinner, Stack, useToast,
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
    >
      {isFetching &&   <Spinner size='xl' />}
      {data && !isFetching &&
        <>
          <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'}>
            <form onSubmit={handleSubmit((form) =>{

              const [withoutTime] = form.dateOfBirth.toISOString().split("T");

              mutation.mutate({
                dateOfBirth: withoutTime,
                gender: form.gender
              })
            })}>
              <FormControl  isInvalid={errorIsValid(errors,errors.gender)}>
                <Select {...register("gender", {
                  required: "Please select a gender"
                })} placeholder='Select Gender'>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                </Select>

                <FormErrorMessage>{errors["gender"]?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired  isInvalid={errorIsValid(errors,errors.dateOfBirth)}>
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
                size={"md"}
              >
                Enter
              </Button>
            </form>

          </Stack>
          </>}

    </Flex>
  )
}
