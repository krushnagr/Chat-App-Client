import React from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import Singlechat from './Singlechat';

const ChatBox = ({featchAgain,setfeatchAgain}) => {
  const {user,selectedChat} = ChatState();
  return (
    <Box
      display={{base : selectedChat ? "flex" : "none", md: "flex"}}
      alignItems={"center"}
      bg={"white"}
      flexDir={"column"}
      p={3}
      w={{base:"100%" ,md:"68%"}}
      borderRadius="lg"
      borderWidth="1px"
    >
      Single Chat
      
      <Box
        d="flex"
        flexDir="column"
        p={3}
        // bg="#F8F8F8"
        // bgImage={"https://as1.ftcdn.net/v2/jpg/03/27/51/56/1000_F_327515607_Hcps04aaEc7Ki43d1XZPxwcv0ZaIaorh.jpg"}
        
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        <Singlechat featchAgain = {featchAgain} setfeatchAgain = {setfeatchAgain}/>
      
    </Box>
    </Box>
    
    
    
  )
}

export default ChatBox