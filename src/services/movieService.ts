import axios from "axios";
import { type Movie } from "../types/movie"; 

const TMDB_KEY = import.meta.env.VITE_TMDB_TOKEN;
const API_URL = 'https://api.themoviedb.org/3/search/movie'

interface MoviesHttpResponse {
    page: number;
    results: Movie[];
    total_pages: number;
}

export default async function fetchMovies(query:string, page:number):Promise<MoviesHttpResponse> {
    const response = await axios.get<MoviesHttpResponse>(API_URL, {
        params: {
            query,
            page,
        },
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_KEY}`,
        }
    })
    return response.data;
}