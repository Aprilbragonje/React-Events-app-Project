import {
  Dialog,
  Button,
  Input,
  Textarea,
  Checkbox,
  Stack,
  Box,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "../components/ui/toaster";
import { useEvents } from "../context/EventsContext";
import { useNavigate } from "react-router-dom"; //feedb punt 5  router navig toegevoed

const AddEventModal = ({ isOpen, onClose }) => {
  const { addEvent, categories } = useEvents();
  const navigate = useNavigate(); //feedb punt 5 navigate hook toegevoegd

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // add/remove Catogorie van lijst
  const toggleCategory = (id, checked) => {
    if (checked) {
      setCategoryIds((prev) => {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      });
    } else {
      setCategoryIds((prev) => prev.filter((c) => c !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSaving(true);

    const eventData = {
      createdBy: 1,
      title: title,
      description: description,
      image: image,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      categoryIds: categoryIds.map(Number),
    };

    try {
      const savedEvent = await addEvent(eventData); // feedb punt 5 veranderd van áwait addEvent...." naar dit savedEvent gebruiken.

      toaster.success({
        //notificatie
        title: "Event created",
        description: "The event was successfully added.",
      });

      // clear form mooier ux
      setTitle("");
      setDescription("");
      setImage("");
      setStartTime("");
      setEndTime("");
      setCategoryIds([]);

      onClose();

      navigate(`/events/${savedEvent.id}`); // feedb punt 5  direct naar detailpagina
    } catch (err) {
      toaster.error({
        title: "Error",
        description: err.message,
      });
    }

    setIsSaving(false);
  };

  return (
    <Dialog.Root
      open={isOpen} //event toevoegen via een modal
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          p={6}
          bg="white"
          color="gray.800"
          borderRadius="xl"
          boxShadow="xl"
        >
          <Dialog.Header>
            <Dialog.Title>Add New Event</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <form onSubmit={handleSubmit}>
              <Box mb={3}>
                <Text mb={1}>Title</Text>
                <Input //form met velden
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Box>

              <Box mb={3}>
                <Text mb={1}>Description</Text>
                <Textarea
                  required //required tags voor de velden
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Box>

              <Box mb={3}>
                <Text mb={1}>Image URL</Text>
                <Input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </Box>

              <Box mb={3}>
                <Text mb={1}>Start Time</Text>
                <Input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </Box>

              <Box mb={3}>
                <Text mb={1}>End Time</Text>
                <Input
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </Box>

              <Box mb={3}>
                <Text mb={2}>Categories</Text>
                <Stack>
                  {categories.map((cat) => (
                    <Checkbox.Root
                      key={cat.id}
                      checked={categoryIds.includes(cat.id)}
                      onCheckedChange={(details) =>
                        toggleCategory(cat.id, !!details.checked)
                      }
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>{cat.name}</Checkbox.Label>
                    </Checkbox.Root>
                  ))}
                </Stack>
              </Box>

              <Dialog.Footer mt={4}>
                <Button
                  type="submit"
                  colorPalette="orange"
                  isLoading={isSaving}
                >
                  Save Event
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default AddEventModal;
