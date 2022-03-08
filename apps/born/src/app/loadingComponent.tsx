import {Flex, Spinner} from "@chakra-ui/react";

export const LoadingComponent = () =>  <Flex
  minH={'100vh'}
  align={'center'}
  justify={'center'}><Spinner size={"xl"}/>
</Flex>
