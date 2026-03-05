import { HStack, Button, Box, Spacer } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import AddEventModal from "./AddEventModal";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // navigeren tussen de paginas  en de 'onclick' welke
  //navigeert naar de events page en contact p.

  const isEventsActive =
    location.pathname === "/" || location.pathname.startsWith("/events");

  const isContactActive = location.pathname.startsWith("/contact");

  return (
    <>
      <Box bg="white" shadow="sm" px={8}>
        <HStack py={4}>
          <Button
            borderRadius="full"
            fontWeight="medium"
            colorPalette="orange"
            variant={isEventsActive ? "solid" : "ghost"}
            onClick={() => navigate("/")}
          >
            Events
          </Button>

          <Button
            borderRadius="full"
            colorPalette="orange"
            onClick={() => setIsOpen(true)} // add event knop
          >
            Add Event
          </Button>

          <Spacer />

          <Button
            borderRadius="full"
            fontWeight="medium"
            colorPalette="orange"
            variant={isContactActive ? "solid" : "ghost"}
            onClick={() => navigate("/contact")}
          >
            Contact
          </Button>
        </HStack>
      </Box>

      <AddEventModal //opent de modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
