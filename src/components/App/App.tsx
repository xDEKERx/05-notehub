import { useState } from "react";
import {fetchNotes} from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import css from './App.module.css'
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import NoteModal from "../NoteModal/NoteModal";
import { useDebounce } from "use-debounce";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";


export default function App() {
    const [currentPage, setCurrentPage] = useState(1);
    const [modal, setModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery] = useDebounce(searchQuery, 500)

    const { data, isError, isLoading } = useQuery({
        queryKey: ['notes', debouncedQuery, currentPage],
        queryFn: () => fetchNotes(debouncedQuery, currentPage),
        placeholderData: keepPreviousData,
    })

    const totalPages = data?.totalPages ?? 0;

    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={searchQuery} onSearch={(value) => {
                    setSearchQuery(value);
                    setCurrentPage(1);
                }} />
                {totalPages > 1 && <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />}
                <button className={css.button} onClick={openModal}>Create note +</button>
            </header>
            {isLoading && <Loader />}
            {isError && <ErrorMessage />}
            {data?.notes
                ? (<NoteList notes={data?.notes} />)
                : (!isLoading && !isError && <p className={css.empty}>No notes found</p>) }
            {modal && <NoteModal onClose={closeModal} />}
        </div>
    )
}