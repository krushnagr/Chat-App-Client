import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [selectedChat, setselectedChat] = useState();
  const [chat, setchat] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // if(userInfo.data==="undefined"){
    //   setUser(userInfo.data)
    // }else{
      setUser(userInfo);
    // }
    

    if (!userInfo) navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser,selectedChat, setselectedChat,chat, setchat }}>{children}</ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
