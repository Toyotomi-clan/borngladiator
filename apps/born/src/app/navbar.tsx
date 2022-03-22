import {ReactNode, useCallback, useEffect, useState} from 'react';
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center, HStack,
} from '@chakra-ui/react';
import {MoonIcon, SunIcon} from '@chakra-ui/icons';
import {Link as ReactLink} from "react-router-dom"
import {queryCache, queryClient} from "./QueryClient";
import {SelfServiceLogoutUrl, Session} from "@ory/client";
import {AxiosResponse} from "axios";
import {useCurrentUser, useLogout} from "./Api/Api";

const NavLink = ({children}: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}>
    {children}
  </Link>
);

export default function Nav() {
  const {colorMode, toggleColorMode} = useColorMode();

  const {data, error, isFetching} = useCurrentUser();

  const isLoggedIn = data?.data?.active || false;

  const logout = useLogout(isLoggedIn);

  const [logoutUser, setLogoutUser] = useState(false);

  const logoutCurrentUser = useCallback(async () => {

    const logoutUrl = logout?.data?.data?.logout_url || "";
    if (logoutUser && logoutUrl) {
      await queryClient.invalidateQueries("user")
      //Todo: maybe when ory supports logout by react router we can modify this
      window.location.href = logoutUrl;
    }
  }, [logoutUser])

  useEffect(() => {
    logoutCurrentUser();
  }, [logoutCurrentUser])


  return (
    <>
      <Box px={2}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack>

            <Box>
              Death
            </Box>
            <Box>
              <span className="material-icons">
              watch_later
            </span>
            </Box>
          </HStack>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
              </Button>

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
                    <MenuItem onClick={() => {setLogoutUser(x => !x)}}> Logout</MenuItem>
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
