import { createContext, PropsWithChildren, useContext, useState } from "react";

type SearchType ={
  searchString: string
}

const SearchContext = createContext({});

const SearchProvider = ({ children }: PropsWithChildren) => {
  const [searchString, setSearchString] = useState("")

  return (
    <SearchContext.Provider value={{ searchString, setSearchString }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;

export const useSearch = () => useContext(SearchContext);
