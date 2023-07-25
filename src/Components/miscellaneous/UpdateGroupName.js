import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import Groupmemb from '../UserAvtar/Groupmemb'
import axios from 'axios'
import UserListItem from '../UserAvtar/UserListItem'

const UpdateGroupName = (fetchAgain, setfeatchAgain) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {user , selectedChat,setselecteUsers, setselectedChat} = ChatState();
    const toast = useToast();

    const [groupChatName,setGroupChatName] = useState();
    const [RenameLoading,setRenameLoading] = useState(false);
    const [Loading,setLoading] = useState(false);
    const [serchresult,setserchresult] = useState([]);

    const handleRename =async () =>{
        if (!groupChatName) {
          toast({
            title: "Please rename the group!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          })
          return
        }
        try {
          setRenameLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const {data} = await axios.put("http://localhost:5000/api/chat/rename",{
            chatId: selectedChat._id,
            chatName : groupChatName
          },config)
          setselectedChat(data);
          setRenameLoading(false);
          // setfeatchAgain(!fetchAgain);
          toast({
            title: "renaming succesful!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          })
        } 
        catch (error) {
          toast({
            title: "Error in renaming!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          })
          console.log(error.message);
        }
    }

    const handleRemove = async(user1) =>{
      if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
        toast({
          title: "Only admins can remove someone!",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
  
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          `http://localhost:5000/api/chat/groupremove`,
          {
            chatId: selectedChat._id,
            userId: user1._id,
          },
          config
        );
  
        user1._id === user._id ? setselectedChat() : setselectedChat(data);
        // setFetchAgain(!fetchAgain);
        // fetchMessages();
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
      setGroupChatName("");
    }

    const handleSearch = async(query)=>{
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
      setLoading(false)
    }
    }

    const handleAddUser =async (uset) =>{
        if (selectedChat.users.find((u) => u._id === uset._id)) {
          toast({
            title: "User Already in group!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          })
          return
        }
        if (selectedChat.groupAdmin._id !==user._id) {
          console.log(user._id);
          console.log(selectedChat.groupAdmin._id);
          toast({
            title: "Only admins can add someone!",
            status: "loading",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          })
          return
        }
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `http://localhost:5000/api/chat/groupadd`,
            {
              chatId: selectedChat._id,
              userId: uset._id,
            },
            config
          );

          setselectedChat(data);
          // setfeatchAgain(!fetchAgain);
          setLoading(false);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        }
    }

    return (
      <>
        <IconButton onClick={onOpen} icon={<ViewIcon/>}/>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
                justifyContent={"center"}
                fontFamily="Work sans"
                fontSize={"35px"}
                display={"flex"}
            >{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
                {selectedChat.users.map((u) => (
                    <Groupmemb
                    user={u}
                    //   admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                    />
                ))}
                </Box>
                <FormControl display="flex">
                <Input
                placeholder={selectedChat.chatName}
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                onClick={handleRename}
                isLoading={RenameLoading}
              >
                Update
              </Button>
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="Add User to group"
                    mb={1}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
            </FormControl>
            {Loading ? (
              <Spinner size='sm' />
            ) : (
              serchresult?.slice(0, 4).map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
            </ModalBody>
  
            <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default UpdateGroupName