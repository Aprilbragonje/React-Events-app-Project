import { Outlet } from "react-router-dom"; //react router gebruikt
import { Navigation } from "./Navigation";
import { Box, Container } from "@chakra-ui/react";

export const Root = () => {
  return (
    <Box bg="#f3efe8" minH="100vh">
      <Navigation />

      <Container maxW="container.lg" py={10}>
        <Outlet />
      </Container>
    </Box>
  );
};
