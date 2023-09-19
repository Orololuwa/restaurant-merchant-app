import * as React from "react";
import { useRoutes } from "react-router-dom";
import routes from "core/routes";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { LoadingText } from "core/components/loading";
import { chakraTheme } from "lib/theme/chakra-theme";

export const App = () => {
  const routesHere = useRoutes(routes);

  return (
    <>
      <ColorModeScript initialColorMode={chakraTheme.config.initialColorMode} />
      <ChakraProvider theme={chakraTheme}>
        <React.Suspense fallback={<LoadingText />}>{routesHere}</React.Suspense>
      </ChakraProvider>
    </>
  );
};
