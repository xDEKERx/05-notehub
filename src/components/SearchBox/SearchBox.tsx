import css from './SearchBox.module.css'

interface SearchBoxProps {
    value: string;
    onSearch: (value: string) => void;
}

export default function SearchBox({ value, onSearch }: SearchBoxProps) {
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value)
    }
    
    return (
        <>
            <input
                className={css.input}
                type="text"
                placeholder='Search notes'
                value={value}
                onChange={handleSearch}
            />
        </>
    )
}