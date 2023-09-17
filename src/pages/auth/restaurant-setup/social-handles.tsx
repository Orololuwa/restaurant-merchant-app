import {
  Heading,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  useToast,
  ButtonGroup,
  Flex,
  Button,
  Icon,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "core/hooks/use-redux";
import { appRoutes } from "core/routes/routes";
import { LocalStorage } from "lib/utils";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import restaurantsService from "services/restaurants.service";
import { getARestaurant } from "store/action-creators/restaurant.action";

interface Props {
  onPrevious: () => void;
}

const SocialHandles = (props: Props) => {
  const { onPrevious } = props;
  const restaurantId = LocalStorage.get("selectedRestaurant");

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { data } = useAppSelector((state) => state.restaurant.restaurant);

  const [state, setState] = useState({
    website: data?.website || "",
    twitter: data?.twitter || "",
    facebook: data?.facebook || "",
    instagram: data?.instagram || "",
    linkedIn: data?.linkedIn || "",
  });

  //
  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  //
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const onSubmit = async () => {
    setLoading(true);

    const payload: any = {};

    Object.entries(state).map(([key, value]) => {
      if (value) payload[key] = value;
    });

    try {
      const {
        data: {
          data: { id },
          message,
        },
      } = await restaurantsService.editRestaurant(restaurantId, payload);
      LocalStorage.set("selectedRestaurant", id);
      await dispatch(getARestaurant(id));
      toast({
        description: message,
        status: "success",
        position: "top",
        variant: "subtle",
      });
      setLoading(false);
      navigate(appRoutes.DASHBOARD);
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

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal">
        Social Handles
      </Heading>
      <SimpleGrid columns={2} spacing={6}>
        <FormControl as={GridItem} colSpan={[3, 2]}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
            htmlFor="website"
          >
            Website
          </FormLabel>
          <InputGroup size="sm">
            <InputLeftAddon
              bg="gray.50"
              _dark={{
                bg: "gray.800",
              }}
              color="gray.500"
              rounded="md"
            >
              https://
            </InputLeftAddon>
            <Input
              type="tel"
              placeholder="www.example.com"
              focusBorderColor="brand.400"
              rounded="md"
              id="website"
              value={state.website}
              name="website"
              onChange={onChangeHandler}
              autoComplete="onChangeHandler"
            />
          </InputGroup>
        </FormControl>

        <FormControl mt={1} as={GridItem} colSpan={[3, 1]}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
            htmlFor="instagram"
          >
            Instagram
          </FormLabel>
          <InputGroup size="sm">
            <InputLeftAddon
              bg="gray.50"
              _dark={{
                bg: "gray.800",
              }}
              color="gray.500"
              rounded="md"
            >
              <Icon as={FaInstagram} boxSize={"5"} />
            </InputLeftAddon>
            <Input
              type="tel"
              placeholder="www.instagram.com/example"
              focusBorderColor="brand.400"
              rounded="md"
              value={state.instagram}
              name="instagram"
              onChange={onChangeHandler}
              autoComplete="onChangeHandler"
              id="instagram"
            />
          </InputGroup>
        </FormControl>

        <FormControl mt={1} as={GridItem} colSpan={[3, 1]}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
            htmlFor="twitter"
          >
            Twitter
          </FormLabel>
          <InputGroup size="sm">
            <InputLeftAddon
              bg="gray.50"
              _dark={{
                bg: "gray.800",
              }}
              color="gray.500"
              rounded="md"
            >
              <Icon as={FaTwitter} boxSize={"5"} />
            </InputLeftAddon>
            <Input
              type="tel"
              placeholder="www.twitter.com/example"
              focusBorderColor="brand.400"
              rounded="md"
              value={state.twitter}
              name="twitter"
              onChange={onChangeHandler}
              autoComplete="onChangeHandler"
              id="twitter"
            />
          </InputGroup>
        </FormControl>

        <FormControl mt={1} as={GridItem} colSpan={[3, 1]}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
            htmlFor="facebook"
          >
            Facebook
          </FormLabel>
          <InputGroup size="sm">
            <InputLeftAddon
              bg="gray.50"
              _dark={{
                bg: "gray.800",
              }}
              color="gray.500"
              rounded="md"
            >
              <Icon as={FaFacebook} boxSize={"5"} />
            </InputLeftAddon>
            <Input
              type="tel"
              placeholder="www.facebook.com/example"
              focusBorderColor="brand.400"
              rounded="md"
              value={state.facebook}
              name="facebook"
              onChange={onChangeHandler}
              autoComplete="onChangeHandler"
              id="facebook"
            />
          </InputGroup>
        </FormControl>

        <FormControl mt={1} as={GridItem} colSpan={[3, 1]}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
            htmlFor="linkedIn"
          >
            LinkedIn
          </FormLabel>
          <InputGroup size="sm">
            <InputLeftAddon
              bg="gray.50"
              _dark={{
                bg: "gray.800",
              }}
              color="gray.500"
              rounded="md"
            >
              <Icon as={FaLinkedin} boxSize={"5"} />
            </InputLeftAddon>
            <Input
              type="tel"
              placeholder="www.linkedIn.com/example"
              focusBorderColor="brand.400"
              rounded="md"
              value={state.linkedIn}
              name="linkedIn"
              onChange={onChangeHandler}
              autoComplete="onChangeHandler"
              id="linkedIn"
            />
          </InputGroup>
        </FormControl>
      </SimpleGrid>
      <ButtonGroup mt="5%" w="100%" colorScheme="gray">
        <Flex w="100%" justifyContent="flex-end">
          <Button onClick={onPrevious} variant="solid" w="7rem" mr="5%">
            Back
          </Button>
          <Button
            w="7rem"
            onClick={onSubmit}
            variant="solid"
            isLoading={isLoading}
            colorScheme="green"
          >
            Finish
          </Button>
        </Flex>
      </ButtonGroup>
    </>
  );
};

export default SocialHandles;
