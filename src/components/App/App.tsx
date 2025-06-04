import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { type Movie } from "../../types/movie";
import { toast, Toaster } from "react-hot-toast"
import css from './App.module.css'
import SearchBar from "../SearchBar/SearchBar";
import MovieModal from "../MovieModal/MovieModal";
import fetchMovies from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import ReactPaginate from "react-paginate";


export default function App() {
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [movieModal, setMovieModal] = useState<Movie | null>(null);

    const { data, isError, isLoading, isSuccess } = useQuery({
        queryKey: ['movies', query, currentPage],
        queryFn: () => fetchMovies(query, currentPage),
        enabled: query !== '',
        placeholderData: keepPreviousData,
    });

    const handleSearch = (query: string) => {
        setQuery(query)
        setCurrentPage(1)
    };

    useEffect(() => {
        if (isSuccess && data.results.length === 0) {
            toast.error('No movies found for your request.')
        }
    })

    const totalPages = data?.total_pages ?? 0;

    const openModal = (movie: Movie) => setMovieModal(movie);
    const closeModal = () => setMovieModal(null);

    return (
        <div className={css.app}>
            <Toaster position="top-right" />
            <SearchBar onSubmit={handleSearch} />
            {isLoading && <Loader />}
            {isError && <ErrorMessage />}
            {!isLoading && !isError && <MovieGrid movies={data?.results} onSelect={openModal} />}
            {isSuccess && totalPages > 1 && (
                <ReactPaginate
                    pageCount={totalPages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    onPageChange={({ selected }) => setCurrentPage(selected + 1)}
                    forcePage={currentPage - 1}
                    containerClassName={css.pagination}
                    activeClassName={css.active}
                    nextLabel="→"
                    previousLabel="←"
                />
            )}
            {movieModal && <MovieModal movie={movieModal} onClose={closeModal}/>}
        </div>
    )
}