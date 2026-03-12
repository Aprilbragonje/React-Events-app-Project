import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Badge,
  Input,
  SimpleGrid,
  Skeleton,
  Checkbox,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEvents } from "../context/EventsContext";

export const EventsPage = () => {
  const { events, categories, loading, error } = useEvents(); // event ophalen via context

  const [searchTerm, setSearchTerm] = useState(""); // zoek functie
  const [selectedCategories, setSelectedCategories] = useState([]);

  if (error) {
    return (
      <Heading p={10} color="red.500">
        {error}
      </Heading>
    );
  }

  const handleCategoryChange = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id],
    );
  };

  const filteredEvents = (events || [])
    .filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((event) =>
      selectedCategories.length === 0
        ? true
        : selectedCategories.every((catId) =>
            event.categoryIds?.includes(catId),
          ),
    );

  return (
    <VStack spacing={10} py={10} px={4}>
      <Box w="100%" maxW="600px">
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          borderRadius="full"
          bg="white"
        />
      </Box>

      <HStack spacing={6} wrap="wrap">
        {(categories ?? []).map((category) => (
          <Checkbox.Root
            key={category.id}
            checked={selectedCategories.includes(category.id)}
            onCheckedChange={() => handleCategoryChange(category.id)}
          >
            <Checkbox.HiddenInput />

            <Checkbox.Control
              borderColor="orange.500"
              _checked={{
                bg: "orange.500",
                borderColor: "orange.500",
              }}
            />

            <Checkbox.Label color="gray.800" fontWeight="medium">
              {category.name}
            </Checkbox.Label>
          </Checkbox.Root>
        ))}
      </HStack>

      {loading ? ( //feeedb punt 1 en 2 kolommen toegevoegd en skeleton loading, nu zie je een loading UI ipv alleen tekst.
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="100%">
          {[1, 2, 3].map((i) => (
            <Box key={i} bg="white" borderRadius="2xl" overflow="hidden" p={4}>
              <Skeleton height="220px" mb={4} />
              <Skeleton height="20px" mb={2} />
              <Skeleton height="16px" mb={2} />
              <Skeleton height="16px" />
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="100%">
          {filteredEvents.map(
            (
              event, // events tonen op de pagina
            ) => (
              <Link
                key={event.id} //klikbaar maken event
                to={`/events/${event.id}`}
                style={{ width: "100%", textDecoration: "none" }}
              >
                <Box
                  bg="white"
                  borderRadius="2xl"
                  overflow="hidden"
                  shadow="sm"
                  transition="all 0.25s ease"
                  _hover={{ shadow: "xl", transform: "translateY(-6px)" }}
                >
                  <Image
                    src={event.image}
                    alt={event.title}
                    objectFit="cover"
                    h="220px"
                    w="100%"
                  />

                  <Box p={6}>
                    <Heading size="md" mb={2} color="gray.800">
                      {event.title}
                    </Heading>

                    <Text fontSize="sm" color="gray.600" mb={3}>
                      {event.description}
                    </Text>

                    <Text fontSize="xs" color="gray.500" mb={4}>
                      {new Date(event.startTime).toLocaleString()} —{" "}
                      {new Date(event.endTime).toLocaleString()}
                    </Text>

                    <HStack spacing={2} wrap="wrap">
                      {event.categoryIds?.map((catId) => {
                        const category = categories.find(
                          //Catogories
                          (cat) => cat.id === catId,
                        );

                        return (
                          <Badge
                            key={catId}
                            px={3}
                            py={1}
                            borderRadius="full"
                            bg="orange.100"
                            color="orange.700"
                          >
                            {category?.name}
                          </Badge>
                        );
                      })}
                    </HStack>
                  </Box>
                </Box>
              </Link>
            ),
          )}
        </SimpleGrid>
      )}

      {!loading && filteredEvents.length === 0 && (
        <Text color="gray.500">No events found.</Text>
      )}
    </VStack>
  );
};
