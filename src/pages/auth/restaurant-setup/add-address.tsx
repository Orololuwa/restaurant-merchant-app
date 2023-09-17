import {
  Heading,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  ButtonGroup,
  Flex,
  Button,
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "core/hooks/use-redux";
import { LocalStorage, isFieldsInvalid } from "lib/utils";
import { useState } from "react";
import restaurantsService from "services/restaurants.service";
import { getARestaurant } from "store/action-creators/restaurant.action";

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const AddAddress = (props: Props) => {
  const { onPrevious, onNext } = props;

  const dispatch = useAppDispatch();

  const restaurantId = LocalStorage.get("selectedRestaurant");

  const { data } = useAppSelector((state) => state.restaurant.restaurant);

  const [state, setState] = useState({
    houseNumber: data?.address?.houseNumber || "",
    city: data?.address?.city || "",
    country: data?.address?.country || "",
    state: data?.address?.state || "",
    street: data?.address?.street || "",
    zipCode: data?.address?.zipCode.toString() || "",
  });

  //
  const onChangeHandler = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
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
      } = data?.address
        ? await restaurantsService.editAddress(restaurantId, {
            ...state,
            zipCode: +state.zipCode,
          })
        : await restaurantsService.createAddress(restaurantId, {
            ...state,
            zipCode: +state.zipCode,
          });
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

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Address
      </Heading>

      <FormControl as={GridItem} colSpan={6}>
        <FormLabel
          htmlFor="houseNumber"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
        >
          House Number
        </FormLabel>
        <Input
          type="text"
          name="houseNumber"
          value={state.houseNumber}
          onChange={onChangeHandler}
          id="houseNumber"
          autoComplete="houseNumber"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={6}>
        <FormLabel
          htmlFor="street"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          Street
        </FormLabel>
        <Input
          type="text"
          name="street"
          value={state.street}
          onChange={onChangeHandler}
          id="street"
          autoComplete="street"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 6, null, 2]}>
        <FormLabel
          htmlFor="city"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          City
        </FormLabel>
        <Input
          type="text"
          name="city"
          value={state.city}
          onChange={onChangeHandler}
          id="city"
          autoComplete="city"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="state"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          State / Province
        </FormLabel>
        <Input
          type="text"
          name="state"
          value={state.state}
          onChange={onChangeHandler}
          id="state"
          autoComplete="state"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3]}>
        <FormLabel
          htmlFor="country"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          Country / Region
        </FormLabel>
        <Select
          id="country"
          name="country"
          value={state.country}
          onChange={onChangeHandler}
          autoComplete="country"
          placeholder="Select option"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        >
          <option>Nigeria</option>
          <option>United States</option>
          <option>Canada</option>
        </Select>
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="zipCode"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          ZIP / Postal
        </FormLabel>
        <Input
          type="text"
          name="zipCode"
          value={state.zipCode}
          onChange={onChangeHandler}
          id="zipCode"
          autoComplete="zip-code"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>
      <ButtonGroup mt="5%" w="100%" colorScheme="gray">
        <Flex w="100%" justifyContent="flex-end">
          <Button onClick={onPrevious} variant="solid" w="7rem" mr="5%">
            Back
          </Button>
          <Button
            w="7rem"
            onClick={onSubmit}
            variant="outline"
            isLoading={isLoading}
            isDisabled={isFieldsInvalid(state)}
          >
            Next
          </Button>
        </Flex>
      </ButtonGroup>
    </>
  );
};

export default AddAddress;
