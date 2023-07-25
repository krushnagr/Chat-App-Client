// import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../Components/miscellaneous/SideDrawer';
import ChatBox from '../Components/ChatBox';
import MyChats from '../Components/MyChats';

const ChatPage = () => {
    const {user} = ChatState();
    const [featchAgain,setfeatchAgain] = useState(false);
    return (
        <div style={{width : "100%"}}>
            {user && <SideDrawer/>}
            <Box
            display={"Flex"}
            justifyContent={"space-between"}
            w="100%" h="91.5vh" p="10px">
                {user && <MyChats featchAgain = {featchAgain}/>}
                {user && <ChatBox featchAgain = {featchAgain} setfeatchAgain = {setfeatchAgain}/>}
            </Box>
        </div>
    )
}

export default ChatPage