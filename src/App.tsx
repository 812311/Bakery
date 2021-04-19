import * as React from "react";
import { ChakraProvider, Box, Grid, theme } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Bakery } from "./Bakery";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3} gridTemplateColumns="repeat(1, 3fr) 0.2fr">
          <Bakery />
          <ColorModeSwitcher justifySelf="flex-end" />
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
