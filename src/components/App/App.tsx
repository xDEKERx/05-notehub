import { useState } from "react";
import css from './App.module.css'
import SearchBar from "../SearchBar/SearchBar";
import MovieModal from "../MovieModal/MovieModal";
import { type Movie } from "../../types/movie";
import fetchMovies from "../../services/movieService";
import { toast, Toaster } from "react-hot-toast"
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";


export default function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [movieModal, setMovieModal] = useState<Movie | null>(null);

    const handleSearch = async (query: string) => {
        setMovies([]);
        setLoading(true);
        setError(false)
        try {
            const result = await fetchMovies(query);
            if (result.length === 0) {
                toast.error('No movies found for your request.')
            }
            setMovies(result);
        } catch (error) {
            setError(true)
        } finally {
            setLoading(false);
        }
    }

    const openModal = (movie: Movie) => setMovieModal(movie);
    const closeModal = () => setMovieModal(null);

    return (
        <div className={css.app}>
            <Toaster position="top-right" />
            <SearchBar onSubmit={handleSearch} />
            {loading && <Loader />}
            {error && <ErrorMessage />}
            {!loading && !error && <MovieGrid movies={movies} onSelect={openModal}/>}
            {movieModal && <MovieModal movie={movieModal} onClose={closeModal}/>}
        </div>
    )
}