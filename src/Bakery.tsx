import * as React from "react";
import { GiSlicedBread } from "react-icons/gi";
import { orderValues } from "./utils";
import { Modal } from "./Modal";
import {
  Text,
  VStack,
  Button,
  HStack,
  Radio,
  RadioGroup,
  useToast,
  SimpleGrid,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
} from "@chakra-ui/react";

type BreadShape = "Round" | "Pan";

interface Bread {
  breadType: string;
  breadShape: BreadShape;
}
interface Customer {
  customerId: number;
  order: Bread[];
}

// const mockCustomerExample1 = [
//   {
//     customerId: 0,
//     order: [
//       {
//         breadType: "Sourdough",
//         breadShape: "Round",
//       } as Bread,
//     ],
//   } as Customer,
//   {
//     customerId: 1,
//     order: [
//       {
//         breadType: "Whole grain",
//         breadShape: "Pan",
//       } as Bread,
//       {
//         breadType: "Banana",
//         breadShape: "Round",
//       } as Bread,
//     ],
//   } as Customer,
//   {
//     customerId: 2,
//     order: [
//       {
//         breadType: "Sourdough",
//         breadShape: "Pan",
//       } as Bread,
//       {
//         breadType: "Whole grain",
//         breadShape: "Round",
//       } as Bread,
//     ],
//   } as Customer,
// ];

// const mockCustomerExample2 = [
//   {
//     customerId: 0,
//     order: [
//       {
//         breadType: "Sourdough",
//         breadShape: "Round",
//       } as Bread,
//     ],
//   } as Customer,
//   {
//     customerId: 1,
//     order: [
//       {
//         breadType: "Sourdough",
//         breadShape: "Pan",
//       } as Bread,
//     ],
//   } as Customer,
// ];
// const mockBreadOfTheDay = ["Sourdough", "Whole grain", "Banana"];

export const Bakery = () => {
  const toast = useToast();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [makingTheseBreads, setMakingTheseBreads] = React.useState<any>([]);

  const [breadTypeInput, setBreadTypeInput] = React.useState<string>("");
  const handleSetBreadTypeInput = (event: any) =>
    setBreadTypeInput(event.target.value);
  const [breadType, setBreadType] = React.useState<string>("");
  const [breadShape, setBreadShape] = React.useState<BreadShape>("Pan");
  const [breadsOfTheDay, setBreadsOfTheDay] = React.useState<string[]>([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);

  function addAnotherBreadOrder(customerNew: Customer) {
    if (
      !customerNew.order.find(
        (bread: Bread) =>
          bread.breadShape === breadShape && bread.breadType === breadType
      )
    ) {
      if (!breadType) {
        toast({
          title: "Bread not selected",
          description: "Select a bread first",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      } else {
        let newOrders = [
          ...customerNew.order,
          {
            breadShape: breadShape,
            breadType: breadType,
          },
        ].sort(orderValues("breadType"));
        setCustomers(
          [
            ...customers.filter(
              (c: Customer) => c.customerId !== customerNew.customerId
            ),
            { ...customerNew, order: newOrders },
          ].sort(orderValues("customerId"))
        );
      }
    } else {
      toast({
        title: "Bread already ordered",
        description: "The customer already ordered this bread",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  const addBreadsOfTheDay = () => {
    if (!breadsOfTheDay.find((bread: string) => breadTypeInput === bread)) {
      if (!breadTypeInput) {
        toast({
          title: "Bread not valid",
          description: "Decide what a bread you will cook",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      } else {
        setBreadsOfTheDay([...breadsOfTheDay, breadTypeInput].sort());
        setBreadType(breadTypeInput);
      }
    } else {
      toast({
        title: "Bread already added",
        description: "You already added this bread today",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const calculateBatch = () => {
    let breadsToMake: Bread[] = [];
    let saveBread: any;

    customers.forEach((customer: Customer) => {
      if (
        customer.customerId >
          (customers.find((c: Customer) => c.order.includes(saveBread))
            ?.customerId ?? customer.customerId) &&
        !breadsToMake.includes(saveBread)
      )
        breadsToMake.push(saveBread);
      saveBread = {};
      if (customer.order.length > 1) {
        customer.order.forEach((bread: Bread) => {
          if (
            !breadsToMake.find((b: Bread) => b.breadType === bread.breadType)
          ) {
            saveBread = bread;
            for (let i = customer.customerId + 1; i < customers.length; i++) {
              if (
                customers[i].order.find(
                  (b: Bread) => b.breadType === bread.breadType
                )
              ) {
                if (
                  customers[i].order.find(
                    (b: Bread) =>
                      b.breadType === bread.breadType &&
                      b.breadShape === bread.breadShape
                  )
                ) {
                  breadsToMake.push(bread);
                } else {
                  for (let j = i; j < customers.length; j++) {
                    customers[i].order.forEach((l: Bread) => {
                      if (!breadsToMake.includes(l))
                        breadsToMake.push({
                          breadType: bread.breadType,
                          breadShape:
                            bread.breadShape === "Pan" ? "Round" : "Pan",
                        });
                    });
                  }
                }
              } else {
                breadsToMake.push(bread);
              }
            }
          }
        });
      } else {
        breadsToMake.push(customer.order[0]);
      }
    });

    const breadsToMakeClean = breadsToMake.reduce((acc: any, current) => {
      const x = acc.find(
        (item: any) =>
          item.breadType === current.breadType &&
          item.breadShape === current.breadShape
      );
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    setMakingTheseBreads(breadsToMakeClean);
    setIsOpen(true);
  };

  return (
    <VStack margin={16} spacing={16}>
      <HStack spacing={28}>
        <VStack spacing={4}>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<GiSlicedBread color="gray.300" />}
            />
            <Input
              variant="flushed"
              placeholder="Bread Type"
              value={breadTypeInput}
              onChange={handleSetBreadTypeInput}
            />
          </InputGroup>
          <Button onClick={addBreadsOfTheDay} colorScheme="yellow">
            Add Bread for the day
          </Button>

          <HStack>
            <SimpleGrid columns={3} spacing={4} alignItems="center">
              {breadsOfTheDay?.map((bread: string, index: number) => (
                <Text key={`${bread}${index}`}>
                  {bread}
                  {/* {index < breadsOfTheDay.length - 1 ? `${bread} | ` : bread} */}
                </Text>
              ))}
            </SimpleGrid>
          </HStack>
          {breadsOfTheDay.length > 0 && (
            <Box paddingTop={28}>
              <Button
                colorScheme="cyan"
                onClick={() => {
                  if (!breadType) {
                    toast({
                      title: "Bread not selected",
                      description: "Select a bread first",
                      status: "warning",
                      duration: 2000,
                      isClosable: true,
                    });
                  } else {
                    setCustomers(
                      [
                        ...customers,
                        {
                          customerId: customers.length + 1,
                          order: [
                            {
                              breadShape: breadShape,
                              breadType: breadType,
                            },
                          ],
                        },
                      ].sort(orderValues("customerId"))
                    );
                  }
                }}
              >
                Add New Customer
              </Button>
            </Box>
          )}
        </VStack>

        {breadsOfTheDay.length > 0 && (
          <VStack spacing={8}>
            <RadioGroup
              onChange={setBreadType}
              value={breadType}
              colorScheme="blue"
            >
              <Text>
                Select the bread type and the shape the customer wants:
              </Text>
              <Center>
                <HStack>
                  {breadsOfTheDay?.map((breadName: string) => (
                    <Radio key={breadName} value={breadName}>
                      {breadName}
                    </Radio>
                  ))}
                </HStack>
              </Center>
            </RadioGroup>

            <RadioGroup
              onChange={setBreadShape}
              value={breadShape}
              colorScheme="green"
            >
              <HStack>
                <Radio value="Pan">Pan</Radio>
                <Radio value="Round">Round</Radio>
              </HStack>
            </RadioGroup>
            <SimpleGrid columns={4} spacing={8} alignItems="center">
              {customers.map((person: Customer) => {
                return (
                  <React.Fragment key={person.customerId}>
                    <VStack>
                      <Text>Customer {person.customerId}</Text>
                      {person.order.map((bread: Bread) => (
                        <Text
                          key={`${bread.breadType}${bread.breadShape}${person.customerId}`}
                        >
                          {bread.breadType} {bread.breadShape}
                        </Text>
                      ))}
                    </VStack>
                    <VStack>
                      <Button onClick={() => addAnotherBreadOrder(person)}>
                        Add Another Bread
                      </Button>
                    </VStack>
                  </React.Fragment>
                );
              })}
            </SimpleGrid>
          </VStack>
        )}
      </HStack>
      {customers.length > 0 && (
        <Button colorScheme="orange" onClick={calculateBatch}>
          Calculate Batch
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        message={makingTheseBreads}
      />
    </VStack>
  );
};
