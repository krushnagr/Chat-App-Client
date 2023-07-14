import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import {useNavigate} from "react-router-dom"

const SingUp = () => {
const [name, setname] = useState();
const [email, setemail] = useState();
const [passward, setpassward] = useState();
const [conformpassward, setconformpassward] = useState();
const [show, setshow] = useState(false);
const [pic, setpic] = useState(false);
const [loading, setloading] = useState(false);
const toast = useToast()
const navigate = useNavigate();



const handelClick = ()=>{
  setshow(!show)
}

const postDetails = (pics) =>{
  setloading(true);
  // if(pics === undefined){
  //   toast({
  //     title : "Please Select an image!",
  //     status : "warning",
  //     duration : 5000,
  //     isClosable : true,
  //     position : "bottom"
  //   })
  //   return;
  // }

  if(pics.type === "image/jpeg" || pics.type === "image/png"){
    const data = new FormData();
    data.append("file", pics);
      data.append("upload_preset", "Chat-App");
      data.append("cloud_name", "dm9j31pku");
      fetch("https://api.cloudinary.com/v1_1/dm9j31pku/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setpic(data.url.toString());
          console.log(data.url.toString());
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        });
        toast({
          title : "Image Add Succesfully!",
          status : "success",
          duration : 5000,
          isClosable : true,
          position : "bottom"
        });
    // console.log(data);
  }
  // else{
  //   toast({
  //     title : "Please Select an image!",
  //     status : "warning",
  //     duration : 5000,
  //     isClosable : true,
  //     position : "bottom"
  //   });
  //   setloading(false);
  //   return;
  // }
  setloading(false);
    return;
}

const submitHandler = async() => {
  setloading(true);
  if(!name || !email || !passward || !conformpassward){
    toast({
      title : "Please Fill all the Feilds",
      status : "warning",
      duration : 5000,
      isClosable: true,
      position : "bottom"
    })
    setloading(false);
    return;
  }
  if(passward !== conformpassward){
    toast({
      title : "Password Do Not Match",
      status : "warning",
      duration : 5000,
      isClosable: true,
      position : "bottom"
    });
    setloading(false);
    return;
  }
  try{
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    
    const {data} = await axios.post("http://localhost:5000/api/user",
    {name,email,password: passward, pic},config);
    toast({
      title : "Registration Successfull", 
      status : "success",
      duration : 5000,
      isClosable: true,
      position : "bottom"
    });
    localStorage.setItem('userInfo',JSON.stringify(data));
    setloading(false);
    navigate("/chats");
  }catch(err){
    toast({
      title : "Error Occured!",
      status : "error",
      duration : 5000,
      isClosable: true,
      position : "bottom"
    });
    setloading(false);
    console.log(err);
  }
}

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter your Name"
        onChange={(e)=>setname(e.target.value)}/>
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder="Enter your Email"
        onChange={(e)=>setemail(e.target.value)}/>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>passward</FormLabel>
        <InputGroup>
        <Input type={show ? 'text': 'password'}
        placeholder="Enter your Passward"
        onChange={(e)=>setpassward(e.target.value)}/>
        <InputRightElement width="4.5rem">
          <Button onClick={handelClick} h="1.75rem" size="sm">
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="conformpassword" isRequired>
        <FormLabel>conformpassward</FormLabel>
        <InputGroup>
        <Input type={show ? 'text': 'password'}
        placeholder="Enter your ConformPassward"
        onChange={(e)=>setconformpassward(e.target.value)}/>
        <InputRightElement width="4.5rem">
          <Button onClick={handelClick} h="1.75rem" size="sm">
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input type = "file"
        p={1.5}
        accept='image/*'
        onChange={(e)=>postDetails(e.target.files[0])}/>
      </FormControl>

      <Button 
      // colorScheme='blue'
      backgroundColor="black"
      color="white"
      _hover={{backgroundColor : "#4140d1"}}
      width="100%"
      style={{marginTop : 15}}
      isLoading = {loading}
      onClick={submitHandler}>SignUp</Button>
    </VStack>
  )
}

export default SingUp