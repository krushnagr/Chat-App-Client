import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from './config/ChatLogic';
import ProfileModule from './miscellaneous/ProfileModule';
import UpdateGroupName from './miscellaneous/UpdateGroupName';
import axios from 'axios';
import ScrolbarChat from './ScrolbarChat';
import {io} from "socket.io-client"
const ENDPOINT = "http://localhost:5000";
var socket,selectedChatCompare;


const Singlechat = ({featchAgain,setfeatchAgain}) => {
    const {user, selectedChat, setselectedChat,notification, setnotification} = ChatState();

    const [loading,setLoading] = useState(false);
    const [socketConneted,setsocketConneted] = useState(false);
    const [newMessage,setnewMessage] = useState("");
    const [Message,setMessage] = useState([]);
    const [typeing,settypeing] = useState(false);
    const [Istypeing,setIstypeing] = useState(false);
    const toast = useToast();

    

    const sendMessage = async(e) =>{
      if (e.key === "Enter" && newMessage){
        socket.emit("stop typing",selectedChat._id)
        try{
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          setnewMessage("");
          const {data} = await axios.post("https://chat-app-server-v2wu.onrender.com/api/message",{
            "content" : newMessage,
            "chatId" : selectedChat
          },config);
          socket.emit("new message",data);
          setMessage([...Message, data]);
        }
        catch(err){
          toast({
            title: "Error Occured!",
            description: `${err.message}`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          })
        }
      }
      
    }

    const fetchmessage = async(e) =>{
      if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `https://chat-app-server-v2wu.onrender.com/api/message/${selectedChat._id}`,
        config
      );
      setMessage(data);
      // console.log(data);
      setLoading(false);
      socket.emit("join chat",selectedChat._id);
      } 
      catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
    useEffect(()=>{
      socket = io(ENDPOINT);
      socket.emit("setup",user);
      socket.on("connected",()=>{
        setsocketConneted(true);
      }
      )
      socket.on("typing",()=>setIstypeing(true))
      socket.on("stop typing",()=>setIstypeing(false))
    })
    useEffect(()=>{
      fetchmessage();

      selectedChatCompare = selectedChat
      // eslint-disable-next-li
    },[selectedChat])

    useEffect(() => {
      socket.on("message recieved", (newMessageRecieved) => {
        if (
          !selectedChatCompare || // if chat is not selected or doesn't match current chat
          selectedChatCompare._id !== newMessageRecieved.chat._id
        ) {
          if (!notification.includes(newMessageRecieved)) {
            setnotification([newMessageRecieved, ...notification]);
            // setFetchAgain(!fetchAgain);
          }
        } else {
          setMessage([...Message, newMessageRecieved]);
        }
      });
    });

    const typingHandler = (e)=>{
      setnewMessage(e.target.value);
      // console.log(newMessage);
       if(!socketConneted)return;

       if(!typeing){
        settypeing(true);
        socket.emit("typing",selectedChat._id)
       }

       let lastTypingTime = new Date().getTime();
       var timerlength = 3000;
       setTimeout(()=>{
        var timeNow = new Date().getTime();
        var timedeff= timeNow - lastTypingTime;
        if(timedeff>=timerlength && typeing){
          socket.emit("stop typing",selectedChat._id);
          settypeing(false)
        }
       },timerlength)
    }
    
  return (
    <>
        {
            selectedChat?(
            <>
                <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setselectedChat("")}
            />
            {!selectedChat.isGroupChat? (
                <>
                    {getSender(user,selectedChat.users)}
                    <ProfileModule user = {getSenderFull(user,selectedChat.users)}/>
                </>
            ):(
                <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupName featchAgain={featchAgain} setfeatchAgain={setfeatchAgain}/>
                </>
            )}
          </Text>
          <Box 
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg="#E8E8E8"
            w={"100%"}
            h={"90%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading?(
              <Spinner size="xl"
              w={20}
              h={20}
              alignSelf="center"
              margin="auto"/>
            ):(<>
                <div>
                  <ScrolbarChat message={Message}/>
                </div>
            </>)}
            {Istypeing?<div>loading...</div>:<></>}
            <FormControl display={"flex"}
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"full"}
            >
              
            <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                // mb={"40px"}
                
              />
              <ArrowRightIcon/>
              </Stack>
            </FormControl>
          </Box>
            </>):(
                <Box display={"flex"} alignItems={"center"}justifyContent={"center"} h={"100%"} >
                    <Text fontSize={"3xl"} fontFamily={"work sans"} pb={3}
                    >Click on the user to start chatting</Text>
                    {/* <video autoPlay loop muted>
                    <source src="./sticker.mp4" type="video/mp4" />
                    </video> */}
                </Box>
            )
        }
    </>
  )
}

export default Singlechat
