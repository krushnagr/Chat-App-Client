import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ChatPage = () => {
    const [chat, setchat] = useState([]);
    const featchdata = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/chat")
            setchat(data)
        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        featchdata();
    }, [])
    return (
        <h1>{chat.map((s) => (
            <li key={Math.random().toString()}>{s.chatName}</li>
        ))}</h1>
    )
}

export default ChatPage