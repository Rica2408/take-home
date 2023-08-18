
import { Box, Button, TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Pagination from '@mui/material/Pagination';
import Alert from '@mui/material/Alert';

import { ChangeEvent, useEffect, useState } from "react"
import {
    useMutation
} from '@tanstack/react-query'
import axios from "axios";
import { useBreed } from '../api'
import Dog, { DogType } from '../components/Dog';
import { Link, useNavigate } from 'react-router-dom';

type ParamsType = {
    breeds?: string[],
    from?: number,
    zipCodes?: string[]
}

const SearchBread = () => {
    const navigate = useNavigate()
    const { data: breeds, isLoading, error } = useBreed()
    const [breed, setBreed] = useState("")
    const [favoriteDogs, setFavoreteDogs] = useState<DogType[]>([])
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0)
    const [sortBy, setSortBy] = useState("asc")
    const [zipCode, setZipcode] = useState("")

    const { mutate, data: dogs } = useMutation<DogType[], Error, ParamsType>({
        mutationFn: async (params) => {
            if (params.zipCodes && params?.zipCodes[0] === "") {
                delete params.zipCodes
            }
            const dogIds = await axios.get(`https://frontend-take-home-service.fetch.com/dogs/search?size=20&sort=age:${sortBy}`, { withCredentials: true, params })
            setTotalItems(dogIds.data.total)
            return (await axios.post("https://frontend-take-home-service.fetch.com/dogs",
                [...dogIds.data.resultIds]
                , {
                    withCredentials: true
                })).data
        },
    })

    const { mutate: logOutMutation } = useMutation({
        mutationFn: () => {
            return axios.post("https://frontend-take-home-service.fetch.com/auth/logout", {}, {
                withCredentials: true
            })
        },
        onSuccess: (data) => {
            navigate("/")
        },
    })
    
    const { mutate: matchDogMutation } = useMutation({
        mutationFn: () => {
            return axios.post("https://frontend-take-home-service.fetch.com/dogs/match", favoriteDogs, {
                withCredentials: true
            })
        },
        onSuccess: (data) => {
            navigate(`/matchDog/${data.data.match.id}`)
        },
    })

    const handleChange = (event: SelectChangeEvent) => {
        setBreed(event.target.value as string)
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };


    const handlerZipCode = (e: ChangeEvent<HTMLInputElement>) => {
        setZipcode(e.target.value)
    }

    const handlerMatchDog = () => {
        matchDogMutation()
    }

    const addOrRemoveFavoriteDog = (dog: DogType) => {
        setFavoreteDogs(value => {
            const newValue = [...value]
            const indexDog = newValue?.findIndex(favoriteDog => favoriteDog.id === dog.id)
            if (indexDog > -1) {
                newValue.splice(indexDog, 1)
            } else {
                newValue.push(dog)
            }
            return newValue
        })
    }

    const handlerLogOut = () => {
        logOutMutation()
    }

    useEffect(() => {
        mutate({ breeds: [breed], from: 20 * (page - 1), zipCodes: [zipCode] })
    }, [page, sortBy])


    if (isLoading) {
        return <>...loading</>
    }
    
    if (error) {
        return(
            <Box>
                <Alert severity="error">you are not autheticated
                <Link to="/"> go to the log in</Link>
                </Alert>
            </Box>
        )
    }


    return (
        <Box>
            <Box onClick={handlerLogOut}>
                <Typography align="right" style={{cursor: "pointer"}}>Log out</Typography>
            </Box>
            <Typography variant="h4">Find your Dog</Typography>
            <Box display="flex" alignContent="center" marginTop="10px" justifyContent="center">
                <FormControl style={{ width: "250px", marginRight: "10px" }}>
                    <InputLabel id="select-breed">Breed</InputLabel>
                    <Select
                        labelId="select-breed"
                        value={breed}
                        label="Age"
                        onChange={handleChange}
                    >
                        {breeds?.map((item) =>
                            <MenuItem key={item} value={item}>{item}</MenuItem>
                        )}
                    </Select>
                </FormControl>
                <TextField value={zipCode} onChange={handlerZipCode} label="Zipcode" style={{ marginRight: "10px" }} />
                <Button variant='contained' onClick={() => mutate({ breeds: [breed], zipCodes: [zipCode] })} style={{ marginRight: "10px" }} disabled={!breed}>Search</Button>
                <Button variant='contained' onClick={() => setSortBy(value => value === "asc" ? "desc" : "asc")} disabled={!breed}>{sortBy}</Button>
            </Box>
            <Box display="flex" marginTop="10px">
                <Typography marginRight="10px" align="right" style={{cursor: "pointer"}}>Do you want to know wahts is yor perfect dog?</Typography>
                <Button variant='contained' onClick={handlerMatchDog} disabled={favoriteDogs.length === 0}>Meet him/her</Button>
            </Box>
            {
                dogs?.length ?
                (<>
                    <Typography variant="h4" marginTop="20px">Dogs</Typography>
                    <Box display="flex" justifyContent="center" flexWrap="wrap">
                        {dogs.map(dog => (
                            <Dog
                                key={dog.id}
                                dog={dog}
                                addOrRemoveFavoriteDog={addOrRemoveFavoriteDog}
                            />
                        ))}
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Pagination count={Math.floor(totalItems / 20)} page={page} onChange={handleChangePage} />
                    </Box>
                </>) : null
            }
            {
                favoriteDogs.length ?
                (<>
                    <Typography variant='h4'>Favorites</Typography>
                    <Box display="flex" flexWrap="wrap">
                        {favoriteDogs.map(favorite => (
                            <Dog
                                key={favorite.id}
                                dog={favorite}
                                addOrRemoveFavoriteDog={addOrRemoveFavoriteDog}
                            />
                        ))}
                    </Box>
                </>) : null
            }
        </Box>
    )
}
export default SearchBread