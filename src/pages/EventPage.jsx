import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Badge,
  Button,
  Input,
  Textarea,
  Dialog,
  Checkbox,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import { toaster } from "../components/ui/toaster";
import { useState } from "react";

export const EventPage = () => {
  //Event datails tonen
  const { id } = useParams(); // react router event ophalen
  const navigate = useNavigate();
  const { events, categories, updateEvent, deleteEvent } = useEvents();

  const event = events.find((e) => e.id === Number(id)) ?? null;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  if (!event) {
    return (
      <VStack py={20}>
        <Heading size="lg">Event not found.</Heading>
      </VStack>
    );
  }

  const openEdit = () => {
    setFormData({
      ...event,
      startTime: event.startTime.slice(0, 16),
      endTime: event.endTime.slice(0, 16),
    });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    try {
      const updated = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      await updateEvent(updated);

      setIsEditOpen(false);

      toaster.success({
        title: "Event updated",
        description: "Changes saved successfully.",
      });
    } catch (error) {
      toaster.error({
        title: "Error",
        description: error?.message || "Update failed.",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(event.id);

      setIsDeleteOpen(false);

      toaster.success({
        //notificaties succes of failure
        title: "Event deleted",
        description: "The event was successfully removed.",
      });

      navigate("/"); // redirect naar events page
    } catch (error) {
      toaster.error({
        title: "Error",
        description: error?.message || "Delete failed.",
      });
    }
  };

  const toggleCategory = (id) => {
    // feedb punt 3  categorie is nu bewerkbaar
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds?.includes(id)
        ? prev.categoryIds.filter((catId) => catId !== id)
        : [...(prev.categoryIds ?? []), id],
    }));
  };

  return (
    <VStack spacing={6} py={10}>
      <Button // feedb punt 4 terug knop vanuit deze pagina.
        alignSelf="flex-start"
        colorPalette="gray"
        borderRadius="full"
        onClick={() => navigate("/")}
      >
        ← Back to events
      </Button>

      <Box
        bg="white"
        borderRadius="2xl"
        overflow="hidden"
        shadow="md"
        maxW="800px"
        w="100%"
      >
        <Image
          src={event.image}
          alt={event.title}
          objectFit="cover"
          w="100%"
          h="350px"
        />

        <Box p={6}>
          <Heading mb={3}>{event.title}</Heading>

          <Text mb={4}>{event.description}</Text>

          <Text fontSize="sm" color="gray.500" mb={4}>
            {new Date(event.startTime).toLocaleString()} —{" "}
            {new Date(event.endTime).toLocaleString()}
          </Text>

          <HStack spacing={2} mb={6}>
            {event.categoryIds?.map((catId) => {
              const category = categories.find((cat) => cat.id === catId);

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

          <HStack spacing={4}>
            <Button //edit event knop
              colorPalette="blue"
              borderRadius="full"
              onClick={openEdit}
            >
              Edit Event
            </Button>

            <Button // delete knop
              colorPalette="red"
              borderRadius="full"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete Event
            </Button>
          </HStack>
        </Box>
      </Box>

      <Dialog.Root
        open={isEditOpen} //edit formulier
        onOpenChange={(e) => setIsEditOpen(e.open)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edit Event</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              {formData && (
                <VStack spacing={4}>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />

                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />

                  <Input
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />

                  <Input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startTime: e.target.value,
                      })
                    }
                  />

                  <Input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endTime: e.target.value,
                      })
                    }
                  />

                  <VStack align="start" w="100%">
                    {categories.map(
                      (
                        category, // feedb punt 3  categorie toevoegen of verwijderen bij bewerken
                      ) => (
                        <Checkbox.Root
                          key={category.id}
                          checked={formData.categoryIds?.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                          <Checkbox.Label>{category.name}</Checkbox.Label>
                        </Checkbox.Root>
                      ),
                    )}
                  </VStack>
                </VStack>
              )}
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>

              <Button colorPalette="blue" onClick={handleSave}>
                Save Changes
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      <Dialog.Root
        open={isDeleteOpen} //confirm dialog
        onOpenChange={(e) => setIsDeleteOpen(e.open)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete Event</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              Are you sure you want to delete this event?
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>

              <Button colorPalette="red" onClick={handleDelete}>
                Yes, Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </VStack>
  );
};
