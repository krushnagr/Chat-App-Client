import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setemail] = useState();
  const [passward, setpassward] = useState();
  const [conformpassward, setconformpassward] = useState();
  const [show, setshow] = useState(false);
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handelClick = () => {
    setshow(!show)
  }


  const submitHandler = async () => {
    setloading(true);
    if (!email || !passward || !conformpassward) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setloading(false);
      return;
    }
    if (passward !== conformpassward) {
      toast({
        title: "Password Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setloading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const user = await axios.post("https://chat-app-server-v2wu.onrender.com/api/user/login", { email, password: passward }, config);
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // console.log(user);
      localStorage.setItem("userInfo", JSON.stringify(user.data));

      setloading(false);
      navigate("/chats")
    }
    catch (err) {
      toast({
        title: "An Error Occured!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setloading(false);
      console.log(err.message);
    }
  }

  return (
    <VStack spacing="5px">

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder="Enter your Email"
          onChange={(e) => setemail(e.target.value)} />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>passward</FormLabel>
        <InputGroup>
          <Input type={show ? 'text' : 'password'}
            placeholder="Enter your Passward"
            onChange={(e) => setpassward(e.target.value)} />
          <InputRightElement width="4.5rem">
            <Button onClick={handelClick} h="1.75rem" size="sm">
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>conformpassward</FormLabel>
        <InputGroup>
          <Input type={show ? 'text' : 'password'}
            placeholder="Enter your ConformPassward"
            onChange={(e) => setconformpassward(e.target.value)} />
          <InputRightElement width="4.5rem">
            <Button onClick={handelClick} h="1.75rem" size="sm">
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        // colorScheme='blue'
        backgroundColor="black"
        color="white"
        _hover={{ backgroundColor: "#4140d1" }}
        width="100%"
        style={{ marginTop: 15 }}
        isLoading={loading}
        onClick={submitHandler}>Login</Button>
    </VStack>
  )
}

export default Login