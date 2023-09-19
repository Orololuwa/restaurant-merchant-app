import {
  Flex,
  Icon,
  FlexProps,
  Link as ChakraLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";

interface NavItemProps extends FlexProps {
  icon?: IconType;
  children: React.ReactNode;
  to: string;
}

export const WithIconLink = ({ icon, children, to, ...rest }: NavItemProps) => {
  return (
    <ChakraLink
      as={Link}
      to={to}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: useColorModeValue("gray.500", "whiteAlpha.500"),
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </ChakraLink>
  );
};
