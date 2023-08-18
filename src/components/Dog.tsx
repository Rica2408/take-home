import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

export interface DogType {
    id: string
    img: string
    name: string
    age: number
    zip_code: string
    breed: string
}

interface DogProps {
    dog: DogType
    addOrRemoveFavoriteDog?: (dog: DogType) => void
}



const Dog = ({dog, addOrRemoveFavoriteDog}: DogProps) => {
    const {name, age, zip_code, breed, img, id} = dog
    return(
        <Box 
            width="150px" 
            marginLeft="20px" 
            marginBottom="20px" 
            paddingLeft="10px" 
            paddingRight="10px" 
            paddingTop="10px" 
            borderRadius={5}
            display="flex"
            flexDirection="column"
            alignContent="center"
            onClick={() => addOrRemoveFavoriteDog ? addOrRemoveFavoriteDog(dog) : {}} 
            style={{background: "#F0AC03", cursor: "pointer"}}>
            <Typography>Name: {name}</Typography>
            <Typography>Age: {age}</Typography>
            <Typography>Zip code: {zip_code}</Typography>
            <Typography>Breed: {breed}</Typography>
            <img style={{width: "150px", borderRadius: 20}} src={img} alt={id} />
        </Box>
    )
}

export default Dog