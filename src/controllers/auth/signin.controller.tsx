import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "core/hooks/use-redux";
import { AuthLocationState } from "models/auth";
import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginJWT } from "store/action-creators/auth.actions";
import { ErrorToast } from "core/components/error";
import { isFieldsInvalid } from "lib/utils";
import { appRoutes } from "core/routes/routes";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as AuthLocationState)?.from?.pathname ||
    appRoutes.DASHBOARD;
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [state, setState] = useState({ email: "", password: "" });

  //
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const isDisabled = useCallback(() => isFieldsInvalid(state), [state]);

  const onLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    dispatch(loginJWT(navigate, from, state));
  };

  return (
    <>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Sign in to your account</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={state.email}
                  onChange={onChange}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={state.password}
                  onChange={onChange}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <ChakraLink
                    as={Link}
                    to={appRoutes.SIGN_UP}
                    color={"orange.400"}
                    colorScheme="orange"
                  >
                    Create an account
                  </ChakraLink>
                </Stack>
                <Button
                  bg={"orange.400"}
                  color={"white"}
                  _hover={{
                    bg: "orange.500",
                  }}
                  onClick={onLogin}
                  isLoading={loading}
                  isDisabled={isDisabled()}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
      {ErrorToast({ error })}
    </>
  );
}
