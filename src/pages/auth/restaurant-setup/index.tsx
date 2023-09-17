import { useEffect, useState } from "react";
import { Progress, Box, Flex } from "@chakra-ui/react";
import RestaurantDetails from "./restaurant-details";
import AddAddress from "./add-address";
import SocialHandles from "./social-handles";

const RestaurantSetup = () => {
  const [step, setStep] = useState(1);

  const next = () => {
    const nextStep = step + 1;

    setStep(nextStep);
  };

  const previous = () => {
    const prevStep = step - 1;
    setStep(prevStep);
  };

  const stepComponents = [
    <RestaurantDetails onNext={next} />,
    <AddAddress onNext={next} onPrevious={previous} />,
    <SocialHandles onPrevious={previous} />,
  ];

  const [progress, setProgress] = useState(
    (100 / stepComponents.length) * step
  );

  useEffect(() => {
    setProgress((100 / stepComponents.length) * step);
  }, [step]);

  return (
    <Flex
      minH={"calc(100vh - 4rem)"}
      align={"flex-start"}
      justify={"center"}
      mt={["4", "8", "16"]}
    >
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        w="container.sm"
        p={6}
        m="10px auto"
        as="form"
      >
        <Progress
          hasStripe
          value={progress}
          mb="5%"
          mx="5%"
          isAnimated
          colorScheme="gray"
        ></Progress>
        {stepComponents[step - 1]}
      </Box>
    </Flex>
  );
};

export default RestaurantSetup;
