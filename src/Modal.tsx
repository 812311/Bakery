import * as React from "react";
import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  VStack,
  Text,
} from "@chakra-ui/react";
export const Modal = ({ onClose, isOpen, message, ...prosp }: any) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={undefined}
      onClose={() => onClose()}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Breads to make
          </AlertDialogHeader>

          <AlertDialogBody>
            <VStack spacing={4}>
              {message?.map((bread: any, index: number) => (
                <Text
                  key={index}
                >{`${bread.breadType} ${bread.breadShape}`}</Text>
              ))}
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button colorScheme="red" onClick={() => onClose()} ml={3}>
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
