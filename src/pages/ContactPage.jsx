import { Box, Heading, Text, VStack } from "@chakra-ui/react";

export const ContactPage = () => {
    return (
        <VStack spacing={6} py={20} px={4}>
            <Box
                bg="white"
                p={10}
                borderRadius="2xl"
                shadow="md"
                textAlign="center"
                maxW="600px"
                w="100%"
            >
                <Heading mb={4} color="orange.500">
                    Contact
                </Heading>

                <Text fontSize="lg" color="gray.600">
                    This page is currently under construction.
                </Text>
            </Box>
        </VStack>
    );
};