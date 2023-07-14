import { Box, Container, Text, Tabs, TabList, Tab, TabPanels,TabPanel } from '@chakra-ui/react'
import React from 'react'
import Login from '../Components/Login'
import SingUp from '../Components/SingUp'

const HomePage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box d="flex"
      justifyContent="center"
      p={3}
      bg={"white"}
      w="100%"
      m="40px 0 15px 0"
      borderRadius={"lg"}
      borderWidth={"1px"}>
        <Text textAlign={"center"} fontSize={"4xl"} fontFamily="Work sans" _hover={{color : "Blue"}} color={"Black"}>Talk-A-Tive</Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
      <Tabs variant='soft-rounded' >
      <TabList mb="1em">
        <Tab width="50%">Login</Tab>
        <Tab width="50%">Sign Up</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Login/>
        </TabPanel>
        <TabPanel>
          <SingUp/>
        </TabPanel>
      </TabPanels>
    </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage