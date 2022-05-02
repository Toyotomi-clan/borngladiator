import React from 'react';
import { useTimer } from 'react-timer-hook';
import {Box, Heading} from "@chakra-ui/react";

function MyTimer({ expiryTimestamp }) {
  const {
    seconds,
    minutes,
    hours,
    days,
  } = useTimer({ expiryTimestamp, autoStart: true });


  return (
    <div style={{textAlign: 'center'}}>
      <Heading> Death Clock </Heading>
      <Box fontSize={{base: "40px", lg: "100px", md: "90px"}}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </Box>
    </div>
  );
}
interface lifeLeft {
  lifeLeft : Date
}

export default function DeathTimer (props: lifeLeft)  {
  return (
      <MyTimer expiryTimestamp={props.lifeLeft} />
  );
}
