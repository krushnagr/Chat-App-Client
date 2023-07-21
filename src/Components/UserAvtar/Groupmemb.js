import { CloseIcon } from '@chakra-ui/icons'
import { Badge } from '@chakra-ui/react'
import React from 'react'

const Groupmemb = ({user,handleFunction}) => {
  return (
    <Badge variant="solid" 
    backgroundColor={"#8e5ad5"} 
    borderRadius="lg" m={"5px"} p={"5px"} 
    colorScheme='purple'
    onClick={handleFunction}
    >
      {user.name}
      <CloseIcon cursor={"pointer"} pl={1} ml={1} mb={1}/>
    </Badge>
  )
}

export default Groupmemb