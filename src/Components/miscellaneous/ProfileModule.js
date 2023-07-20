import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'

const ProfileModule = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
       {children?(<span onClick={onOpen}>{children}</span>) :(
        <IconButton 
        display={{base : "flex"}}
        icon={<ViewIcon/>}
        onClick={onOpen}/>
        ) }  


      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent >
          <ModalHeader
            fontSize="40px"
            fontFamily="work"
            display="flex"
            justifyContent="center"
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
          p={"5px"}
          m={"5px"}
          flexDir={"column"}>
          
            <Image
                borderRadius="full"
                boxSize="150px"
                src = {user.pic}
                alt={user.name}
            />
            <div style={{"marginTop" : "5px"}}>{user.email}</div>
            </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModule