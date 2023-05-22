import * as React from "react";
import { useRoutes } from "react-router-dom";
import routes from "core/routes";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { LoadingText } from "core/components/loading";

export const App = () => {
  const routesHere = useRoutes(routes);

  return (
    <ChakraProvider theme={theme}>
      <React.Suspense fallback={<LoadingText />}>{routesHere}</React.Suspense>
    </ChakraProvider>
  );
};
