import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvtar/UserListItem';
import Groupmemb from '../UserAvtar/Groupmemb';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setselecteUsers] = useState([]);
  const [serch, setserch] = useState();
  const [serchresult, setserchresult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chat, setchat } = ChatState();

  const handelSerch = async (query) => {
    if (!query) return;
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.get(`http://localhost:5000/api/user?search=${query}`, config);
      setserchresult(data);
      // console.log(serchresult);
      setLoading(false);
    }
    catch (err) {
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

  const handelGroup = (usertoAdd) => {
    if (selectedUsers.includes(usertoAdd)) {
      toast({
        title: "User already selected!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return
    }
    setselecteUsers([...selectedUsers, usertoAdd])
    console.log(selectedUsers);
  }

  const handleDelete = (deluser) =>{
      setselecteUsers(selectedUsers.filter((s)=>s._id!==deluser._id));
  }

  const handelSubmit = async() =>{
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please Filled all the fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
      
      try{
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
        const {data} = await axios.post("http://localhost:5000/api/chat/group",{
          name : groupChatName,
          users : JSON.stringify(selectedUsers.map((u) =>u._id))
        },config)
        setchat([data, ...chat])
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        onClose();
      }
      catch(err){
        setLoading(false);
        toast({
          title: "An Error Occured!",
          description : `${err.message}`,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            justifyContent={"center"}
            fontSize={"35px"}
            fontFamily={"work sans"}
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: shekhar, shaunak, krushna"
                mb={1}
                onChange={(e) => handelSerch(e.target.value)}
              />
            </FormControl>

            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <Groupmemb
                  user={u}
                handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              serchresult
                ?.slice(0, 4)
                .map((users) => (
                  <UserListItem
                    id={user._id}
                    user={users}
                    handleFunction={() =>
                      handelGroup(users)
                    }
                  />
                ))
            )}
            
          </ModalBody>

          <ModalFooter>
            <Button isLoading={loading} colorScheme='blue' mr={3} onClick={handelSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal