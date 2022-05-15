import {
  Box,
  Flex, Heading, HStack, Text,
  Spinner, useToast, VStack, Button,
} from "@chakra-ui/react";
import {useCurrentUser} from "./Api/Api";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDeathClockUser} from "./Api/GetUserEndPoint";
import DeathTimer from "./DeathTimer";


export default function Home(){
  const {data,error, isFetching } = useCurrentUser();
  const {data: deathClockUser, error: deathClockUserError, isFetching: deathClockUserFetching}  = useDeathClockUser();
  const toast = useToast()
  const navigate = useNavigate();

  useEffect(() =>{
    if(!deathClockUserFetching && !deathClockUser.data){
      navigate("/new")
    }

  },[deathClockUserFetching,deathClockUser])


  return (
    <Flex
      align={'center'}
      justify={'center'}>
      {isFetching || deathClockUserFetching &&   <Spinner size='xl' />}
      {data && !isFetching && !deathClockUserFetching && deathClockUser.data &&

      <>
        <VStack spacing={8} w={{base: "xs", lg: "full"}}>
          <DeathTimer lifeLeft={new Date(deathClockUser.data.lifeLeft)}/>

          <Heading>Age: {deathClockUser.data.age}</Heading>

          <Text fontSize='xl'>You have {deathClockUser.data.lifeExpectancy - deathClockUser.data.age} birthdays to look forward to</Text>

          <HStack w={{base:"xs", lg: "2xl", md: "lg"}} flexWrap={"wrap"} justifyContent={"center"}>
            {Array.from(Array(deathClockUser.data.lifeExpectancy - deathClockUser.data.age).keys()).map(x => <Box key={x}>🎂</Box>)}
          </HStack>

          <Text fontSize='xl'>You have spent {deathClockUser.data.age} birthdays</Text>

          <HStack w={{base:"xs", lg: "2xl", md: "lg"}} flexWrap={"wrap"} justifyContent={"center"}>
            {Array.from(Array(deathClockUser.data.age).keys()).map(x => <Box key={x}>☠️</Box>)}
          </HStack>

          <Box fontWeight={"bold"}> <Text display={"inline"} color={"red"}> {deathClockUser.data.daysSpent} </Text> days of your life are gone forever</Box>

          {deathClockUser.data.subscribed && <Button onClick={() => {
            navigate(
              {
                pathname: "/subscribe",
                search: `?subscribeId=${deathClockUser.data.subscribeId}&subscribe=false`
              }
            )

          }}>Unsubscribe</Button>}

          {!deathClockUser.data.subscribed && <Button onClick={() => {
            navigate(
              {
                pathname: "/subscribe",
                search: `?subscribeId=${deathClockUser.data.subscribeId}&subscribe=true`
              }
            )

          }}>Subscribe</Button>}

        </VStack>

      </>
      }
    </Flex>
  )
}
