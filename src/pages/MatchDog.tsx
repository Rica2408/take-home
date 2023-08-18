import { Alert, Box, Button, Typography } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import Dog, { DogType } from "../components/Dog"
import { useEffect } from "react"

const MatchDog = () => {
    const { dogId } = useParams()
    const navigate = useNavigate()

    const { mutate, data: perfectDog, isLoading, error } = useMutation<DogType[], Error>({
        mutationFn: async () => {
        
            return (await axios.post("https://frontend-take-home-service.fetch.com/dogs",
                [dogId]
                , {
                    withCredentials: true
                })).data
        },
    })

    useEffect(() => {
        mutate()
    }, [])

    if (error) {
        return(
            <Box>
                <Alert severity="error">you are not autheticated
                    <Link to="/"> go to the log in</Link>
                </Alert>
            </Box>
        )
    }

    if(isLoading || !perfectDog) {
        return <>...loading</>
    }


    return(
        <Box display="flex" justifyContent="center" alignItems="center">
            <Box width="500px" borderRadius="20px" flexDirection="column" display="flex" justifyContent="center" alignItems="center" paddingTop="100px" style={{background: "#CFF0FB"}}>
                <Box flexDirection="column" display="flex" justifyContent="center" alignItems="center">
                    <Typography variant="h4">The perfect dog for you is</Typography>
                    <Dog dog={perfectDog[0]}  />
                </Box>
                <Button onClick={() => navigate("/search")} style={{marginBottom: "20px"}} variant="contained">Back</Button>
            </Box>
        </Box>
    )
}


export default MatchDog