import {useEffect, useRef, useState} from 'react';
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  useColorMode,
  Center, HStack,
} from '@chakra-ui/react';
import {MoonIcon, SunIcon} from '@chakra-ui/icons';
import {useNavigate} from "react-router-dom"
import {useCurrentUser, useLogoutFlow, useLogoutUser} from "./Api/Api";
import useStore from "./store/createstore";
import LogoComponent from "./logoComponent";

export default function Nav() {

  const {data, error} = useCurrentUser();

  const isLoggedIn = data?.data?.active || false;

  const logout = useLogoutFlow(isLoggedIn);

  const setLogoutFlow= useStore(state => state.toggleLogoutFlow)
  const logoutClickedRef = useRef(useStore(state => state.logoutClicked))

  const navigator = useNavigate();

  const {data: gotUserLoggedOut} = useLogoutUser(logoutClickedRef.current,logout?.data?.data?.logout_url || "", navigator);

  useEffect(() => useStore.subscribe(
    state => (logoutClickedRef.current = state.logoutClicked)
  ))

  return (
    <>
      <Box px={2}>
        <Flex h={16} paddingRight={"50px"} paddingLeft={"50px"} alignItems={'center'} justifyContent={'space-between'}>
          <HStack>
             <LogoComponent/>
          </HStack>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              {!error && data?.data?.active &&
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}>
                    <Avatar
                      size={'sm'}
                      src={'https://avatars.dicebear.com/api/male/username.svg'}
                    />
                  </MenuButton>
                  <MenuList alignItems={'center'}>
                    <br/>
                    <Center>
                      <Avatar
                        size={'2xl'}
                        src={'https://avatars.dicebear.com/api/male/username.svg'}
                      />
                    </Center>
                    <br/>
                    <Center>
                      <p>{data.data.identity.traits.username}</p>
                    </Center>
                    <br/>
                    <MenuDivider/>
                    <MenuItem onClick={() => {setLogoutFlow()}}> Logout</MenuItem>
                  </MenuList>
                </Menu>
              }
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
