import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "../components/common/SearchBar/SearchBar";

interface SearchContextType {
  results: Product[] | null;
  setResults: (results: Product[] | null) => void;
}

const SearchContext = createContext<SearchContextType>({
  results: null,
  setResults: () => {},
});

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [results, setResults] = useState<Product[] | null>(null);

  return (
    <SearchContext.Provider value={{ results, setResults }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
