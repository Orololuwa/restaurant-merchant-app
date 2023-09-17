import {
  Avatar,
  Box,
  Center,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  Link as ChakraLink,
  Button,
} from "@chakra-ui/react";
import Dropdown, { Option } from "core/components/dropdown";
import { Loading } from "core/components/loading";
import { useAppDispatch, useAppSelector } from "core/hooks/use-redux";
import { appRoutes } from "core/routes/routes";
import { PictureFrame } from "iconsax-react";
import { LocalStorage, isEmpty } from "lib/utils";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getARestaurant } from "store/action-creators/restaurant.action";

const RestaurantChoose = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data, loading, error } = useAppSelector(
    (state) => state.restaurant.restaurants
  );

  const restaurant = useAppSelector(
    (state) => state.restaurant.restaurant?.data
  );

  const [state, setState] = useState(restaurant?.id);

  const options: Option[] = data?.map((it) => ({
    label: (
      <Center gap="2" key={it.id} justifyContent="flex-start">
        <Avatar
          src={it?.logo}
          rounded={"md"}
          size={"sm"}
          name={it?.name}
          icon={<Icon as={PictureFrame} boxSize={"8"} />}
        />
        <Text fontSize={16} borderRadius={4} pt="1">
          {it.name}
        </Text>
      </Center>
    ),
    value: it.id,
  }));

  // error and loading
  const toast = useToast();

  useEffect(() => {
    if (error)
      toast({
        status: "error",
        description: error,
        position: "top",
      });
  }, [error]);

  const onContinue = async () => {
    if (isEmpty(state)) return;
    LocalStorage.set("selectedRestaurant", state);
    await dispatch(getARestaurant(state as number));
    navigate("/dashboard");
  };

  if (loading) return <Loading />;

  return (
    <Center py={12} minH={"calc(100vh - 4rem)"}>
      <Box
        role={"group"}
        p={6}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("whiteAlpha.200", "whiteAlpha.900")}
        color={"gray.600"}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Stack>
          <Text fontSize={18} pb="1" fontWeight={"semibold"}>
            Choose Restaurant
          </Text>
          <Dropdown
            options={options}
            defaultValue={{
              value: restaurant?.id,
              label: (
                <Center
                  gap="2"
                  key={restaurant?.id}
                  justifyContent="flex-start"
                >
                  <Avatar
                    src={restaurant?.logo}
                    rounded={"md"}
                    size={"sm"}
                    name={restaurant?.name}
                    icon={<Icon as={PictureFrame} boxSize={"8"} />}
                  />
                  <Text fontSize={16} borderRadius={4} pt="1">
                    {restaurant?.name}
                  </Text>
                </Center>
              ),
            }}
            onChange={(option) => {
              setState(option?.value);
            }}
          />
          <Box pt="2" />
          <Button
            colorScheme="blackAlpha"
            variant={"solid"}
            size={"sm"}
            isDisabled={isEmpty(state)}
            onClick={onContinue}
          >
            Continue
          </Button>
          <Box pt="5" />
          <ChakraLink
            as={Link}
            to={appRoutes.RESTAURANT_SETUP}
            color={"gray.400"}
            colorScheme="gray"
            fontSize={"sm"}
          >
            Create restaurant?
          </ChakraLink>
        </Stack>
      </Box>
    </Center>
  );
};

export default RestaurantChoose;
