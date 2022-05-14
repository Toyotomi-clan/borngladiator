import {Container, Divider, Stack, StackDivider, Text} from "@chakra-ui/react";

export const Footer = () => (
<Container  as="footer" role="contentinfo" paddingBottom={"20px"} textAlign={"center"} w={"full"} h={"full"} >
  <Stack mt={{base: "0", lg: "100px", md: "80px"}} spacing={{ base: '4', md: '5' }}>

    <Text fontSize="sm" color="subtle">
      &copy; {new Date().getFullYear()} Stoictemple, Inc. All rights reserved.
    </Text>
  </Stack>
</Container>
);
