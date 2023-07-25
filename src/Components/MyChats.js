import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import ChatLoading from './ChatLoading';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from './config/ChatLogic';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = (featchAgain) => {
  const [loggedUser, setloggedUser] = useState();
  const {user,selectedChat, setselectedChat,chat, setchat} = ChatState();

  const toast = useToast();

  const featchChats = async () =>{
    try{
      const config = {
        headers : {
          Authorization : `Bearer ${user.token}`,
        }
      }
      const {data} = await axios.get("http://localhost:5000/api/chat",config);
      // console.log(data);
      setchat(data);
    }
    catch(err){
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  useEffect(()=>{
    
    setloggedUser(JSON.parse(localStorage.getItem("userInfo")))
    featchChats();
    // eslint-disable-next-line
  },[])

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      // justifyContent={"center"}
      p={3}
      bg="white"
      width={{ base: "full", lg: "31%", md: "35%"}}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "25px", md: "28px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "15px", md: "8px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        // bg="#F8F8F8"
        bgImage={"https://img.freepik.com/free-vector/coloured-pattern-design_1224-139.jpg?w=740&t=st=1689791519~exp=1689792119~hmac=81e43588fd59564d03ad54e3329f6ff8ac39fe3f2eca2cd784e4660e566dddb0"}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chat ? (
          <Stack overflowY="scroll">
            {chat.map((chat) => (
              <Box
                onClick={() => setselectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#b0e1c1"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats