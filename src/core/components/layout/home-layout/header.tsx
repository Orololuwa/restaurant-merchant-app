import { ReactNode, useEffect, useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { ColorModeSwitcher } from "core/components/color-mode-switcher";
import { Link, useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import { appRoutes } from "core/routes/routes";
import {
  Add,
  ArrowSwapHorizontal,
  Edit,
  FingerScan,
  LoginCurve,
  Logout,
} from "iconsax-react";
import { useLogout } from "core/hooks/use-logout";
import logo from "assets/logo.png";
import { useAppDispatch, useAppSelector } from "core/hooks/use-redux";
import authService from "services/auth.service";
import { decode } from "base64-arraybuffer";
import {
  MaybeCredential,
  decodeAssertion,
  encodeAssertResponse,
  encodeAttestationResponse,
} from "lib/helpers/web-auth-n.helper";
import { LocalStorage } from "lib/utils";
import { resetARestaurant } from "store/action-creators/restaurant.action";

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

export type UserWebauthn = {
  publicKey: string;
  credentialId: string;
};

export default function HeaderNav() {
  const [isLoggedIn] = useAppSelector((state) => [state.auth.isLoggedIn]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { logoutHandler } = useLogout();

  const toast = useToast();

  //web-auth-n setup or flow

  const [processing, setProcessing] = useState(false);

  const [residentCredentials, setResidentCredentials] =
    useState<boolean>(false);

  const [failed, setFailed] = useState(false);

  const fetchCredentials = async () => {
    try {
      const { isWebAuthEnabled } = (await authService.getWebAuthStatus()).data
        .data;
      setResidentCredentials(isWebAuthEnabled);
    } catch (error) {
      toast({
        status: "error",
        title: "Error",
        description: "Failed to get Resident keys",
        position: "top",
      });
      setResidentCredentials(false);
    }
  };

  const setUp = async () => {
    setProcessing(true);
    try {
      const attestation = (await authService.attestateBegin()).data.data;
      attestation.challenge = decode(
        attestation.challenge as unknown as string
      );
      attestation.user.id = decode(attestation.user.id as unknown as string);

      const credential: MaybeCredential = await navigator.credentials.create({
        publicKey: attestation,
      });
      if (!credential) return setFailed(true);

      await authService.attestateEnd(
        encodeAttestationResponse(credential as PublicKeyCredential)
      );
      await fetchCredentials();
      setProcessing(false);
    } catch (error) {
      setFailed(true);
      setProcessing(false);
    }
  };

  const remove = async () => {
    setProcessing(true);
    try {
      const rawAssertion = (await authService.assertBegin()).data.data;
      const assertion = decodeAssertion(rawAssertion);

      const credential: MaybeCredential = await navigator.credentials.get({
        publicKey: assertion,
      });

      if (!credential) return setFailed(true);

      await authService.assertEndRemove({
        challenge: rawAssertion.challenge,
        ...encodeAssertResponse(credential as PublicKeyCredential),
      });

      await fetchCredentials();
    } catch (error) {}
  };

  useEffect(() => {
    (async () => {
      setProcessing(true);

      try {
        await fetchCredentials();
        setProcessing(false);
      } catch (error) {
        setFailed(true);
        setProcessing(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (processing === true) setFailed(false);
  }, [processing]);

  useEffect(() => {
    if (failed)
      toast({
        status: "error",
        title: "WebAuthN Error",
        description: "Failed to Authenticate",
        position: "top",
      });
  }, [failed]);

  //
  const switchRestaurant = () => {
    navigate(appRoutes.RESTAURANT_CHOOSE);
  };

  const editRestaurant = () => {
    navigate(appRoutes.RESTAURANT_SETUP);
  };

  const addRestaurant = () => {
    LocalStorage.remove("selectedRestaurant");
    dispatch(resetARestaurant());
    navigate(appRoutes.RESTAURANT_SETUP);
  };

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
              <MenuItem onClick={switchRestaurant}>
                <Icon as={ArrowSwapHorizontal} boxSize="5" />
                <Text pl={"2"}>Switch Restaurant</Text>
              </MenuItem>
              <MenuItem onClick={editRestaurant}>
                <Icon as={Edit} boxSize="5" />
                <Text pl={"2"}>Edit Restaurant</Text>
              </MenuItem>
              <MenuItem onClick={addRestaurant}>
                <Icon as={Add} boxSize="5" />
                <Text pl={"2"}>Add Restaurant</Text>
              </MenuItem>
              {residentCredentials ? (
                <MenuItem onClick={remove}>
                  <Icon as={FingerScan} boxSize="5" />
                  <Text pl={"2"}>Remove WebAuthN</Text>
                </MenuItem>
              ) : (
                <MenuItem onClick={setUp}>
                  <Icon as={FingerScan} boxSize="5" />
                  <Text pl={"2"}>Setup WebAuthN</Text>
                </MenuItem>
              )}
              {isLoggedIn ? (
                <MenuItem color={"red.500"} onClick={logoutHandler}>
                  <Icon as={Logout} boxSize="5" />
                  <Text pl={"2"}>Logout</Text>
                </MenuItem>
              ) : (
                <MenuItem onClick={() => navigate(appRoutes.SIGN_IN)}>
                  <Icon as={LoginCurve} boxSize="5" />
                  <Text pl={"2"}>Sign In</Text>
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
