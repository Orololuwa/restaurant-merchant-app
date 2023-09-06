import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link as ChakraLink,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Icon,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { ColorModeSwitcher } from "core/components/color-mode-switcher";
import { Link, useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import { appRoutes } from "core/routes/routes";
import { LoginCurve, Logout } from "iconsax-react";
import { useLogout } from "core/hooks/use-logout";
import logo from "assets/logo.png";
import { useAppSelector } from "core/hooks/use-redux";

const Links = [
  {
    name: "Dashboard",
    to: appRoutes.DASHBOARD,
  },
  {
    name: "Orders",
    to: appRoutes.ORDERS,
  },
  {
    name: "Users",
    to: appRoutes.USERS,
  },
];

const NavLink = ({ children, to }: { children: ReactNode; to: string }) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <ChakraLink
      as={Link}
      px={2}
      py={1}
      rounded={"md"}
      color={"whiteAlpha.900"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      // eslint-disable-next-line no-use-before-define
      bg={match ? useColorModeValue("gray.200", "gray.700") : "initial"}
      to={to}
    >
      {children}
    </ChakraLink>
  );
};

export default function HeaderNav() {
  const [isLoggedIn] = useAppSelector((state) => [state.auth.isLoggedIn]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const { logoutHandler } = useLogout();

  return (
    <Box bg={useColorModeValue("gray.900", "gray.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={"center"}>
          <Box
            cursor={"pointer"}
            onClick={() => navigate(appRoutes.HOME)}
            h="full"
            p="2"
            bg={useColorModeValue("white", "gray.700")}
            rounded="md"
          >
            <Image
              src={logo}
              alt="Logo"
              height={"100%"}
              w={["8", "10", "10"]}
            />
          </Box>
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.name}
              </NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={"center"}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
            >
              <Avatar size={"sm"} src={""} />
            </MenuButton>
            <MenuList>
              {isLoggedIn ? (
                <MenuItem color={"red.500"} onClick={logoutHandler}>
                  <Text pr={"2"}>Logout</Text>
                  <Icon as={Logout} boxSize="5" />
                </MenuItem>
              ) : (
                <MenuItem onClick={() => navigate(appRoutes.SIGN_IN)}>
                  <Text pr={"2"}>Sign In</Text>
                  <Icon as={LoginCurve} boxSize="5" />
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.name}
              </NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
