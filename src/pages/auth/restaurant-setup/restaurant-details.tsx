import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Flex,
  Stack,
  Skeleton,
  SkeletonCircle,
  Button,
  useToast,
} from "@chakra-ui/react";

import Upload from "core/components/upload/upload";
import { useAppDispatch, useAppSelector } from "core/hooks/use-redux";
import { getARestaurant } from "store/action-creators/restaurant.action";
import { LocalStorage, isFieldsInvalid } from "lib/utils";
import { AxiosError } from "axios";
import restaurantsService from "services/restaurants.service";

interface Props {
  onNext: () => void;
}

const RestaurantDetails = (props: Props) => {
  const { onNext } = props;
  const restaurantId = LocalStorage.get("selectedRestaurant");

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!restaurantId) return;
    dispatch(getARestaurant(restaurantId));
  }, []);

  const { data, loading } = useAppSelector(
    (state) => state.restaurant.restaurant
  );

  useEffect(() => {
    if (!data) return;

    setState({
      name: data?.name || "",
      email: data?.email || "",
      description: data?.description || "",
      logo: data?.logo || "",
    });
  }, [data]);

  const [state, setState] = useState({
    name: data?.name || "",
    email: data?.email || "",
    description: data?.description || "",
    logo: data?.logo || "",
  });

  //
  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const onImageChangeHandler = (image: string) => {
    setState((prevState) => ({ ...prevState, logo: image }));
  };

  //
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const onSubmit = async () => {
    setLoading(true);
    try {
      const {
        data: {
          data: { id },
          message,
        },
      } = restaurantId
        ? await restaurantsService.editRestaurant(restaurantId, state)
        : await restaurantsService.createRestaurant(state);
      LocalStorage.set("selectedRestaurant", id);
      await dispatch(getARestaurant(id));
      toast({
        description: message,
        status: "success",
        position: "top",
        variant: "subtle",
      });
      setLoading(false);
      onNext();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const msg = axiosError.response?.data?.message;
      toast({
        description: msg,
        status: "error",
        position: "top",
        variant: "subtle",
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Stack spacing={"10"}>
        <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
          User Registration
        </Heading>
        <Skeleton h="10" w="full" />
        <Skeleton h="10" w="full" />
        <Skeleton h="20" w="full" />
        <Flex alignItems={"flex-start"} gap={"5"}>
          <SkeletonCircle boxSize={"36"} flexShrink={"0"} />
          <Stack flexGrow={"1"}>
            <Skeleton h="28" w="full" />
            <Skeleton h="2" w="full" />
          </Stack>
        </Flex>
      </Stack>
    );
  }

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Restaurant Details
      </Heading>
      <FormControl mt="2%">
        <FormLabel htmlFor="name" fontWeight={"normal"}>
          Name
        </FormLabel>
        <Input
          id="name"
          type="text"
          value={state.name}
          name="name"
          onChange={onChangeHandler}
        />
      </FormControl>
      <FormControl mt="2%">
        <FormLabel htmlFor="email" fontWeight={"normal"}>
          Email address
        </FormLabel>
        <Input
          id="email"
          type="email"
          value={state.email}
          name="email"
          onChange={onChangeHandler}
          disabled={!!data}
        />
      </FormControl>
      <FormControl mt="2%">
        <FormLabel htmlFor="description" fontWeight={"normal"}>
          Description
        </FormLabel>
        <Textarea
          id="description"
          value={state.description}
          name="description"
          onChange={onChangeHandler}
        />
      </FormControl>
      <Box py="5">
        <Upload
          uploadKey={"test"}
          title="Logo"
          initialImage={state.logo}
          onCurrentImageChange={onImageChangeHandler}
        />
      </Box>
      <Flex justifyContent={"flex-end"}>
        <Button
          w="7rem"
          onClick={onSubmit}
          variant="outline"
          isDisabled={isFieldsInvalid(state)}
          isLoading={isLoading}
        >
          Next
        </Button>
      </Flex>
    </>
  );
};

export default RestaurantDetails;
