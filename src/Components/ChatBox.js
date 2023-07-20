import React from 'react'
import { ChatState } from '../context/ChatProvider';

const ChatBox = () => {
  const {user} = ChatState();
  return (
    <h1>{user.name}</h1>
  )
}

export default ChatBox