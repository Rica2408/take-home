import { TextField, Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';

import {
  useMutation
} from '@tanstack/react-query'
import axios from "axios";
import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';

type Error = {
  name?: {
    error: boolean,
    message: string
  },
  email?: {
    error: boolean,
    message: string
  },
}

const emailRegex =
 new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");
const LogIn = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState<Error>()
  const navigate = useNavigate()
  const { mutate } = useMutation({
    mutationFn: () => {
      return axios.post("https://frontend-take-home-service.fetch.com/auth/login", {
        name,
        email
      }, {
        withCredentials: true
      })
    },
    onSuccess: () => {
      navigate("/search")
    },
  })

  const handlerName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handlerEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlerLogIn = () => {
    const errors: Error = {}    
    let isValid = true
    if (!name) {
      errors.name = {
        error: true,
        message: "not be null"
      }
      isValid = false
    }
    if (!emailRegex.test(email)) {
      errors.email = {
        error: true,
        message: "is not a valid email"
      }
      isValid = false

    }
    setError(errors)

    if(isValid) {
      setError(undefined)
      mutate()
    }

  }

  return (
    <Box width="100%" height="100vh" display="flex" justifyContent="center" alignContent="center">
      <Box display="flex" flexDirection="column" width="500px" alignContent="center" justifyContent="center" >
        <Typography variant="h3" marginBottom="25px">Log in</Typography>
        <TextField error={error?.name?.error} helperText={error?.name?.message} style={{marginBottom: "10px"}} onChange={handlerName} value={name} label="Name"/>
        <TextField error={error?.email?.error} helperText={error?.email?.message} style={{marginBottom: "10px"}} onChange={handlerEmail} value={email} label="Email"/>
        <Button variant='contained' onClick={handlerLogIn}>Send</Button>
      </Box>

    </Box>
  )
}

export default LogIn
