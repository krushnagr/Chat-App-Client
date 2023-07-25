import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Menu, MenuButton, MenuList,MenuItem, Text, Tooltip, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure, Input, useToast, Spinner } from '@chakra-ui/react'
import React, {  useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import ProfileModule from './ProfileModule';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvtar/UserListItem';
import { getSender } from '../config/ChatLogic';

const SideDrawer = () => {
  const [serch,setserch] = useState("");
  const [loading,setloading] = useState(false)
  const [loadingChat,setloadingChat] = useState(false)
  const [serchdata, setserchdata] = useState([]);

  const {user, setselectedChat,chat, setchat,notification, setnotification} = ChatState();
  const navigate = useNavigate();
  const btnRef = React.useRef();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handelLogout = () =>{
    localStorage.removeItem("userInfo");
    navigate("/")
  }

  const hendelsearch =async () =>{
    if(!serch){
      toast({
        title: "Please Enter something in serch",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      });
      return;
    }
    try{
        setloading(true);
        const config = {
          headers : {
            Authorization : `Bearer ${user.token}`,
          }
        };
        const {data} = await axios.get(`http://localhost:5000/api/user?search=${serch}`,config);
        setserchdata(data);
        // console.log(serchdata);
        setloading(false);
    }catch(err){
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  

  const accessChat = async(userId) =>{
      try{
        setloadingChat(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const {data} = await axios.post("http://localhost:5000/api/chat",{userId},config);
        if(!chat.find((c)=> c._id === data._id))setchat([data,...chat])
        setselectedChat(data);
        // console.log(data);
        setloadingChat(false);
        onClose()
      }
      catch (err){
        toast({
          title: "Error in featching the Chat!",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        setloadingChat(false);
      }
  }

  return (
    <>
    <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
    >
        <Tooltip label="Search the user" hasArrow placement='bottom-end'>
            <Button onClick={onOpen} variant={"ghost"}>
            <i className="fas fa-search"></i>
            <Text  display = {{base : "none", md : "flex"}} px="4">
                Serch User
            </Text>
            </Button>
        </Tooltip>
        <Text fontSize={{ base: "20px", md: "20px", lg: "2xl" }} fontFamily="work sans">ChatUP</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1}/>
            </MenuButton>
            <MenuList pl={2} cursor={"pointer"}>
              {!notification.length && "No new Messages"}
              {notification.map((notify)=>(
                <menuItem key={notify._id} onClick={()=>{
                  setselectedChat(notify.chat)
                  setnotification(notification.filter((n)=> n !==notify))
                }}>
                  {
                      notify.chat.isGroupChat? `New Message in ${notify.chat.chatName}`
                      : `New Message from ${getSender(user,notify.chat.users)}`
                  }
                </menuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
            </MenuButton>
            <MenuList >
              <ProfileModule user = {user}>
                  <MenuItem>My profile</MenuItem>
              </ProfileModule>
              <MenuItem onClick={handelLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
    </Box>

    <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Search User</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input placeholder='serch by name or email'
              mr={2}
              value={serch} 
              onChange={(e)=>setserch(e.target.value)}/>
              <Button variant='outline' mr={3} 
              onClick={hendelsearch}
              >
                GO
              </Button>
              
            </Box>
            {
                loading ? (
                  <ChatLoading/>
                ):(
                  serchdata && serchdata.map((s)=>(
                    <UserListItem
                    key = {user._id}
                    user={s}
                    handleFunction={()=>accessChat(s._id)}
                    />
                  ))
                )
              }
              {loadingChat && <Spinner ml='auto' d = 'flex'/> }
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer