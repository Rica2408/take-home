import {
    useQuery,
    UseQueryResult
} from '@tanstack/react-query'
import axios from "axios";

const getBreeds = async () => {
    return (await axios.get("https://frontend-take-home-service.fetch.com/dogs/breeds", { withCredentials: true })).data
}

const getDogIds = async (params: Record<any, any>) => {
    return (await axios.get("https://frontend-take-home-service.fetch.com/dogs/search", { withCredentials: true, params })).data
}

export const useBreed = (): UseQueryResult<string[]> => {
    return useQuery(["breed"], () => {
        return getBreeds()
    })
}

export const useDogIds = (params: Record<any, any>, enabled: boolean): UseQueryResult<any> => {
    return useQuery(["dogsIds"], () => {
        return getDogIds(params)
    }, {
        enabled
    }
    )
}