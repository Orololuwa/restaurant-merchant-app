import { useEffect, useState } from "react";
import {
  Flex,
  Avatar,
  HStack,
  IconButton,
  // Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Text,
  Icon,
  useToast,
  FlexProps,
  Center,
  // Center,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "core/components/color-mode-switcher";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "core/routes/routes";
import { AddSquare, Edit, FingerScan, LoginCurve, Logout } from "iconsax-react";
import { useLogout } from "core/hooks/use-logout";
import { useAppDispatch, useAppSelector } from "core/hooks/use-redux";
import authService from "services/auth.service";
import { decode } from "base64-arraybuffer";
import {
  MaybeCredential,
  decodeAssertion,
  encodeAssertResponse,
  encodeAttestationResponse,
} from "lib/helpers/web-auth-n.helper";
import { FiMenu } from "react-icons/fi";
import { Logo } from "core/components/logo";
import { LocalStorage } from "lib/utils";
import {
  getARestaurant,
  resetARestaurant,
} from "store/action-creators/restaurant.action";
import { SettingsIcon } from "@chakra-ui/icons";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

export type UserWebauthn = {
  publicKey: string;
  credentialId: string;
};

export default function HeaderNav({
  onOpen: onOpenMenu,
  ...rest
}: MobileProps) {
  const dispatch = useAppDispatch();
  const [isLoggedIn] = useAppSelector((state) => [state.auth.isLoggedIn]);

  const navigate = useNavigate();

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

  const editRestaurant = () => {
    navigate(appRoutes.RESTAURANT_SETUP);
  };

  const addRestaurant = () => {
    LocalStorage.remove("selectedRestaurant");
    dispatch(resetARestaurant());
    navigate(appRoutes.RESTAURANT_SETUP);
  };

  //
  //
  const { data: restaurants } = useAppSelector(
    (state) => state.restaurant.restaurants
  );

  const restaurant = useAppSelector(
    (state) => state.restaurant.restaurant?.data
  );

  const onSwitchRestaurant = async (id: number) => {
    LocalStorage.set("selectedRestaurant", id);
    await dispatch(getARestaurant(id));
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <Center gap={["2", "4", "8"]}>
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onOpenMenu}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />

        <Logo
          display={{ base: "block", md: "none" }}
          justifySelf="flex-start"
        />
      </Center>

      <HStack spacing={{ base: "0", md: "6" }} alignItems={"center"}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <Center
          gap="2"
          rounded={"md"}
          backgroundColor={useColorModeValue("gray.200", "whiteAlpha.200")}
          px="2"
          py="1"
        >
          <Menu>
            <MenuButton
              as={Flex}
              cursor={"pointer"}
              minW={0}
              flexDirection={"row"}
              _hover={{
                backgroundColor: useColorModeValue(
                  "gray.300",
                  "whiteAlpha.300"
                ),
              }}
              p="1"
              rounded={"md"}
            >
              <Center>
                {restaurant ? (
                  <Center>
                    <Avatar size={"xs"} src={restaurant?.logo} />
                    <Text pl={"2"} fontSize={"sm"}>
                      {restaurant?.name}
                    </Text>
                  </Center>
                ) : (
                  <Center>
                    <Avatar size={"xs"} src={""} />
                    <Text pl={"2"} fontSize={"xs"}>
                      Select Restaurant
                    </Text>
                  </Center>
                )}
              </Center>
            </MenuButton>
            <MenuList>
              {restaurants?.map((el) => (
                <MenuItem onClick={() => onSwitchRestaurant(el.id)} key={el.id}>
                  <Avatar size={"xs"} src={el.logo} />
                  <Text pl={"2"} fontSize={"md"}>
                    {el.name}
                  </Text>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Center
            onClick={editRestaurant}
            cursor={"pointer"}
            _hover={{
              backgroundColor: useColorModeValue("gray.300", "whiteAlpha.300"),
            }}
            p="1"
            rounded={"md"}
          >
            <Icon as={Edit} boxSize="5" />
          </Center>
          <Center
            onClick={addRestaurant}
            cursor={"pointer"}
            _hover={{
              backgroundColor: useColorModeValue("gray.300", "whiteAlpha.300"),
            }}
            p="1"
            rounded={"md"}
          >
            <Icon as={AddSquare} boxSize="5" />
          </Center>
        </Center>
        <Menu>
          <MenuButton
            as={Flex}
            rounded={"full"}
            cursor={"pointer"}
            minW={0}
            flexDirection={"row"}
            px="2"
            transform={"translateY(-2px)"}
          >
            <Icon as={SettingsIcon} boxSize={"5"} />
          </MenuButton>
          <MenuList>
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
      </HStack>
    </Flex>
  );
}
